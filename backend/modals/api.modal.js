import mongoose from 'mongoose';

const apiSchema = new mongoose.Schema({
    apiEmail: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    apiStatus: {
        type: String,
        default: 'active'
    },
    apiUsage: {
        type: Number,
        default: 0
    }
},{timestamps: true});
const Api = mongoose.model('Api', apiSchema);
export default Api; 