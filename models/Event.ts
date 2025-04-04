import mongoose, { Schema, Document } from "mongoose";

interface TeamInterface {
  teamName: string;
  teamImage: string;
}

interface Participant {
  _id: mongoose.Types.ObjectId;
  name: string;
  eventFee: number;
  participants: mongoose.Types.ObjectId[];
  eventstatus: boolean;
  startTime: Date; // Added event start time
}
// Define the event interface
interface IEvent extends Document {
  eventname: string;
  eventFee: number;
  participants: mongoose.Types.ObjectId[];
  eventstatus?: boolean;
  startTime: string; // Added event start time
  location: string;
  matchDetails: TeamInterface[];
  subEvents: Participant[];
}

const EventSchema = new Schema<IEvent>(
  {
    eventname: { type: String, required: true },
    eventstatus: { type: Boolean, default: true },
    startTime: { type: String }, // Start time is now required
    location: { type: String, required: true }, // Added location
    matchDetails: [
      {
        teamName: String,
        teamImage: String,
      },
    ],
    subEvents: [
      {
        name: { type: String, required: true },
        eventFee: { type: Number, required: true },
        participants: [Schema.Types.ObjectId],
        eventstatus: { type: Boolean, default: true },
        startTime: { type: String, required: true }, // Start time is now required
      },
      { timestamps: true }, // Automatically adds `createdAt` and `updatedAt`
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
