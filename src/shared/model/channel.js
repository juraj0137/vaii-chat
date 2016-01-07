import mongoose from 'mongoose';
//import {CHANNEL_PRIVATE,CHANNEL_PUBLIC} from '../constants/ModelConstants';

const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model('Channel', ChannelSchema);
