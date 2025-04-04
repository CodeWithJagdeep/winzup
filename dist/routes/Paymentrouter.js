"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const PaymentController_1 = __importDefault(require("../controllers/PaymentController"));
const router = (0, express_1.Router)();
router
    .route("/order/create")
    .post(authMiddleware_1.default, PaymentController_1.default.createOrder);
router
    .route("/order/verify")
    .post(authMiddleware_1.default, PaymentController_1.default.verifyPayment);
exports.default = router;
