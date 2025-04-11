import { Router } from "express";
import QuestionController from "../controllers/QuestionController";

const router: Router = Router();

// router.route("/create").post(QuestionController.answerSelection);

router.route("/leaderboard").post(QuestionController.LeaderBoard);

export default router;
