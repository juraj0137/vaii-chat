import * as actionTypes from '../constants/ActionTypes';
import * as messageActions from './message';
export function receiveUser(user) {
    return {
        type: actionTypes.USER_RECEIVE,
        user
    };
}

export function addUser(user) {
    return {
        type: actionTypes.USER_ADD,
        user
    };
}

export function removeUser(user) {
    return {
        type: actionTypes.USER_REMOVE,
        user
    };
}

export function changeUser(user) {
    return {
        type: actionTypes.USER_CHANGE,
        user
    };
}

export function loadUsers() {
    return {
        type: actionTypes.USERS_LOAD_START
    };
}
export function loadUsersSuccess(data) {
    const users = data.map((user)=>{
        return {
            id: user.id,
            name: user.name
        }
    });
    return {
        type: actionTypes.USERS_LOAD_SUCCESS,
        users
    };
}
export function loadUsersFail(error) {
    return {
        type: actionTypes.USERS_LOAD_FAIL,
        error
    };
}


/**
 * Load messages for user
 */
export function loadMessagesForUser(userId_1, userId_2) {
    return {
        type: actionTypes.USER_MSG_LOAD_START,
        userId_1: userId_1,
        userId_2: userId_2
    }
}
export function loadMessagesForUserSuccess(userId_1, userId_2, messages) {
    return dispatch => {
        dispatch(messageActions.addBulkOfMessages(messages));
        dispatch({
            type: actionTypes.USER_MSG_LOAD_SUCCESS,
            userId_1: userId_1,
            userId_2: userId_2
        });
    }
}
export function loadMessagesForUserFail(error) {
    return {
        type: actionTypes.USER_MSG_LOAD_FAIL,
        error: error
    }
}

export function registeredNewUser() {
    return {
        type: actionTypes.REGISTERED_NEW_USER
    }
}