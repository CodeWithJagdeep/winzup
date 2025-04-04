import { NextFunction, Request, Response } from "express";
import QuestionModel from "../models/Question";

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
      return res.status(201).json({
        status: "success",
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
}

export default new QuestionController();
