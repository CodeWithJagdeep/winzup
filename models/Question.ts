import mongoose, { Schema, Document } from "mongoose";

export type IOptions = {
  _id: mongoose.Types.ObjectId;
  option: string;
  correct: boolean;
};

// Extend Mongoose Document for strong typing
interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  questionTitle: string;
  eventId: mongoose.Types.ObjectId;
  options: IOptions[];
}

const QuestionSchema = new Schema<IQuestion>({
  questionTitle: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  options: [
    {
      option: { type: String, required: true },
      correct: { type: Boolean, default: false },
    },
  ],
});

const QuestionModel = mongoose.model<IQuestion>("Question", QuestionSchema);

export default QuestionModel;
