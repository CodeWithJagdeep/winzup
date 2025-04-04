"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const razorpay_1 = __importDefault(require("razorpay"));
const Transcation_1 = __importDefault(require("../models/Transcation"));
class PaymentControler {
    constructor() {
        this.clientid = env_1.RAZORPAY_KEY_ID || "";
        this.clientSecret = env_1.RAZORPAY_KEY_SECRET || "";
        if (!this.clientid || !this.clientSecret) {
            throw new Error("Cashfree credentials are missing. Check your environment variables.");
        }
        this.instance = new razorpay_1.default({
            key_id: env_1.RAZORPAY_KEY_ID,
            key_secret: env_1.RAZORPAY_KEY_SECRET,
        });
        this.createOrder = this.createOrder.bind(this);
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userid = res.locals.user.data;
            const { amount } = req.body;
            const userAccount = yield User_1.User.findOne({
                _id: userid,
            });
            if (userAccount) {
                try {
                    const options = {
                        amount: amount * 100,
                        currency: "INR",
                        receipt: "order_rcptid_11",
                    };
                    const response = yield this.instance.orders.create(options);
                    // Store transaction in DB
                    yield Transcation_1.default.create({
                        userId: userid,
                        amount: amount,
                        currency: "INR",
                        paymentMethod: "razorpay",
                        status: "created",
                        pendingDetails: { razorpayOrderId: response.id },
                    });
                    return res.status(201).json({
                        status: "message",
                        order: response,
                    });
                }
                catch (err) {
                    console.log(err);
                    return res.status(500).json({ message: "failed to create order" });
                }
            }
            return res.status(500).json({ message: "User not found" });
        });
    }
    // ✅ 2️⃣ Verify Payment & Update Transaction Status
    verifyPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
            console.log(razorpayPaymentId, razorpayOrderId, razorpaySignature);
            try {
                // Find transaction by order ID
                const transaction = yield Transcation_1.default.findOne({
                    "pendingDetails.razorpayOrderId": razorpayOrderId,
                });
                if (!transaction) {
                    return res
                        .status(404)
                        .json({ status: "failed", message: "Transaction not found." });
                }
                // Verify Razorpay signature
                const expectedSignature = crypto_1.default
                    .createHmac("sha256", env_1.RAZORPAY_KEY_SECRET)
                    .update(razorpayOrderId + "|" + razorpayPaymentId)
                    .digest("hex");
                if (expectedSignature !== razorpaySignature) {
                    return res
                        .status(400)
                        .json({ status: "failed", message: "Invalid signature." });
                }
                // Update transaction status
                transaction.status = "captured";
                transaction.razorpayPaymentId = razorpayPaymentId;
                transaction.razorpaySignature = razorpaySignature;
                transaction.pendingDetails = undefined; // Remove pending details after success
                const userData = yield User_1.User.findOne({ _id: transaction.userId });
                if (userData) {
                    userData.balance = userData.balance + transaction.amount;
                    yield userData.save();
                }
                yield transaction.save();
                return res.status(200).json({
                    status: "success",
                    message: "Payment verified successfully.",
                    data: userData,
                });
            }
            catch (error) {
                console.error("Error verifying payment:", error);
                return res
                    .status(500)
                    .json({ status: "failed", message: "Internal server error." });
            }
        });
    }
}
exports.default = new PaymentControler();
