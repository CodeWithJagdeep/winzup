import { NextFunction, Request, Response } from "express";
import QuestionModel from "../models/Question";
import Answer from "../models/Answer";
import mongoose from "mongoose";
import axios from "axios";

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
  async LeaderBoard(req: Request, res: Response): Promise<any> {
    const { eventid } = req.body;
    try {
      const userAnswers = await Answer.aggregate([
        {
          $match: {
            eventid: new mongoose.Types.ObjectId(eventid),
          },
        }, // Filter by eventId if needed
        {
          $group: {
            _id: "$userid", // Group by user ID
            totalPoints: {
              $sum: {
                $cond: [{ $eq: ["$correct", true] }, "$point", 0],
              },
            },
            answers: { $push: "$$ROOT" }, // Collect all answers for each user
          },
        },
        {
          $lookup: {
            from: "users", // The name of the users collection
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" }, // Unwind the array to get a single object
        { $sort: { totalPoints: -1 } }, // Sort by total points in descending order
      ]);

      const botResponse: any = await axios.post(
        `http://localhost:8000/api/answer/get/bot?limit=${100}`,
        {
          userAnswers,
          subeventid: eventid,
        }
      );
      console.log(botResponse.data);
      return res.status(201).json({
        status: "success",
        leaderboard: botResponse.data.data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "failed",
        error: err || "Internal Server Error",
      });
    }
  }
}

export default new QuestionController();
