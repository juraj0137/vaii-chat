'use strict';
import * as actionTypes from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    loading: false,
    lastReload: null,
    added: false,
    adding: false,
    error: '',
    data: []
};

export default function channels(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANNEL_ADD_START:
            return Object.assign({}, state, {
                adding: true,
                added: false,
                error: ''
            });
            break;

        case actionTypes.CHANNEL_ADD_SUCCESS:
            if (state.data.filter(channel => channel.id === action.channel.id).length !== 0) {
                return Object.assign({}, state, {
                    adding: false,
                    added: false,
                    error: 'Pokusate sa pridat kanal s rovnakym id'
                });
            }

            return Object.assign({}, state, {
                adding: false,
                added: true,
                data: [...state.data, {
                    id: action.channel.id,
                    name: action.channel.name,
                    lastMessagesReload: null
                }]
            });
            break;

        case actionTypes.CHANNEL_ADD_FAIL:
            return Object.assign({}, state, {
                adding: false,
                added: false,
                error: action.error
            });
            break;

        case actionTypes.CHANNELS_LOAD_START:
            return Object.assign({}, state, {
                loading: true,
                loaded: false,
                error: ''
            });
            break;

        case actionTypes.CHANNELS_LOAD_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                loaded: true,
                data: action.channels,
                lastReload: new Date()
            });
            break;

        case actionTypes.CHANNELS_LOAD_FAIL:
            return Object.assign({}, state, {
                loading: false,
                loaded: false,
                error: action.error
            });
            break;

        case actionTypes.CHANNEL_MSG_LOAD_START:
        case actionTypes.CHANNEL_MSG_LOAD_SUCCESS:
        case actionTypes.CHANNEL_MSG_LOAD_FAIL:
            const data = state.data.map(channel => {
                if (channel.id === action.channelId) {
                    let newChannel = {
                        loading: false,
                        loaded: false,
                        error: ''
                    };
                    switch (action.type) {
                        case actionTypes.CHANNEL_MSG_LOAD_START:
                            newChannel = Object.assign({},newChannel, {
                                loading: true
                            });
                            break;
                        case actionTypes.CHANNEL_MSG_LOAD_SUCCESS:
                            newChannel = Object.assign({},newChannel, {
                                loaded: true,
                                lastMessagesReload: new Date()
                            });
                            break;
                        case actionTypes.CHANNEL_MSG_LOAD_FAIL:
                            newChannel = Object.assign({},newChannel, {
                                error: action.error
                            });
                            break;
                    }
                    return Object.assign({}, channel, newChannel);
                }
                return channel;
            });
            return Object.assign({}, state, {
                data: data
            });
            break;

        default:
            return state;
    }
}
