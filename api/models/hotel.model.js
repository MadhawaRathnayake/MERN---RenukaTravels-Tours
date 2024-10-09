import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      minlength: [3, "Hotel name must be at least 3 characters long"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 3,
    },
    description: {
      type: String,
      trim: true,
    },

    coverPhoto: {
      type: String,
    },

    hotelImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
