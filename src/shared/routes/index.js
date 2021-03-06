import React from "react";
import { Route, IndexRoute } from "react-router";

import App from './../components/app';
import Home from './../components/home/homepage';
import Login from './../components/auth/login';
import Register from './../components/auth/register';
import NotFound from './../components/notFound/notFound';
import ChannelConversation from './../components/conversation/channelConversation';
import UserConversation from './../components/conversation/userConversation';


import VotingList from './../components/voting/votingList';
import StatisticsDashboard from './../components/statistics/dashboard';

export default class Routes {

    constructor(store) {
        this._store = store;
    }

    getRoutes() {

        let store = this._store;

        function requireAuth(nextState, replaceState) {
            if (!store.getState().session.connected)
                replaceState({nextPathname: nextState.location.pathname}, '/login');
        }

        function isUnauthorized(nextState, replaceState) {
            if (store.getState().session.connected)
                replaceState({nextPathname: nextState.location.pathname}, '/');
        }

        function existChannel(nextState, replaceState) {
            // ak neexistuje chatovaci kanal
            if (store.getState().channels.data.filter((channel)=> {
                    return channel.id == nextState.params.id
                }).length < 1) {
                replaceState({nextPathname: nextState.location.pathname}, '/');
            }
        }


        function existUser(nextState, replaceState) {
            // ak neexistuje pouzivate na chatovanie
            const loginUserId = store.getState().session.user._id;
            if (store.getState().users.data.filter((user)=> {
                    return user.id == nextState.params.id && user.id != loginUserId;
                }).length < 1) {
                replaceState({nextPathname: nextState.location.pathname}, '/');
            }
        }

        return (
            <Route path="/">
                <Route component={App} onEnter={requireAuth}>
                    <IndexRoute component={Home}/>
                    <Route path="/channel/:id" component={ChannelConversation} onEnter={existChannel}/>
                    <Route path="/user/:id" component={UserConversation} onEnter={existUser}/>
                </Route>
                <Route component={Login} path="login" onEnter={isUnauthorized}/>
                <Route component={Register} path="register" onEnter={isUnauthorized}/>
                <Route component={NotFound} path="*"/>
            </Route>
        )
    }
}
