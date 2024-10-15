import jwt from 'jsonwebtoken';
import { errorHandler } from "./error.js";

export const verifytoken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log('No token found in cookies');
        return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return next(errorHandler(403, 'Forbidden - Invalid token'));
        }

        req.user = user;
        next();
    });
};
