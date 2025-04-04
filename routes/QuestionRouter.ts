import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import EventController from "../controllers/EventController";

const router: Router = Router();

router.route("/create").post(QuestionController.create);
router.route("/").get(QuestionController.getQuestions);
router.route("/submit").post(EventController.selectedAnswer);

export default router;
