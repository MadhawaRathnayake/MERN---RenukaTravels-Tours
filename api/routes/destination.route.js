import express from "express";
import {verifyToken} from '../utils/verifyUser.js';
import {createDest} from '../controllers/dest.controller.js'

const router = express.Route();

router.post('/create-dest', verifyToken, createDest);

export default router;