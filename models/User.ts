import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  photoURL: string;
  uid: string;
  phoneNumber: string;
  walletId: string;
  supportId: number;
  balance: number;
  ipaddress: string;
  location: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Boolean },
    uid: { type: String },
    password: { type: String },
    photoURL: { type: String },
    phoneNumber: { type: String },
    walletId: { type: String },
    balance: { type: Number, default: 0 },
    supportId: { type: Number },
    ipaddress: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    return next(err as Error);
  }
});

// Method to compare hashed password with a provided password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { User };
