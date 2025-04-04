import { Router } from "express";
import QuestionController from "../controllers/QuestionController";

const router: Router = Router();

router.route("/create").post(QuestionController.answerSelection);

export default router;
