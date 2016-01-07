'use strict';

import { CHANNEL_ADD_START, CHANNEL_ADD_SUCCESS, CHANNEL_ADD_FAIL, CHANNEL_LOAD_FAIL, CHANNEL_LOAD_SUCCESS, CHANNEL_LOAD_START } from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    loading: false,
    added: false,
    adding: false,
    error: '',
    tmpChannel: {},
    data: []
};

export default function channels(state = initialState, action) {
    switch (action.type) {
        case CHANNEL_ADD_START:
            return Object.assign({},state,{
                adding: true,
                added: false,
                error: '',
                tmpChannel: {
                    name: action.channel.name
                }
            });

        case CHANNEL_ADD_SUCCESS:
            console.log(action);
            console.log(action.channel);
            if (state.data.filter(channel => channel.id === action.channel.id).length !== 0) {
                return Object.assign({},state,{
                    adding: false,
                    added: false,
                    tmpChannel: {},
                    error: 'Pokusate sa pridat kanal s rovnakym id'
                });
            }

            return Object.assign({}, state, {
                adding: false,
                added: true,
                data: [...state.data, {
                    id: action.channel.id,
                    name: action.channel.name
                }],
                tmpChannel: {}
            });

        case CHANNEL_ADD_FAIL:
            return Object.assign({},state,{
                adding: false,
                added: false,
                error: action.error
            });


        //case CHANNEL_REMOVE:
        //    return Object.assign({}, state, {
        //        data: state.data.filter((channel) => {
        //            return channel.name != action.channel.name;
        //        })
        //    });

        case CHANNEL_LOAD_START:
            return  Object.assign({},state,{
                loading: true,
                loaded: false,
                error: ''
            });

        case CHANNEL_LOAD_SUCCESS:
            return Object.assign({},state,{
                loading: false,
                loaded: true,
                data: action.channels
            });

        case CHANNEL_LOAD_FAIL:
            return Object.assign({},state,{
                loading: false,
                loaded: false,
                error: action.error
            });

        default:
            return state;
    }
}