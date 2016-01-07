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

export function loadUsers(token) {
    return dispatch => {
        dispatch({type: USERS_LOAD_START});

        $.ajax({
            type: "GET",
            url: "/api/v1/user",
            dataType: "json",
            headers: {'x-access-token': token}
        }).done((data)=> {

            if (data.success == true) {
                const users = data.users.map((user) => {
                    if (user.displayName)
                        return {name: user.displayName};
                });
                dispatch({
                    type: USERS_LOAD_SUCCESS,
                    users: users
                });
            } else {
                dispatch({
                    type: USERS_LOAD_FAIL,
                    error: data.error
                });
            }

        }).fail((jqXHR, textStatus) => {
            dispatch({
                type: USERS_LOAD_FAIL,
                error: textStatus
            });
        });
    }
}