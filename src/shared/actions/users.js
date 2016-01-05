import { USER_ADD, USER_LOAD, USER_LOAD_FAIL, USER_LOAD_SUCCESS, USER_RECEIVE, USER_REMOVE } from '../constants/ActionTypes';

export function receiveUser(user) {
    return {
        type: USER_RECEIVE,
        user
    };
}

export function addUser(user) {
    return {
        type: USER_ADD,
        user
    };
}

export function removeUser(user) {
    return {
        type: USER_REMOVE,
        user
    };
}

export function changeUser(user) {
    return {
        type: USER_CHANGE,
        user
    };
}