import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const signuprouter=express.Router();

signuprouter.post("/signup",signup);

export default signuprouter;