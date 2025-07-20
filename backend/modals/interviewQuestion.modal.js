import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: {
    type: [String],
    required: true
  },
  finalized: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

export default InterviewQuestion; 