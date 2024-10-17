import user from "../models/user.js";  // Importing lowercase 'user' model
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


// Signup controller
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new user({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        next(error);  // Use centralized error handling middleware
    }
};

// Signin controller
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await user.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: pass, ...rest } = validUser._doc;  // Exclude password from response
        res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};

// Google sign-in controller
export const google = async (req, res, next) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });

        if (existingUser) {
            // Existing user found, generate token
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: pass, ...rest } = existingUser._doc;
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            // New user, create an account
            const generatePass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePass, 10);

            const newUser = new user({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
// Sign-out controller
export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Use secure flag in production
            sameSite: 'strict'
        })
        .status(200)
        .json({ message: 'User signed out successfully' });
    } catch (error) {
        next(error);  // Forward error to centralized error handler
    }
};
