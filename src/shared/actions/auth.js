'use strict';
import { AUTH_CREDENTIALS_CONNECTING, AUTH_TOKEN_CONNECTING, AUTH_CONNECTED, AUTH_ERROR, AUTH_DISCONECTED, AUTH_SET_ERR_MSG } from '../constants/ActionTypes';


export function connect(credentials, success) {
    return dispatch => {
        dispatch({type: AUTH_CREDENTIALS_CONNECTING});

        $.ajax({
            type: "POST",
            url: "/api/v1/auth/connectCredentials",
            dataType: "json",
            data: {
                email: credentials.email,
                pass: credentials.pass
            }
        }).done((data)=> {

            if (data.success == true) {
                dispatch(connectSuccess(data));

                if(typeof success == "function")
                    success();
            } else {
                dispatch(connectError(data.message));
            }

        }).fail((jqXHR, textStatus) => {
            dispatch(connectError(textStatus));
        });
    }
}

export function  connectToken(token, success) {
    return dispatch => {
        dispatch({type: AUTH_TOKEN_CONNECTING});

        $.ajax({
            type: "POST",
            url: "/api/v1/auth/connectToken",
            dataType: "json",
            data: {token: token}
        }).done((data)=> {

            if (data.success == true) {
                dispatch(connectSuccess(data));
                if(typeof success == "function"){
                    success();
                }
            } else {
                dispatch(connectError(data.message));
            }

        }).fail((jqXHR, textStatus) => {
            dispatch(connectError(textStatus));
        });
    }
}

export function connectSuccess(data) {
    return {
        type: AUTH_CONNECTED,
        user: data.user,
        token: data.token
    };
}

export function connectError(errorMessage) {
    return {
        type: AUTH_ERROR,
        message: errorMessage
    };
}

export function setErrorMessage(message) {
    return {
        type: AUTH_SET_ERR_MSG,
        message: message
    };
}

export function disconnect(message, cb) {
    return dispatch => {
        dispatch({
            type: AUTH_DISCONECTED,
            message: message
        });
        cb();
    }
}