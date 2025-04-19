import mongoose, { Schema, Document, Types } from "mongoose";

// Define an interface for the Wallet document
interface IWallet extends Document {
  bankNumber?: string;
  Ifsc?: string;
  verified?: boolean;
  userid: Types.ObjectId;
  accountHolderName: string;
  panNumber: string;
}

// Define the Wallet schema
const walletSchema = new Schema<IWallet>({
  bankNumber: {
    type: String,
  },
  accountHolderName: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  Ifsc: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  userid: {
    type: Schema.Types.ObjectId,
  },
});

// Create and export the Wallet model
const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
export default Wallet;
export { IWallet };
