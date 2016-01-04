import mongoose from 'mongoose';
import {CHANNEL_PRIVATE,CHANNEL_PUBLIC} from '../constants/ModelConstants';

const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    channelType: {
        type: String,
        enum: [CHANNEL_PRIVATE, CHANNEL_PUBLIC],
        default: CHANNEL_PRIVATE
    }
});

export default mongoose.model('Channel', ChannelSchema);
