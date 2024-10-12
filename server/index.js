import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Userrouter from './routes/user.route.js';

dotenv.config();
const app=express();

mongoose
.connect(process.env.mongo)
.then(()=>{
    console.log("connected");
})
.catch((err) =>{
    console.log(err);
});

// app.get("/test",(req,res)=>{
//     res.send("hello")
// })

app.listen(4000,()=>{
    console.log("listening at 4000")
})

app.use('/server/user',Userrouter)

