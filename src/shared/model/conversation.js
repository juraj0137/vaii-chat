import mongoose from 'mongoose';

export const CONVERSATION_CHANNEL = 'CONVERSATION_CHANNEL';
export const CONVERSATION_USER = 'CONVERSATION_USER';

const ConversationSchema = mongoose.Schema({
    conversationType:{
        type: String,
        enum: [CONVERSATION_CHANNEL, CONVERSATION_USER],
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }
});

export default mongoose.model('Conversation', ConversationSchema);