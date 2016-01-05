'use strict';

import React from "react";
import Router from "react-router";
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import RoutingContext from 'react-router/lib/RoutingContext'
import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import config from './config';
import websocket from "nodejs-websocket";
import { createStore } from 'redux';
import chatApp from '../shared/reducers/index';
import {Provider} from 'react-redux';
import apiRouter from './api/index';
import mongoose from 'mongoose';
import compression from 'compression';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

var app = express();

// create store
let store = createStore(chatApp);

// react routes
import Routes from "../shared/routes/index.js";
const routes = new Routes(store).getRoutes();

// connect to mongoDB
mongoose.connect(config.mongoDb.url);

//compresia
app.use(compression());

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// make available static files (css, js, img, ...)
app.use('/assets', serveStatic(path.join(__dirname, './../../bower_components'), {maxAge: '30d'}));
app.use('/build/client', serveStatic(path.join(__dirname, './../client'), {maxAge: '30d'}));

app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

app.use(session({ secret: 'mojvelmisilnysessionsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// setup api routes
app.use('/api', apiRouter);

// setup routes
// @todo dorobit server rendering
app.get('/*', (req, res) => {
    //match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
    //    if (error) {
    //        res.status(500).send(error.message)
    //    } else if (redirectLocation) {
    //        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    //    } else if (renderProps) {
            //res.status(200).send(renderToString(<RoutingContext {...renderProps}/>))
            //var content = renderToString(
            //    <Provider store={store}>
            //        <RoutingContext {...renderProps}/>
            //    </Provider>
            //);
            //res.render('index', {content: '', state: JSON.stringify(store.getState())});
            res.render('index', {content: ''});
        //} else {
        //    res.status(404).send('Not found')
        //}
    //})
});

// start the web server
var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});