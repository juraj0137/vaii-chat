'use strict';

import { AUTH_CREDENTIALS_CONNECTING, AUTH_CONNECTED, AUTH_ERROR, AUTH_DISCONECTED, AUTH_SET_ERR_MSG } from '../constants/ActionTypes';

const initialState = {
    connected: false,
    loading: false,
    token: null,
    user: null,
    errorMessage: null
};

export default function session(state = initialState, action) {

    switch (action.type) {
        case AUTH_CREDENTIALS_CONNECTING:
            return {
                loading: true,
                connected: false,
                token: state.token,
                errorMessage: null,
                user: null
            };

        case AUTH_CONNECTED:
            return {
                loading: false,
                connected: true,
                token: action.token,
                errorMessage: null,
                user: action.user
            };

        case AUTH_DISCONECTED:
        case AUTH_ERROR:
            return {
                loading: false,
                connected: false,
                token: null,
                errorMessage: action.message,
                user: null
            };
        case AUTH_SET_ERR_MSG:
            return {
                loading: state.loading,
                connected: state.connected,
                token: state.token,
                errorMessage: action.message,
                user: state.user
            };

        default:
            return state;
    }

}