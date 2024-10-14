import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDest,
  deleteDestination,
  getDestinationNames,
  getDestinations,
  UpdateDestination,
} from "../controllers/dest.controller.js";

const router = express.Router();

router.post("/create-dest", verifyToken, createDest);
router.get("/get-dest", getDestinations);
router.get("/get-dest", getDestinationNames);
router.delete("/delete-dest/:destId", verifyToken, deleteDestination);
router.put("/update-dest/:destId", verifyToken, UpdateDestination);

export default router;
