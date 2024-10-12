import express from 'express';
import { test } from '../controllers/user.controller.js';

const Userrouter =express.Router();

Userrouter.get("/test",test)

export  default Userrouter;