'use strict';

import * as actionTypes from '../constants/ActionTypes';
import Utils from '../utils';

const initialState = {
    loaded: false,
    loading: false,
    added: false,
    adding: false,
    error: '',
    data: []
};

export default function messages(state = initialState, action) {
    switch (action.type) {
        case actionTypes.MESSAGE_ADD_START:
            return Object.assign({}, state, {
                adding: true,
                added: false,
                error: ''
            });

        case actionTypes.MESSAGE_ADD_SUCCESS:
            if (state.data.filter(message => message.id === action.message.id).length !== 0) {
                return Object.assign({}, state, {
                    adding: false,
                    added: false,
                    error: 'Pokusate sa pridat spravu s rovnakym id'
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
                    author: action.message.author,
                    readed: false
                }]
            });

        case actionTypes.MESSAGE_ADD_FAIL:
            return Object.assign({}, state, {
                adding: false,
                added: false,
                error: action.error
            });

        case actionTypes.MESSAGE_ADD_BULK:
            const currentMessageIds = state.data.map((message, id)=> {
                return message.id;
            });

            const newMessages = action.messages.filter((message)=> {
                return !Utils.inArray(message.id, currentMessageIds);
            });

            return Object.assign({}, state, {
                data: state.data.concat( newMessages)
            });

        case actionTypes.MESSAGE_READ:
            const messages = state.data.map((message) => {
                if(Utils.inArray(message.id, action.readedIds)){
                    return Object.assign({},message,{
                        readed: true
                    })
                }
                return message;
            });

            return Object.assign({}, state, {
                data: messages
            });

        default:
            return state;
    }
}