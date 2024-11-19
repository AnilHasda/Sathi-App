import jwt from "jsonwebtoken";
import userModel from "../models/authModels/user.model.js";
import tokenGenerator from "../helper/tokenGenerator/tokenGenerator.js";
import response from "../helper/response.configure.js/response.js";
const isLoggedIn=async (req,resp,next)=>{
  if(req.cookies){
   // console.log({cookie:req.cookies})
    if(req.cookies?.access_token){
      try{
        console.log("access token present");
      let access_token=req.cookies.access_token.split(" ")[1];
      jwt.verify(access_token,process.env.ACCESS_TOKEN_SECRET);
      let {email}=jwt.decode(access_token);
      let findUser=await userModel.findOne({email}).select("-password -refresh_token");
      req.userData=findUser;
        return next();
      }catch(error){
        return resp.status(401).json(new response(false,"unauthorized access!"));
      }
    }
      //logic for refresh token
      if(req.cookies?.refresh_token){
      let refresh_token=req.cookies.refresh_token.split(" ")[1];
      console.log("access_token expired,refresh_token available")
      try{
      let {email}=jwt.decode(refresh_token);
      let userVerification=await userModel.findOne({email}).select("-password");
        if(refresh_token===userVerification?.refresh_token){
          let access_token=await tokenGenerator({email},process.env.ACCESS_TOKEN_SECRET,process.env.ACCESS_TOKEN_EXPIRES);
          console.log({access_token})
          resp.cookie("access_token",`Bearer ${access_token}`,{maxAge:Number(process.env.ACCESS_COOKIE_EXPIRES),httpOnly:true});
          delete userVerification.refresh;
          req.userData=userVerification;
          return next();
        }
        }catch(error){
          return resp.status(401).json(new response(false,"unauthorized access!"));
        }
      }
    }
        return resp.status(401).json(new response(false,"unauthorized access!"));
    }
export default isLoggedIn;