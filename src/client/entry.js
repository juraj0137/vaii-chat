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

import * as actionTypes from '../shared/constants/ActionTypes';
import * as channelActions from '../shared/actions/channels';
import * as userActions from '../shared/actions/users';
import * as messageActions from '../shared/actions/message';

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
            console.log(store.getState());
            console.log(store.getState().lastAction);
        });

        // ak mame token pripojime sa
        let session = store.getState().session;
        if (typeof session != "undefined" && session.token != null) {
            store.dispatch(connectToken(session.token, ()=> {

                io.on('connect', function () {

                    io.on('authenticated', function () {


                        // odosielanie
                        store.subscribe(() => {
                            const action = store.getState().lastAction;
                            switch (action.type) {
                                case actionTypes.CHANNEL_LOAD_START:
                                case actionTypes.CHANNEL_ADD_START:
                                case actionTypes.USERS_LOAD_START:
                                case actionTypes.MESSAGE_ADD_START:
                                    io.emit(action.type, action);
                            }
                        });

                        //prijimanie
                        io.on(actionTypes.CHANNEL_ADD_SUCCESS, (data)=> {
                            store.dispatch(channelActions.addChannelSuccess(data.data.channel));
                        }).on(actionTypes.CHANNEL_ADD_FAIL, (data)=> {
                            store.dispatch(channelActions.addChannelFail(data.data.error));
                        }).on(actionTypes.CHANNEL_LOAD_SUCCESS, (data)=> {
                            store.dispatch(channelActions.loadChannelsSuccess(data.data.channels));
                        }).on(actionTypes.CHANNEL_LOAD_FAIL, (data)=> {
                            store.dispatch(channelActions.loadChannelsFail(data.data.error));
                        }).on(actionTypes.USERS_LOAD_SUCCESS, (data)=> {
                            store.dispatch(userActions.loadUsersSuccess(data.data.users));
                        }).on(actionTypes.USERS_LOAD_FAIL, (data)=> {
                            store.dispatch(userActions.loadUsersFail(data.data.error));
                        }).on(actionTypes.MESSAGE_ADD_SUCCESS, (data)=> {
                            store.dispatch(messageActions.addMessageSuccess(data.data.message));
                        }).on(actionTypes.MESSAGE_ADD_FAIL, (data)=> {
                            store.dispatch(messageActions.addMessageFail(data.data.error));
                        });

                        // initial load
                        store.dispatch(channelActions.loadChannels());
                        store.dispatch(userActions.loadUsers());

                    }).emit('authenticate', {token: session.token}); // send the jwt
                });

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