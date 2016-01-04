import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router";
import Routes from "../shared/routes/index.js";
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import chatApp from '../shared/reducers/index';
import {connectSuccess} from '../shared/actions/auth';

class Client extends React.Component {

    constructor(props) {
        super(props);

        const finalCreateStore = compose(
            applyMiddleware(thunk)
        )(createStore);

        let store = {};

        let stateFromLocalstorage = localStorage.getItem('app_state');
        //console.log(stateFromLocalstorage);

        if (stateFromLocalstorage != null) {
            store = finalCreateStore(chatApp, JSON.parse(stateFromLocalstorage));

            //console.log('initializing store with windows state:');
            console.log(store.getState());
        } else {
            store = finalCreateStore(chatApp);

            //console.log('initializing store without windows state:');
            //console.log(store.getState());
        }

        store.subscribe(() => {
            localStorage.setItem('app_state', JSON.stringify(store.getState()));
            console.log('new state after state change:');
            console.log(store.getState());
            console.log('last action:');
            console.log(store.getState().lastAction);
        });

        if (localStorage.getItem('userData') != undefined) {
            const localstorageData = JSON.parse(localStorage.getItem('userData'));
            store.dispatch(connectSuccess(localstorageData));
        }

        //this._routes = new Routes(store, props).getRoutes();
        this._store = store;
    }

    componentDidMount(){

    }

    render() {

        let history = createBrowserHistory(),
            store = this._store;

        return (
            <Provider store={store}>
                <Router history={history}>
                    {(new Routes(store)).getRoutes()}
                </Router>
            </Provider>
        );
    }

}

ReactDOM.render(<Client/>, document.getElementById('react'));