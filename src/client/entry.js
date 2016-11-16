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

        const LOCALSTORAGE_NAME = 'vaii_chat_app_state_v2.0';

        const finalCreateStore = compose(
            applyMiddleware(thunk)
        )(createStore);

        this._browserHistory = createBrowserHistory();

        let store = {};
        let stateFromLocalstorage = localStorage.getItem(LOCALSTORAGE_NAME);

        if (stateFromLocalstorage != null) {
            store = finalCreateStore(chatApp, JSON.parse(stateFromLocalstorage));
        } else {
            store = finalCreateStore(chatApp);
        }

        this._store = store;
        this._routes = (new Routes(store)).getRoutes();

        this.handleWebSockets();

        store.subscribe(() => {
            localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(store.getState()));
            const {lastAction} = store.getState();

            console.log(store.getState());
            console.log(lastAction);

            // ak sme boli pripojeny, autentikujeme sa na websocket
            if (lastAction.type == actionTypes.AUTH_CONNECTED) {
                this.handleWebSockets(true);
            }

        });

        // ak mame token, pripojime sa
        let session = store.getState().session;
        if (typeof session != "undefined" && session.token != null) {
            store.dispatch(connectToken(session.token));

        }


    }

    handleWebSockets(authenticate = false) {

        const io = socketio('http://localhost:3000');
        const store = this._store;
        const session = store.getState().session;

        io.on('connect', function () {
            console.log('ws connected');
            io.on('authenticated', function () {
                console.log('ws authenticated');

                /*
                 * emitovanie strav na websocket
                 */
                store.subscribe(() => {
                    const action = store.getState().lastAction;
                    switch (action.type) {
                        case actionTypes.CHANNEL_ADD_START:
                        case actionTypes.CHANNEL_MSG_LOAD_START:
                        case actionTypes.CHANNELS_LOAD_START:
                        case actionTypes.MESSAGE_ADD_START:
                        case actionTypes.USER_MSG_LOAD_START:
                        case actionTypes.USERS_LOAD_START:
                        case actionTypes.REGISTERED_NEW_USER:
                            io.emit(action.type, action);
                    }
                });

                /*
                 * prijimanie sprav z websocketu
                 */
                io.on(actionTypes.CHANNEL_ADD_SUCCESS, (data)=> {
                    store.dispatch(channelActions.addChannelSuccess(data.data.channel));
                }).on(actionTypes.CHANNEL_ADD_FAIL, (data)=> {
                    store.dispatch(channelActions.addChannelFail(data.data.error));
                });

                io.on(actionTypes.CHANNELS_LOAD_SUCCESS, (data)=> {
                    store.dispatch(channelActions.loadChannelsSuccess(data.data.channels));
                }).on(actionTypes.CHANNELS_LOAD_FAIL, (data)=> {
                    store.dispatch(channelActions.loadChannelsFail(data.data.error));
                });

                io.on(actionTypes.USERS_LOAD_SUCCESS, (data)=> {
                    store.dispatch(userActions.loadUsersSuccess(data.data.users));
                }).on(actionTypes.USERS_LOAD_FAIL, (data)=> {
                    store.dispatch(userActions.loadUsersFail(data.data.error));
                });

                io.on(actionTypes.MESSAGE_ADD_SUCCESS, (data)=> {
                    store.dispatch(messageActions.addMessageSuccess(data.data.message));
                }).on(actionTypes.MESSAGE_ADD_FAIL, (data)=> {
                    store.dispatch(messageActions.addMessageFail(data.data.error));
                });

                io.on(actionTypes.CHANNEL_MSG_LOAD_SUCCESS, (data)=> {
                    store.dispatch(channelActions.loadMessagesForChannelSuccess(data.data.channelId, data.data.messages));
                }).on(actionTypes.CHANNEL_MSG_LOAD_FAIL, (data)=> {
                    store.dispatch(channelActions.loadMessagesForChannelFail(data.data.error));
                });

                io.on(actionTypes.USER_MSG_LOAD_SUCCESS, (data)=> {
                    store.dispatch(userActions.loadMessagesForUserSuccess(data.data.userId_1, data.data.userId_2, data.data.messages));
                }).on(actionTypes.USER_MSG_LOAD_FAIL, (data)=> {
                    store.dispatch(userActions.loadMessagesForUserFail(data.data.error));
                });

                io.on(actionTypes.REGISTERED_NEW_USER_RELOAD, ()=> {
                    console.log('registered new user');
                    store.dispatch(userActions.loadUsers());
                });

                /**
                 * initial load
                 */
                const channelLastReload = store.getState().channels.lastReload;
                if (channelLastReload == null || (new Date() - new Date(channelLastReload) > 5 * 60 * 1000)) {
                    console.log('load channels');
                    store.dispatch(channelActions.loadChannels());
                }

                const usersLastReload = store.getState().channels.lastReload;
                if (usersLastReload == null || (new Date() - new Date(usersLastReload) > 5 * 60 * 1000)) {
                    console.log('load channels');
                    store.dispatch(userActions.loadUsers());
                }

            })

            if (authenticate) {
                io.emit('authenticate', {token: session.token}); // send the jwt
            }
        });
    }

    render() {

        let history = this._browserHistory;
        let store = this._store;
        let routes = this._routes;

        return (
            <Provider store={store}>
                <Router history={history}>
                    {routes}
                </Router>
            </Provider>
        );
    }

}

/*
 * Loggovanie chyb
 */
window.onerror = (message, file, line) => {
    //const msg = (file + ':' + line + '\n\n' + message);
    //ApiManager.logError(msg);
};

ReactDOM.render(<Client/>, document.getElementById('react'));
