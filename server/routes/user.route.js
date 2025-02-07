import express from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUserinfo,getUserListings ,getUser,deleteUser} from '../controllers/user.controller.js';
import { verifytoken } from '../utils/verifyuser.js';

const Userrouter =express.Router();

Userrouter.get("/test",test)
Userrouter.post("/update/:id",verifytoken,updateUserinfo)
Userrouter.get('/listings/:id', verifytoken, getUserListings)
Userrouter.get('/:id', verifytoken, getUser)
Userrouter.delete('/delete/:id', verifytoken, deleteUser)
export default Userrouter;