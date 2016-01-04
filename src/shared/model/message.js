import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now()
    },
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// create a model from the message schema
export default mongoose.model('Message', MessageSchema);