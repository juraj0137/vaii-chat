import mongoose from 'mongoose';

var errorSchema = mongoose.Schema({
    time: {
        type: String,
        default: Date.now()
    },
    useragent: String,
    message: String
});

export default mongoose.model('Error', errorSchema);