import * as actionTypes from '../constants/ActionTypes';
import * as messageActions from './message';

/**
 * Adding one channel
 */
export function addChannel(channel) {
    return {
        type: actionTypes.CHANNEL_ADD_START,
        channel: channel
    };
}
export function addChannelSuccess(channel) {
    return {
        type: actionTypes.CHANNEL_ADD_SUCCESS,
        channel: channel
    };
}
export function addChannelFail(error) {
    return {
        type: actionTypes.CHANNEL_ADD_START,
        error: error
    };
}

/**
 * Loading all channels
 */
export function loadChannels() {
    return {type: actionTypes.CHANNELS_LOAD_START};
}
export function loadChannelsSuccess(data) {
    const channels = data.map((channel)=> {
        return {
            id: channel.id,
            name: channel.name
        }
    });
    return {
        type: actionTypes.CHANNELS_LOAD_SUCCESS,
        channels: channels
    };
}
export function loadChannelsFail(error) {
    return {
        type: actionTypes.CHANNELS_LOAD_FAIL,
        error: error
    };
}

/**
 * Load messages for channel
 */
export function loadMessagesForChannel(channelId) {
    return {
        type: actionTypes.CHANNEL_MSG_LOAD_START,
        channelId: channelId
    }
}
export function loadMessagesForChannelSuccess(channelId, messages) {
    return dispatch => {
        dispatch(messageActions.addBulkOfMessages(messages));
        dispatch({
            type: actionTypes.CHANNEL_MSG_LOAD_SUCCESS,
            channelId: channelId
        });
    }
}
export function loadMessagesForChannelFail(error) {
    return {
        type: actionTypes.CHANNEL_MSG_LOAD_FAIL,
        error: error
    }
}


/**
 * @todo delete
 */

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