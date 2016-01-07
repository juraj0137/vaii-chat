
import { CHANNEL_ADD_START, CHANNEL_ADD_SUCCESS, CHANNEL_ADD_FAIL, CHANNEL_LOAD_FAIL, CHANNEL_LOAD_SUCCESS, CHANNEL_LOAD_START } from '../constants/ActionTypes';

export function addChannel(channel) {
    return {
        type: CHANNEL_ADD_START,
        channel
    };
}
export function addChannelSuccess(channel) {
    return {
        type: CHANNEL_ADD_SUCCESS,
        channel: channel
    };
}
export function addChannelFail(error) {
    return {
        type: CHANNEL_ADD_START,
        error: error
    };
}

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











export function receiveChannel(channel) {
    return {
        type: CHANNEL_RECEIVE,
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