import TripPlan from "../models/plan.model.js";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";
import { getUserEmail } from "./user.controller.js";
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

// Function to send the trip plan data as an email
const sendTripPlanEmail = async (tripPlanData) => {
  try {
    const userEmail = await getUserEmail(tripPlanData.userId); // Fetch the user's email

    let defaultUserEmail = tripPlanData.email;
    if (tripPlanData.email == null) {
      defaultUserEmail = userEmail;
    }

    const generateTableRow = (label, value) => {
      return value
        ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>${label}:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${value}</td>
        </tr>
      `
        : "";
    };

    const mailOptions = {
      from: "renukatoursandtravels1@gmail.com", // Sender's email
      to: "renukatours94@gmail.com", // The recipient's email (can be dynamic)
      cc: defaultUserEmail,
      subject: `New Trip Plan Created by User ${tripPlanData.userId}`,
      text: `A new trip plan has been created with the following details:\n\n
        User: ${tripPlanData.userId}\n
        User Email: ${userEmail}\n
        User Entered Email: ${tripPlanData.email}\n
        Mobile Number: ${tripPlanData.mobileNumber}\n
        WhatsApp Number: ${tripPlanData.whatsappNumber}\n
        Arrival Date: ${tripPlanData.arrivalDate}\n
        Departure Date: ${tripPlanData.departureDate}\n
        Number of People: ${tripPlanData.numberOfPeople}\n
        Number of Adults: ${tripPlanData.numberOfAdults}\n
        Number of Children: ${tripPlanData.numberOfChildren}\n
        Selected Destinations: ${tripPlanData.selectedDestinations.join(", ")}\n
        Accommodation Type: ${tripPlanData.accommodationType}\n
        Vehicle Type: ${tripPlanData.vehicleType}\n
        Status: ${tripPlanData.status}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">New Trip Plan Created</h1>
          <p style="font-size: 16px; color: #555;">A new trip plan has been created with the following details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${generateTableRow("User", tripPlanData.userId)}
            ${generateTableRow(
              "Created At",
              new Date(tripPlanData.createdAt).toLocaleString()
            )}
            ${generateTableRow("User Email", userEmail)}
            ${generateTableRow("User Entered Email", tripPlanData.email)}
            ${generateTableRow("Mobile Number", tripPlanData.mobileNumber)}
            ${generateTableRow("WhatsApp Number", tripPlanData.whatsappNumber)}
            ${generateTableRow(
              "Arrival Date",
              tripPlanData.arrivalDate
                ? new Date(tripPlanData.arrivalDate).toLocaleDateString()
                : null
            )}
            ${generateTableRow(
              "Departure Date",
              tripPlanData.departureDate
                ? new Date(tripPlanData.departureDate).toLocaleDateString()
                : null
            )}
            ${generateTableRow("Number of People", tripPlanData.numberOfPeople)}
            ${generateTableRow("Number of Adults", tripPlanData.numberOfAdults)}
            ${generateTableRow(
              "Number of Children",
              tripPlanData.numberOfChildren
            )}
            ${generateTableRow(
              "Selected Destinations",
              tripPlanData.selectedDestinations?.length
                ? tripPlanData.selectedDestinations.join(", ")
                : null
            )}
            ${generateTableRow(
              "Accommodation Type",
              tripPlanData.accommodationType
            )}
            ${generateTableRow("Vehicle Type", tripPlanData.vehicleType)}
            ${generateTableRow("Status", tripPlanData.status)}
          </table>
          <p style="font-size: 16px; color: #555; margin-top: 20px;">Thank you for using Renuka Tours and Travels!</p>
          <div style="text-align: center; margin-top: 20px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/renuka-travels.appspot.com/o/logo.png?alt=media&token=e001d6db-fd7c-4f41-a230-eab2e5f00cd9" alt="Logo" style="max-width: 100px; height: auto;">
          </div>
        </div>
      `,
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

    const tripPlans = await TripPlan.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.status && { status: req.query.status }),
    })
      .sort({ updatedAt: -1 }) // Always sort newest first
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

export const getUserTripPlans = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id; // Get the current user's ID from the request

    const tripPlans = await TripPlan.find({ userId }) // Filter by userId
      .sort({ updatedAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalTripPlans = await TripPlan.countDocuments({ userId }); // Count only user's plans

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
