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
                return res.status(201).json({
                    status: "failed",
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
}
exports.default = new QuestionController();
