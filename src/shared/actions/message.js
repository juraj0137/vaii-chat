import * as actionTypes from '../constants/ActionTypes';

export function addMessage(message) {
    return {
        type: actionTypes.MESSAGE_ADD_START,
        message: message
    };
}
export function addMessageSuccess(message) {
    return {
        type: actionTypes.MESSAGE_ADD_SUCCESS,
        message: message
    };
}
export function addMessageFail(error) {
    return {
        type: actionTypes.MESSAGE_ADD_FAIL,
        error: error
    };
}
export function addBulkOfMessages(messages) {
    return {
        type: actionTypes.MESSAGE_ADD_BULK,
        messages: messages
    }

}
export function markReadedMessages(messageIds){
    return{
        type: actionTypes.MESSAGE_READ,
        readedIds: messageIds
    }
}


/*
 export function loadChannels() {
 return {
 type: CHANNELS_LOAD_START
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
 type: CHANNELS_LOAD_SUCCESS,
 channels
 };
 }
 export function loadChannelsFail(error) {
 return {
 type: CHANNELS_LOAD_FAIL,
 error
 };
 }

 */
