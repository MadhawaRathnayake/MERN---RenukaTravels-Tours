import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
      unique: true,
    },
    destImage: {
      type: String,
      default: "", // Default cover photo
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    activities: {
      type: [String], // Array of strings
      default: [], // Default to an empty array
    },
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
