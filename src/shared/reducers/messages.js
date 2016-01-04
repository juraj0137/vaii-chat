'use strict';

import { MESSAGE_ADD, MESSAGE_RECEIVE } from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    data: []
};

export default function messages(state = initialState, action) {
    switch (action.type) {
        case MESSAGE_ADD:
            return Object.assign({}, state, {
                data: [...state.data, {
                    id: action.message.id,
                    messageType: action.message.messageType,
                    referenceName: action.message.referenceName,
                    text: action.message.text,
                    user: action.message.user,
                    time: action.message.time
                }]
            });
        case MESSAGE_RECEIVE:
            return Object.assign({}, state, {
                data: [...state.data, {
                    id: action.message.id,
                    messageType: action.message.messageType,
                    referenceName: action.message.referenceName,
                    text: action.message.text,
                    user: action.message.user,
                    time: action.message.time
                }]
            });
        default:
            return state;
    }
}