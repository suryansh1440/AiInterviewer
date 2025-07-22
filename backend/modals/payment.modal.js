import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['starter', 'pro'],
        required: true
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'failed'],
        default: 'created'
    },
    amount: {
        type: Number,
        required: true
    },

}, { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment; 