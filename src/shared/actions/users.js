import { USER_ADD, USERS_LOAD_START, USERS_LOAD_FAIL, USERS_LOAD_SUCCESS, USER_RECEIVE, USER_REMOVE } from '../constants/ActionTypes';

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

export function loadUsers() {
    return {
        type: USERS_LOAD_START
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
        type: USERS_LOAD_SUCCESS,
        users
    };
}
export function loadUsersFail(error) {
    return {
        type: USERS_LOAD_FAIL,
        error
    };
}