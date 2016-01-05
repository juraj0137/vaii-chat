'use strict';
import { USER_ADD, USER_LOAD, USER_LOAD_FAIL, USER_LOAD_SUCCESS, USER_RECEIVE, USER_REMOVE } from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    data: []
};

export default function users(state = initialState, action) {
    switch (action.type) {
        case USER_ADD:
            if (state.data.filter(user => user.name === action.user.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.user.name
                }]
            });
        case USER_RECEIVE:
            if (state.data.filter(user => user.name === action.user.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.user.name
                }]
            });
        case USER_REMOVE:
            return Object.assign({}, state, {
                data: state.data.filter((user) => {
                    return user.name != action.user.name;
                })
            });
        case USER_LOAD:
            return Object.assign({}, state, {
                loading: true
            });
        case USER_LOAD_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                loaded: true,
                data: action.users
            });
        case USER_LOAD_FAIL:
            return Object.assign({}, state, {
                loading: false,
                loaded: false,
                error: action.error,
                data: [...state.data]
            });
        default:
            return state;
    }
}