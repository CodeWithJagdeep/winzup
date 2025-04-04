import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import PaymentController from "../controllers/PaymentController";

const router: Router = Router();

router
  .route("/order/create")
  .post(authMiddleware, PaymentController.createOrder);

router
  .route("/order/verify")
  .post(authMiddleware, PaymentController.verifyPayment);

export default router;
