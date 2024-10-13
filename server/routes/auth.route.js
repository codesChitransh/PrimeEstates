import express from 'express';
import { signin,signup,google } from '../controllers/auth.controller.js';

const signuprouter=express.Router();

signuprouter.post("/signup",signup);
signuprouter.post("/signin",signin);
signuprouter.post("/google",google);
export default signuprouter;