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
const Question_1 = __importDefault(require("../models/Question"));
const Answer_1 = __importDefault(require("../models/Answer"));
const mongoose_1 = __importDefault(require("mongoose"));
class QuestionController {
    constructor() { }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionTitle, eventId, options } = req.body;
            try {
                const response = yield Question_1.default.create({
                    questionTitle: questionTitle,
                    eventId: eventId,
                    options: options,
                });
                return res.status(201).json({
                    status: "success",
                });
            }
            catch (err) {
                console.log(err);
                return res.status(401).json({
                    status: "failed",
                });
            }
        });
    }
    getQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventid } = req.query;
            try {
                const response = yield Question_1.default.find({
                    eventId: eventid,
                });
                console.log(response);
                return res.status(201).json({
                    status: "success",
                    data: response,
                });
            }
            catch (err) {
                return res.status(401).json({
                    status: "failed",
                });
            }
        });
    }
    LeaderBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventid } = req.body;
            try {
                const userAnswers = yield Answer_1.default.aggregate([
                    { $match: { eventid: new mongoose_1.default.Types.ObjectId(eventid) } }, // Filter by eventId if needed
                    {
                        $group: {
                            _id: "$userid", // Group by user ID
                            totalPoints: { $sum: "$point" }, // Sum points per user
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
                console.log(userAnswers);
                return res.status(201).json({
                    status: "success",
                    leaderboard: userAnswers,
                });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({
                    status: "failed",
                    error: err || "Internal Server Error",
                });
            }
        });
    }
}
exports.default = new QuestionController();
