import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  subTopic: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  questions: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ['not_completed', 'completed'],
    default: 'not_completed'
  },
},{timestamps:true});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview; 