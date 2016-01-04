'use strict';

import { CHANNEL_ADD, CHANNEL_LOAD, CHANNEL_LOAD_FAIL, CHANNEL_LOAD_SUCCESS, CHANNEL_RECEIVE, CHANNEL_REMOVE } from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    data: []
};

export default function channels(state = initialState, action) {
    switch (action.type) {
        case CHANNEL_ADD:
            if (state.data.filter(channel => channel.name === action.channel.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.channel.name,
                    channelType: 'CHANNEL_PUBLIC'
                }]
            });
        case CHANNEL_RECEIVE:
            if (state.data.filter(channel => channel.name === action.channel.name).length !== 0) {
                return state;
            }
            return Object.assign({}, state, {
                data: [...state.data, {
                    name: action.channel.name,
                    channelType: 'CHANNEL_PUBLIC'
                }]
            });
        case CHANNEL_REMOVE:
            return Object.assign({}, state, {
                data: state.data.filter((channel) => {
                    return channel.name != action.channel.name;
                })
            });
        case CHANNEL_LOAD:
            return Object.assign({}, state, {
                loading: true
            });
        case CHANNEL_LOAD_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                loaded: true,
                data: action.channels
            });
        case CHANNEL_LOAD_FAIL:
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