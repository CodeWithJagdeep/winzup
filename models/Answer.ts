import mongoose, { Schema, Types } from "mongoose";

// Define Schema
const AnswerSchema = new Schema(
  {
    questionId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Question", // Reference to Question model
    },
    userid: {
      type: mongoose.Types.ObjectId,
    },
    eventid: {
      type: mongoose.Types.ObjectId,
    },
    point: {
      type: Number,
    },
    answerId: {
      type: Types.ObjectId,
      required: true,
      ref: "Answer", // Reference to Answer model
    },
    correct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Define Model
const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;
