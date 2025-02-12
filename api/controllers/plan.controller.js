import TripPlan from "../models/plan.model.js";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

// Set up nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renukatoursandtravels1@gmail.com",
    pass: process.env.G_PWD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Function to send the trip plan data as an email
const sendTripPlanEmail = async (tripPlanData) => {
  try {
    const mailOptions = {
      from: "renukatoursandtravels1@gmail.com", // Sender's email
      to: "renukatours94@gmail.com", // The recipient's email (can be dynamic)
      subject: `New Trip Plan Created by User ${tripPlanData.userId}`,
      text: `A new trip plan has been created with the following details:\n\n
        User: ${tripPlanData.userId}\n
        Arrival Date: ${tripPlanData.arrivalDate}\n
        Departure Date: ${tripPlanData.departureDate}\n
        Number of People: ${tripPlanData.numberOfPeople}\n
        Number of Adults: ${tripPlanData.numberOfAdults}\n
        Number of Children: ${tripPlanData.numberOfChildren}\n
        Selected Destinations: ${tripPlanData.selectedDestinations.join(", ")}\n
        Accommodation Type: ${tripPlanData.accommodationType}\n
        Vehicle Type: ${tripPlanData.vehicleType}\n
        Status: ${tripPlanData.status}\n`,
      html: `<h1>New Trip Plan Created</h1>
        <p><strong>User:</strong> ${tripPlanData.userId}</p>
        <p><strong>Arrival Date:</strong> ${tripPlanData.arrivalDate}</p>
        <p><strong>Departure Date:</strong> ${tripPlanData.departureDate}</p>
        <p><strong>Number of People:</strong> ${tripPlanData.numberOfPeople}</p>
        <p><strong>Number of Adults:</strong> ${tripPlanData.numberOfAdults}</p>
        <p><strong>Number of Children:</strong> ${
          tripPlanData.numberOfChildren
        }</p>
        <p><strong>Selected Destinations:</strong> ${tripPlanData.selectedDestinations.join(
          ", "
        )}</p>
        <p><strong>Accommodation Type:</strong> ${
          tripPlanData.accommodationType
        }</p>
        <p><strong>Vehicle Type:</strong> ${tripPlanData.vehicleType}</p>
        <p><strong>Status:</strong> ${tripPlanData.status}</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to create a trip plan and send email
export const createTripPlan = async (req, res, next) => {
  try {
    const tripPlanData = {
      ...req.body,
      userId: req.user.id,
    };

    const newTripPlan = new TripPlan(tripPlanData);
    const savedTripPlan = await newTripPlan.save();

    // Send email after saving the trip plan
    await sendTripPlanEmail(savedTripPlan);

    res.status(201).json(savedTripPlan);
  } catch (error) {
    next(error);
  }
};

export const getTripPlans = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const tripPlans = await TripPlan.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.status && { status: req.query.status }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalTripPlans = await TripPlan.countDocuments();

    res.status(200).json({
      tripPlans,
      totalTripPlans,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTripPlan = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.tripPlanId);
    if (!tripPlan) {
      return next(errorHandler(404, "Trip plan not found"));
    }

    if (tripPlan.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You can only update your own trip plans"));
    }

    const updatedTripPlan = await TripPlan.findByIdAndUpdate(
      req.params.tripPlanId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedTripPlan);
  } catch (error) {
    next(error);
  }
};

export const deleteTripPlan = async (req, res, next) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.tripPlanId);
    if (!tripPlan) {
      return next(errorHandler(404, "Trip plan not found"));
    }

    if (tripPlan.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You can only delete your own trip plans"));
    }

    await TripPlan.findByIdAndDelete(req.params.tripPlanId);
    res.status(200).json("Trip plan has been deleted");
  } catch (error) {
    next(error);
  }
};
