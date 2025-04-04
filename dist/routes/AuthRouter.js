"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// Define routes
router
    .route("/login")
    .post(AuthController_1.default.login)
    .get(AuthController_1.default.UserVerification);
router.route("/social").post(AuthController_1.default.socialLogin);
router.route("/create").post(AuthController_1.default.createUser);
router.route("/isloggedin").get(authMiddleware_1.default, AuthController_1.default.isUserLoggedIn);
router
    .route("/wallet/verification")
    .post(authMiddleware_1.default, AuthController_1.default.walletVerification);
router
    .route("/onboarding/setpassword")
    .post(authMiddleware_1.default, AuthController_1.default.setPassword);
exports.default = router;
