import user from "../models/user.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user and save it
    const newUser = new user({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
