import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import user from "../models/user.js";
import Listing from '../models/listingmodel.js';

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
export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };
  
  export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };
