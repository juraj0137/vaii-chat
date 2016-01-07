import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router";
import Routes from "../shared/routes/index.js";
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import chatApp from '../shared/reducers/index';
import {connectToken} from '../shared/actions/auth';
import {loadUsers} from '../shared/actions/users';
import { ApiManager } from '../shared/services/ApiManager';
import socketio from 'socket.io-client';

class Client extends React.Component {

    constructor(props) {
        super(props);

        const finalCreateStore = compose(
            applyMiddleware(thunk)
        )(createStore);

        this._browserHistory = createBrowserHistory();

        let store = {};
        let io = socketio('http://128.199.46.74:3000');

        let stateFromLocalstorage = localStorage.getItem('app_state');
        //stateFromLocalstorage = null;

        if (stateFromLocalstorage != null) {
            store = finalCreateStore(chatApp, JSON.parse(stateFromLocalstorage));
        } else {
            store = finalCreateStore(chatApp);
        }

        store.subscribe(() => {
            localStorage.setItem('app_state', JSON.stringify(store.getState()));
            console.log('new state after state change:');
            console.log(store.getState());
            console.log('last action:');
            console.log(store.getState().lastAction);
        });

        // ak mame token pripojime sa
        let session = store.getState().session;
        if (typeof session != "undefined" && session.token != null) {
            store.dispatch(connectToken(session.token, ()=> {

                io.on('connect', function () {
                    io.on('authenticated', function () {

                            io.emit('chat message', {msg: 'hovnoo'});
                        })
                        .emit('authenticate', {token: session.token}); // send the jwt
                })

                store.dispatch(loadUsers(session.token));
                this._browserHistory.pushState(null, '/');
            }));

        }

        this._store = store;
        this._routes = (new Routes(store)).getRoutes();

    }

    componentDidMount() {

    }

    render() {

        let history = this._browserHistory,
            store = this._store,
            routes = this._routes;

        return (
            <Provider store={store}>
                <Router history={history}>
                    {routes}
                </Router>
            </Provider>
        );
    }

}

window.onerror = (message, file, line) => {
    const msg = (file + ':' + line + '\n\n' + message);
    ApiManager.logError(msg);
};

ReactDOM.render(<Client/>, document.getElementById('react'));