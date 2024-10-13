import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Userrouter from './routes/user.route.js';
import signuprouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';  // Add cookie parser to handle cookies

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());  // Ensure cookies are parsed

// Database connection
mongoose
    .connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Database connection error", err);
    });

// Routes
app.use('/server/user', Userrouter);
app.use('/server/auth', signuprouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Listen to port
app.listen(4002, () => {
    console.log("Server is running on port 4002");
});
