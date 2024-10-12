import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Userrouter from './routes/user.route.js';
import signuprouter from './routes/auth.route.js';
dotenv.config();
const app=express();
app.use(express.json());
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


app.listen(4001,()=>{
    console.log("listening at 4000")
})

app.use('/server/user',Userrouter)
app.use('/server/auth',signuprouter)

