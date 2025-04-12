import { NextFunction, Request, Response } from "express";
import QuestionModel, { IOptions } from "../models/Question";
import mongoose from "mongoose";
import Answer from "../models/Answer";
import Event from "../models/Event";

class QuestionController {
  constructor() {}

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { questionTitle, eventId, options } = req.body;

    try {
      const response = await QuestionModel.create({
        questionTitle: questionTitle,
        eventId: eventId,
        options: options,
      });
      const questions = await QuestionModel.find();
      return res.status(201).json({
        status: "success",
        questions: questions,
      });
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: "failed",
      });
    }
  }
  async getQuestions(req: Request, res: Response): Promise<any> {
    const { eventid } = req.query;

    try {
      const response = await QuestionModel.find({
        eventId: eventid,
      });
      console.log(response);
      return res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (err) {
      return res.status(401).json({
        status: "failed",
      });
    }
  }

  async CorrectAnswer(req: Request, res: Response): Promise<any> {
    const { questionId, answerId } = req.body;

    try {
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        return res
          .status(404)
          .json({ status: "failed", message: "Question not found" });
      }

      // Convert `answerId` to ObjectId
      const answerObjectId = new mongoose.Types.ObjectId(answerId);
      // First, mark all options as false
      question.options.forEach((opt: IOptions) => (opt.correct = false));
      // Find the option inside the question
      const optionIndex = question.options.findIndex((opt: IOptions) =>
        opt._id.equals(answerObjectId)
      );

      if (optionIndex === -1) {
        return res
          .status(404)
          .json({ status: "failed", message: "Option not found" });
      }

      // Update the correct answer flag
      question.options[optionIndex].correct = true;

      await question.save(); // Save the updated document
      await Answer.updateMany(
        {
          questionId: questionId,
        },
        { correct: false }
      );

      const answer = await Answer.updateMany(
        {
          questionId: questionId,
          answerId: answerId,
        },
        { correct: true }
      );
      return res.status(200).json({
        status: "success",
        questions: await QuestionModel.find(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "failed",
        error: err || "Internal Server Error",
      });
    }
  }
  async LeaderBoard(req: Request, res: Response): Promise<any> {
    const { eventid } = req.body;
    try {
      const answers = await Answer.findOne({ eventid: eventid });
      console.log(answers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "failed",
        error: err || "Internal Server Error",
      });
    }
  }
  async bot(req: Request, res: Response): Promise<any> {}
}

export default new QuestionController();
