import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;
