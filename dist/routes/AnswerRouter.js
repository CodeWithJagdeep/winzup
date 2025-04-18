"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionController_1 = __importDefault(require("../controllers/QuestionController"));
const router = (0, express_1.Router)();
// router.route("/create").post(QuestionController.answerSelection);
router.route("/leaderboard").post(QuestionController_1.default.LeaderBoard);
exports.default = router;
