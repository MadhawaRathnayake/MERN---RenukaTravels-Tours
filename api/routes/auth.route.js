import express from 'express';
import { signup,SignIn  } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', SignIn);

export default router;