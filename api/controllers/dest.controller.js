import Destination from "../models/destination.model.js";
import { errorHandler } from "../utils/error.js";

export const createDest = async (req, rest, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(
        403,
        "You are not authenticate to make changes to the database"
      )
    );
  }
  if (!req.body.destinationName || !req.body.description) {
    return next(errorHandler(400, "Please fill all the required areas"));
  }
  const slug = req.body.destinationName
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const newDestination = new Destination({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedDestination = await newDestination.save();
    rest.status(201).json(savedDestination);
  } catch (error) {
    next(error);
  }
};

export const getDestinations = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const destinations = await Destination.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.destId && { _id: req.query.destId }),
      ...(req.query.searchTerm && {
        $or: [
          { destinationName: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      destinations,
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationNames = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
  
      const destinations = await Destination.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.destId && { _id: req.query.destId }),
        ...(req.query.searchTerm && {
          $or: [
            { destinationName: { $regex: req.query.searchTerm, $options: "i" } },
            { description: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
        .select('destinationName')  // Select only destinationName field
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      res.status(200).json({
        destinations,
      });
    } catch (error) {
      next(error);
    }
  };
  

export const deleteDestination = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this destination"));
  }
  try {
    await Destination.findByIdAndDelete(req.params.destId);
    res.status(200).json("The destination has been deleted");
  } catch (error) {
    next(error);
  }
};

export const UpdateDestination = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to update this destination'));
    }
    try {
      const updatedDestination = await Destination.findByIdAndUpdate(
        req.params.destId,
        {
          $set: {
            destinationName: req.body.destinationName,
            description: req.body.description,
            destImage: req.body.destImage,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedDestination);
    } catch (error) {
      next(error);
    }
  };