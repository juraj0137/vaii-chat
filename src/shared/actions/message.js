import { MESSAGE_ADD } from '../constants/ActionTypes';

export function addMessage(message) {
    return {
        type: MESSAGE_ADD,
        message
    };
}