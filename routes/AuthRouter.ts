import express, { Router } from "express";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

// Define routes
router
  .route("/login")
  .post(AuthController.login)
  .get(AuthController.UserVerification);
router.route("/social").post(AuthController.socialLogin);
router.route("/create").post(AuthController.createUser);
router.route("/isloggedin").get(AuthController.isUserLoggedIn);
router
  .route("/wallet/verification")
  .post(authMiddleware, AuthController.walletVerification);
router
  .route("/onboarding/setpassword")
  .post(authMiddleware, AuthController.setPassword);
export default router;
