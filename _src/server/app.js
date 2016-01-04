import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import config from './config';
import render from './render';

require("babel-polyfill");

var app = express();
var server = http.Server(app);

import User from '../../src/shared/model/user';
import Message from '../../src/shared/model/message';
import Channel from '../../src/shared/model/channel';

mongoose.connect(config.mongoDb.url);

// allow CORS
//app.all('*', function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
//    if (req.method == 'OPTIONS') {
//        res.status(200).end();
//    } else {
//        next();
//    }
//});


//app.get('*', render);


//var newUser = new User();
//
//User.find({}, function (err, users) {
//   console.log(users);
//    users.forEach(function (user) {
//        user.remove();
//    })
//});
//
//newUser.local.displayName = 'Kvak';
//newUser.local.email = 'kvak@kvak.sk';
//newUser.local.pass = newUser.generateHash('heslo');
//
//newUser.save(function (err) {
//    if (err)
//        throw err;
//
//    console.log(newUser);
//});