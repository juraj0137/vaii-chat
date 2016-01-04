'use strict';

import { AUTH_CONNECTING, AUTH_CONNECTED, AUTH_ERROR, AUTH_DISCONECTED } from '../constants/ActionTypes';

const initialState = {
    connected: false,
    loading: false,
    token: null,
    user: null,
    errorMessage: null
};

export default function session(state = initialState, action) {

    switch (action.type) {
        case AUTH_CONNECTING:
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

        default:
            return state;
    }

}