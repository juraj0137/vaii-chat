import { CHANNEL_ADD, CHANNEL_LOAD, CHANNEL_LOAD_FAIL, CHANNEL_LOAD_SUCCESS, CHANNEL_RECEIVE, CHANNEL_CHANGE,CHANNEL_REMOVE } from '../constants/ActionTypes';

export function receiveChannel(channel) {
    return {
        type: CHANNEL_RECEIVE,
        channel
    };
}

export function addChannel(channel) {
    return {
        type: CHANNEL_ADD,
        channel
    };
}

export function removeChannel(channel) {
    return {
        type: CHANNEL_REMOVE,
        channel
    };
}

export function changeChannel(channel) {
    return {
        type: CHANNEL_CHANGE,
        channel
    };
}