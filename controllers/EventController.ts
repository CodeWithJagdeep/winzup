import { Request, Response } from "express";
import Event from "../models/Event";
import { User } from "../models/User";
import SubEvent from "../models/SubEvents";
import QuestionModel from "../models/Question";
import Answer from "../models/Answer";

class EventController {
  constructor() {}

  async create(req: Request, res: Response): Promise<any> {
    const { eventTitle, startTime, location, matchDetails, subEvents } =
      req.body;

    try {
      // Validate required fields
      if (!eventTitle) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      await Event.create({
        eventname: eventTitle,
        startTime: startTime, // Convert string to Date object
        location: location,
        matchDetails: matchDetails,
        subEvents: subEvents,
      });

      return res.status(201).json({
        status: "success",
      });
    } catch (err) {
      return res.status(401).json({
        status: "failed",
        message: err,
      });
    }
  }
  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const data = await Event.aggregate([
        {
          $lookup: {
            from: "subevents", // Collection name in MongoDB
            localField: "subEvents", // Field in Event collection that stores subevent IDs
            foreignField: "_id", // Field in SubEvent collection to match
            as: "subEventsDetails", // New field containing joined data
          },
        },
      ]);

      return res.status(200).json({
        message: "success",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "An error occurred",
        error: err,
      });
    }
  }

  async addParticipants(req: Request, res: Response): Promise<any> {
    const userid = res.locals.user.data;
    const { eventid, subeventid } = req.body;

    try {
      const event = await Event.findById(eventid);
      if (!event) {
        return res
          .status(404)
          .json({ status: "failed", message: "Event not found" });
      }

      const user = await User.findById(userid);
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      const currentEvent = await event.subEvents.find(
        (state) => state._id == subeventid
      );
      if (!currentEvent) {
        return res
          .status(200)
          .json({ status: "success", message: "UEvent is not found" });
      }
      // Check if the user is already a participant
      if (currentEvent.participants.includes(userid)) {
        return res
          .status(200)
          .json({ status: "success", message: "User already registered" });
      }

      // Check if user has enough balance
      if (user.balance < currentEvent.eventFee) {
        return res
          .status(400)
          .json({ status: "failed", message: "Insufficient balance" });
      }

      // Deduct event fee and save user
      user.balance -= currentEvent.eventFee;
      await user.save();

      // Add user to event participants and save event
      currentEvent.participants.push(userid);
      await event.save();

      const events = await Event.find();

      return res.status(201).json({
        status: "success",
        events: events,
        user: user,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "An error occurred",
        error: err,
      });
    }
  }

  async createSubevent(req: Request, res: Response): Promise<any> {
    const { eventid, subeventName, eventFee, startTime } = req.body;
    try {
      const getEvent = await Event.findOne({
        _id: eventid,
      });

      if (getEvent) {
        await getEvent.save();
        return res.status(201).json({
          message: "success",
        });
      } else {
        return res.status(401).json({
          status: "failed",
          message: "An error occurred",
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "An error occurred",
        error: err,
      });
    }
  }

  async selectedAnswer(req: Request, res: Response): Promise<any> {
    const { questionid, userid, answerId, point, eventid } = req.body;

    try {
      const answer = await Answer.findOne({
        questionId: questionid,
        userid: userid,
        eventid: eventid,
      });

      if (answer) {
        answer.answerId = answerId;
        answer.point = point;
        await answer.save();
      } else {
        await Answer.create({
          questionId: questionid,
          answerId: answerId,
          eventid: eventid,
          userid: userid,
          point: point,
        });
      }

      // Fetch all answers once
      const allAnswers = await Answer.find({ userid: userid });

      return res.status(200).json({
        status: "success",
        answers: allAnswers,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "An error occurred",
        error: err,
      });
    }
  }
}

export default new EventController();
