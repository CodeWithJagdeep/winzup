import { Router } from "express";
import EventController from "../controllers/EventController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.route("/create").post(EventController.create);
router.route("/create/subevent").post(EventController.createSubevent);
router.route("/").get(EventController.getEvents);
router.route("/submit").post(authMiddleware, EventController.addParticipants);

export default router;
