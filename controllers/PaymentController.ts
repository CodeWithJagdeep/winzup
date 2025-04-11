import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import {
  PROD_RAZORPAY_KEY_ID,
  PROD_RAZORPAY_KEY_SECRET,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../config/env";
import { User } from "../models/User";
import Razorpay from "razorpay";
import Transaction from "../models/Transcation";

class PaymentControler {
  private clientid: string | undefined;
  private clientSecret: string | undefined;
  instance: Razorpay;

  constructor() {
    this.clientid = PROD_RAZORPAY_KEY_ID || "";
    this.clientSecret = PROD_RAZORPAY_KEY_SECRET || "";

    if (!this.clientid || !this.clientSecret) {
      throw new Error(
        "Cashfree credentials are missing. Check your environment variables."
      );
    }

    this.instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    this.createOrder = this.createOrder.bind(this);
  }

  async createOrder(req: Request, res: Response): Promise<any> {
    const userid = res.locals.user.data as string;
    const { amount } = req.body;

    const userAccount = await User.findOne({
      _id: userid,
    });
    if (userAccount) {
      try {
        const options = {
          amount: amount * 100,
          currency: "INR",
          receipt: "order_rcptid_11",
        };

        const response = await this.instance.orders.create(options);
        // Store transaction in DB
        await Transaction.create({
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
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to create order" });
      }
    }
    return res.status(500).json({ message: "User not found" });
  }

  // ✅ 2️⃣ Verify Payment & Update Transaction Status
  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    try {
      // Find transaction by order ID
      const transaction = await Transaction.findOne({
        "pendingDetails.razorpayOrderId": razorpay_order_id,
      });
      if (!transaction) {
        return res
          .status(404)
          .json({ status: "failed", message: "Transaction not found." });
      }

      // Verify Razorpay signature
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET as string)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        // ✅ FIXED: Compare with razorpay_signature
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid signature." });
      }

      // Update transaction status
      transaction.status = "captured";
      transaction.razorpayPaymentId = razorpay_payment_id;
      transaction.razorpaySignature = razorpay_signature;
      transaction.pendingDetails = undefined; // Remove pending details after success
      const userData = await User.findOne({ _id: transaction.userId });
      if (userData) {
        userData.balance = userData.balance + transaction.amount;
        await userData.save();
      }

      await transaction.save();

      return res.status(200).json({
        status: "success",
        message: "Payment verified successfully.",
        data: userData,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error." });
    }
  }
}
export default new PaymentControler();
