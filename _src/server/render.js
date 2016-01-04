import Promise from 'bluebird';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
//import configureStore from '../../common/configureStore';
//import createRoutes from '../../browser/createRoutes';
import {Provider} from 'react-redux';
import {RoutingContext, match} from 'react-router';

export default function render(req, res, next) {
    const initialState = {
        device: {
            isMobile: ['phone', 'tablet'].indexOf(req.device.type) > -1
        }
    };

    const store = configureStore({initialState});
    const routes = createRoutes(() => store.getState());
    const location = req.url;

    match({routes, location}, (error, redirectLocation, renderProps) => {

        if (redirectLocation) {
            res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            return;
        }

        if (error) {
            next(error);
            return;
        }

        try {
            fetchComponentDataAsync(store.dispatch, renderProps);
            const html = getAppHtml(store, renderProps);
            res.render('index', {content: content, state: JSON.stringify(store.getState())});
        } catch (e) {
            next(e);
        }
    });
}

async function fetchComponentDataAsync(dispatch, {components, location, params}) { // eslint-disable-line space-before-function-paren
    const fetchActions = components.reduce((actions, component) => {
        return actions.concat(component.fetchActions || []);
    }, []);
    const promises = fetchActions.map(action => dispatch(action(
        {location, params}
    )));

    await Promise.all(promises);
}

async function getAppHtml(store, renderProps) {
    return ReactDOMServer.renderToString(
        <Provider store={store}>
            <RoutingContext {...renderProps} />
        </Provider>
    );
}
