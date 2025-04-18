"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../models/Event"));
const User_1 = require("../models/User");
const Answer_1 = __importDefault(require("../models/Answer"));
class EventController {
    constructor() { }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventTitle, startTime, location, matchDetails, subEvents } = req.body;
            try {
                // Validate required fields
                if (!eventTitle) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                yield Event_1.default.create({
                    eventname: eventTitle,
                    startTime: startTime, // Convert string to Date object
                    location: location,
                    matchDetails: matchDetails,
                    subEvents: subEvents,
                });
                return res.status(201).json({
                    status: "success",
                });
            }
            catch (err) {
                return res.status(401).json({
                    status: "failed",
                    message: err,
                });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield Event_1.default.aggregate([
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
            }
            catch (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occurred",
                    error: err,
                });
            }
        });
    }
    addParticipants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userid = res.locals.user.data;
            const { eventid, subeventid } = req.body;
            try {
                const event = yield Event_1.default.findById(eventid);
                if (!event) {
                    return res
                        .status(404)
                        .json({ status: "failed", message: "Event not found" });
                }
                const user = yield User_1.User.findById(userid);
                if (!user) {
                    return res
                        .status(404)
                        .json({ status: "failed", message: "User not found" });
                }
                const currentEvent = yield event.subEvents.find((state) => state._id == subeventid);
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
                yield user.save();
                // Add user to event participants and save event
                currentEvent.participants.push(userid);
                yield event.save();
                const events = yield Event_1.default.find();
                return res.status(201).json({
                    status: "success",
                    events: events,
                    user: user,
                });
            }
            catch (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occurred",
                    error: err,
                });
            }
        });
    }
    createSubevent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventid, subeventName, eventFee, startTime } = req.body;
            try {
                const getEvent = yield Event_1.default.findOne({
                    _id: eventid,
                });
                if (getEvent) {
                    yield getEvent.save();
                    return res.status(201).json({
                        message: "success",
                    });
                }
                else {
                    return res.status(401).json({
                        status: "failed",
                        message: "An error occurred",
                    });
                }
            }
            catch (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occurred",
                    error: err,
                });
            }
        });
    }
    selectedAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionid, userid, answerId, point, eventid } = req.body;
            console.log(questionid, userid, answerId, point, eventid);
            try {
                const answer = yield Answer_1.default.findOne({
                    questionId: questionid,
                    userid: userid,
                    eventid: eventid,
                });
                if (answer) {
                    answer.answerId = answerId;
                    answer.point = point;
                    yield answer.save();
                }
                else {
                    yield Answer_1.default.create({
                        questionId: questionid,
                        answerId: answerId,
                        eventid: eventid,
                        userid: userid,
                        point: point,
                    });
                }
                // Fetch all answers once
                const allAnswers = yield Answer_1.default.find({ userid: userid });
                return res.status(200).json({
                    status: "success",
                    answers: allAnswers,
                });
            }
            catch (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occurred",
                    error: err,
                });
            }
        });
    }
}
exports.default = new EventController();
