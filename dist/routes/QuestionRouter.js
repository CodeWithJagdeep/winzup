"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionController_1 = __importDefault(require("../controllers/QuestionController"));
const EventController_1 = __importDefault(require("../controllers/EventController"));
const router = (0, express_1.Router)();
router.route("/create").post(QuestionController_1.default.create);
router.route("/").get(QuestionController_1.default.getQuestions);
router.route("/submit").post(EventController_1.default.selectedAnswer);
exports.default = router;
