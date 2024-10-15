import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import user from "../models/user.js";
export const test=(req,res)=>{
    res.json({
        message:"hello world",
    })
};

export const updateUserinfo=async(req,res,next)=>{
    if(req.user.id!==req.params.id)return next(errorHandler(401),"not authentcated to update")
        try{
    if(req.body.password){
        req.body.password=bcryptjs.hashSync(req.body.password,10);
    }
    const updateduser=await user.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar
        }
    },{new:true})

    const{password, ...rest}=updateduser._doc
    res.status(200).json(rest)
    }
    catch(error){
        next(error);
    }
}

