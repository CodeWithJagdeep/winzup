import mongoose, { Schema, Document } from "mongoose";

interface TeamInterface {
  teamName: string;
}

// Define the event interface
interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  eventname: string;
  eventFee: number;
  participants: mongoose.Types.ObjectId[];
  eventstatus?: boolean;
  startTime: Date; // Added event start time
  location: string;
  matchDetails: TeamInterface[];
}

const EventSchema = new Schema<IEvent>(
  {
    eventname: { type: String, required: true },
    eventFee: { type: Number, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    eventstatus: { type: Boolean, default: true },
    startTime: { type: Date, required: true }, // Start time is now required
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const SubEvent = mongoose.model<IEvent>("Subevent", EventSchema);

export default SubEvent;
