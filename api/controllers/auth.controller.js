import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";


import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (
    !username ||
    !email ||
    !password || 
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new user to the database
    await newUser.save();

    // Send a success response
    return res.json({ message: "Signup successful" });
  } catch (error) {
    // Handle errors and send an error response
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email,password } = req.body;

  if(!email || !password || email === ''|| password === '')
    {
      next(errorHandler(400),'All fields are required');
  }
  try {
    const validUser = await User.findOne({ email});
    if(!validUser)
      {
        return  next(errorHandler(404,'User not found'));
      }
    const validPassword = bcryptjs.compareSync(password,validUser.password); 
    if(!validPassword)
    {
          return  next(errorHandler(400,'Password incorrect'));
        }
        const token = jwt.sign(
          { id:validUser._id, isAdmin:validUser.isAdmin}, process.env.JWT_SECRET_KEY);

          const { password : pass, ...rest} = validUser._doc;
        
        res.status(200).cookie('access_token',token, {
         httpOnly: true}).json(rest);

  } catch (error) {
    next(error);
  }
};
