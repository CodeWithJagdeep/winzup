"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EventController_1 = __importDefault(require("../controllers/EventController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.route("/create").post(EventController_1.default.create);
router.route("/create/subevent").post(EventController_1.default.createSubevent);
router.route("/").get(EventController_1.default.getEvents);
router.route("/submit").post(authMiddleware_1.default, EventController_1.default.addParticipants);
exports.default = router;
