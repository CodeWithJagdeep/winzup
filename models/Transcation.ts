import mongoose, { Schema, Document } from "mongoose";

interface IPendingDetails {
  razorpayOrderId: string; // Razorpay Order ID (before payment)
  createdAt: Date; // Timestamp when order was created
}

interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: "razorpay";
  status: "created" | "authorized" | "captured" | "failed";
  razorpayPaymentId?: string; // Razorpay Payment ID (after success)
  razorpaySignature?: string; // Razorpay Signature (after success)
  pendingDetails?: IPendingDetails; // Stores order details before payment
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, enum: ["razorpay"], default: "razorpay" },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed"], // ❌ Removed "refunded"
      default: "created",
    },
    razorpayPaymentId: { type: String, required: false },
    razorpaySignature: { type: String, required: false },
    pendingDetails: {
      razorpayOrderId: { type: String, required: false },
      createdAt: { type: Date, default: Date.now },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
export default Transaction;
