import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  destinationName: {
    type: String,
    required: true,
    unique: true,
  },
  coverPhoto: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/11/18/21/23/earth-1837411_640.jpg", // Default cover photo
  },
  description: {
    type: String,
    required: true,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
