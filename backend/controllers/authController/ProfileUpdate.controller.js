import userModel from "../../models/authModels/user.model.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";

/*************************************
 /** profile update controller
 *************************************/
 
const updateProfile=wrapper(async (req,resp,next)=>{
let {_id:userId}=req.userData;
const update=await userModel.findAndUpdateOne(
  {_id:userId},
  {$set:req.body}
  );
  if(update.modifiedCount>0)
  return resp.json(new response(true,"success"));
  else return next(new customError("Failed to update profile",500));
  return next();
})
export default updateProfile;