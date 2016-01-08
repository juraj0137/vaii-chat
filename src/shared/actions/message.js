import { MESSAGE_ADD_START, MESSAGE_ADD_SUCCESS, MESSAGE_ADD_FAIL } from '../constants/ActionTypes';

export function addMessage(message) {
    return {
        type: MESSAGE_ADD_START,
        message: message
    };
}
export function addMessageSuccess(message) {
    return {
        type: MESSAGE_ADD_SUCCESS,
        message: message
    };
}
export function addMessageFail(error) {
    return {
        type: MESSAGE_ADD_FAIL,
        error: error
    };
}

/*
export function loadChannels() {
    return {
        type: CHANNEL_LOAD_START
    };
}
export function loadChannelsSuccess(data) {
    const channels = data.map((channel)=>{
        return {
            id: channel.id,
            name: channel.name
        }
    });
    return {
        type: CHANNEL_LOAD_SUCCESS,
        channels
    };
}
export function loadChannelsFail(error) {
    return {
        type: CHANNEL_LOAD_FAIL,
        error
    };
}

*/
