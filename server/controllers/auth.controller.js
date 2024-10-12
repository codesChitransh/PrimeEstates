import user from "../models/user.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
export const signup = async (req, res,next) => {
    const { username, email, password } = req.body;

    
    const hashedPassword = bcryptjs.hashSync(password, 10);

 
    const newUser = new user({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
    //   next(errorHandler(550,'error from the function'));
    next(error);    
     }
}
export const signin=async(req,res,next)=>{
    const{email,password}=req.body;

    try{
        const validUser=await user.findOne({email})
        if(!validUser) return next(errorHandler(404,'user not found'))
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'wrong credential!!'));
        
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)

        const{password:pass,...rest}=validUser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}