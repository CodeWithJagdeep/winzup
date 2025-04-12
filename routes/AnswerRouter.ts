import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import BotController from "../controllers/BotController";
import EventController from "../controllers/EventController";

const router: Router = Router();

// router.route("/create").post(QuestionController;
router.route("/submit").post(EventController.selectedAnswer);
router.route("/leaderboard").post(QuestionController.LeaderBoard);
router.route("/bot").get(BotController.bulkBotCreater);

export default router;
