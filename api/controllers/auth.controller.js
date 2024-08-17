import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = bcryptjs.hashSync(password,10);

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
        return res.status(500).json({ message: error.message });
    }
};
