'use strict';
import { AUTH_CONNECTING, AUTH_CONNECTED, AUTH_ERROR, AUTH_DISCONECTED } from '../constants/ActionTypes';


export function connect(credentials, success) {
    return dispatch => {
        dispatch({type: 'AUTH_CONNECTING'});

        $.ajax({
            type: "POST",
            url: "/api/v1/auth",
            dataType: "json",
            data: {
                email: credentials.email,
                pass: credentials.pass
            }
        }).done((data)=> {

            if (data.success == true) {
                dispatch(connectSuccess(data));
                success();
            } else {
                dispatch(connectError(data.message));
            }

        }).fail((jqXHR, textStatus) => {

            dispatch(connectError(textStatus));

        });
    }
}

export function connectSuccess(data) {

    const localstorageData = {
        user: data.user,
        token: data.token
    };
    localStorage.setItem('userData', JSON.stringify(localstorageData));

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

export function disconnect(message, cb) {
    return dispatch => {
        dispatch({type: AUTH_DISCONECTED, message: message});
        localStorage.removeItem('userData');
        cb();
    }
}