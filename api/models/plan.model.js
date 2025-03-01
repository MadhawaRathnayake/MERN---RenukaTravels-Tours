import mongoose from "mongoose";

const tripPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    // General Information
    arrivalDate: {
      type: Date,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: String,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    numberOfAdults: {
      type: Number,
    },
    numberOfChildren: {
      type: Number,
    },
    dateComments: {
      type: String,
    },
    // Location Information
    selectedDestinations: [
      {
        type: String,
        required: true,
      },
    ],
    additionalLocations: {
      type: String,
    },
    // Accommodation
    accommodationType: {
      type: String,
      enum: ["3_star", "4_star", "5_star", "5+_star"],
      required: true,
    },
    numberOfBedrooms: {
      type: Number,
      default: "Not specified",
    },
    accommodationPreference: {
      type: String,
    },
    // Transport
    vehicleType: {
      type: String,
      required: true,
    },
    numberOfVehicles: {
      type: Number,
      default: "Not specified",
    },
    transportPreference: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const TripPlan = mongoose.model("TripPlan", tripPlanSchema);

export default TripPlan;
