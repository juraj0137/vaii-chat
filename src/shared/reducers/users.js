'use strict';
import * as actionTypes from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    loading: false,
    lastReload: null,
    error: '',
    data: []
};

export default function users(state = initialState, action) {
    switch (action.type) {
        case actionTypes.USER_ADD:
            if (state.data.filter(user => user.name === action.user.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.user.name
                }]
            });
        case actionTypes.USER_RECEIVE:
            if (state.data.filter(user => user.name === action.user.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.user.name
                }]
            });
        case actionTypes.USER_REMOVE:
            return Object.assign({}, state, {
                data: state.data.filter((user) => {
                    return user.name != action.user.name;
                })
            });

        case actionTypes.USERS_LOAD_START:
            return Object.assign({}, state, {
                loading: true
            });
        case actionTypes.USERS_LOAD_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                loaded: true,
                lastReload: new Date(),
                data: action.users
            });
        case actionTypes.USERS_LOAD_FAIL:
            return Object.assign({}, state, {
                loading: false,
                loaded: false,
                error: action.error
            });

        case actionTypes.USER_MSG_LOAD_START:
        case actionTypes.USER_MSG_LOAD_SUCCESS:
        case actionTypes.USER_MSG_LOAD_FAIL:
            const data = state.data.map(user => {
                if (user.id === action.userId_1) {
                    let newUser = {
                        loading: false,
                        loaded: false,
                        error: ''
                    };
                    switch (action.type) {
                        case actionTypes.USER_MSG_LOAD_START:
                            newUser = Object.assign({}, newUser, {
                                loading: true,
                                loaded: false,
                                error: ''
                            });
                            break;
                        case actionTypes.USER_MSG_LOAD_SUCCESS:
                            newUser = Object.assign({}, newUser, {
                                loading: false,
                                loaded: true,
                                error: '',
                                lastMessagesReload: new Date()
                            });
                            break;
                        case actionTypes.USER_MSG_LOAD_FAIL:
                            newUser = Object.assign({}, newUser, {
                                loading: false,
                                loaded: false,
                                error: action.error
                            });
                            break;
                    }
                    return Object.assign({}, user, newUser);
                }
                return user;
            });
            return Object.assign({}, state, {
                data: data
            });
            break;

        default:
            return state;
    }
}