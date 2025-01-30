import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Userrouter from './routes/user.route.js';
import signuprouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';  
import router from './routes/listing.route.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());  

mongoose
    .connect(process.env.mongo, {
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Database connection error", err);
    });

app.use('/server/user', Userrouter);
app.use('/server/auth', signuprouter);
app.use("/server/listing",router);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,  // Make sure the message is passed from the error
    });
});
app.listen(4006, () => {
    console.log("Server is running on port 4006");
});
