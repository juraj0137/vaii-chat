import { combineReducers } from 'redux';
import session from './session.js';
import channels from './channels';
import messages from './messages';
//import friendlist from './friendlist.js';

function lastAction(state = null, action) {
    return action;
}

//export default { messages, session, friendlist, lastAction };

const chatApp = combineReducers({
    session,
    channels,
    messages,
    lastAction
});

export default chatApp;