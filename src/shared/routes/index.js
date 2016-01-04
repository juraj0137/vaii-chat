import React from "react";
import { Route, IndexRoute } from "react-router";

import App from './../components/app';
import Home from './../components/home/homepage';
import Login from './../components/auth/login';
import NotFound from './../components/notFound/notFound';
import ChannelConversation from './../components/conversation/channelConversation';


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

        function existChnnel(nextState, replaceState) {
            // ak neexistuje chatovaci kanal
            if (store.getState().channels.data.filter((channel)=> {
                    return channel.name == nextState.params.name
                }).length < 1) {
                replaceState({nextPathname: nextState.location.pathname}, '/');
            }
        }

        return (
            <Route path="/">
                <Route component={App} onEnter={requireAuth}>
                    <IndexRoute component={Home}/>
                    <Route path="/channel/:name" component={ChannelConversation} onEnter={existChnnel}/>
                    <Route path="/user/:name" component={StatisticsDashboard}/>
                </Route>
                <Route component={Login} path="login" onEnter={isUnauthorized}/>
                <Route component={NotFound} path="*"/>
            </Route>
        )
    }
}
