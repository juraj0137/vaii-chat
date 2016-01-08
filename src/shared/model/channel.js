import mongoose from 'mongoose';

const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model('Channel', ChannelSchema);
