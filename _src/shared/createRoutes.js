import React from 'react';
import {IndexRoute, Route} from 'react-router';

export default function createRoutes(getState) {

    function requireAuth(nextState, replaceState) {
        const loggedInUser = getState().users.viewer;
        if (!loggedInUser) {
            replaceState({nextPathname: nextState.location.pathname}, '/login');
        }
    }

    return (
        <Route component={App} path="/">
        </Route>
    );

}
//<IndexRoute component={Chatboard} onEnter={requireAuth}/>
//<Route component={Auth} path="login"/>
//<Route component={Todos} path="todos"/>
//<Route component={NotFound} path="*"/>
