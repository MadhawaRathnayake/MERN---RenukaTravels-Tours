import { verifyToken } from "../utils/verifyUser.js";
import { create, deleteTour, getTours, updateTour } from "../controllers/tour.controller.js";
import express from "express";

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/gettours', getTours);
router.delete('/deletetour/:tourId/:userId', verifyToken, deleteTour);
router.put('/updatetour/:tourId/:userId', verifyToken, updateTour);

export default router;