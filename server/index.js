import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
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

app.listen(4000,()=>{
    console.log("listening at 4000")
})

