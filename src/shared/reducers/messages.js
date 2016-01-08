'use strict';

import { MESSAGE_ADD_START, MESSAGE_ADD_SUCCESS, MESSAGE_ADD_FAIL } from '../constants/ActionTypes';

const initialState = {
    loaded: false,
    loading: false,
    added: false,
    adding: false,
    error: '',
    tmpMessage: {},
    data: []
};

export default function messages(state = initialState, action) {
    switch (action.type) {
        case MESSAGE_ADD_START:
            return Object.assign({},state,{
                adding: true,
                added: false,
                error: '',
                tmpMessage: {
                    content: action.message.content,
                    referenceId: action.message.referenceId,
                    referenceType: action.message.referenceType,
                    author: action.message.authorId
                }
            });

        case MESSAGE_ADD_SUCCESS:
            if (state.data.filter(message => message.id === action.message.id).length !== 0) {
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
                    id: action.message.id,
                    created: action.message.created,
                    content: action.message.content,
                    referenceId: action.message.referenceId,
                    referenceType: action.message.referenceType,
                    author: action.message.author
                }],
                tmpChannel: {}
            });

        case MESSAGE_ADD_FAIL:
            return Object.assign({},state,{
                adding: false,
                added: false,
                error: action.error
            });

        default:
            return state;
    }
}