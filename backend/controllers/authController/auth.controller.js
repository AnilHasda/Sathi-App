import bcrypt from "bcryptjs";
import userModel from "../../models/authModels/user.model.js";
import friendModel from "../../models/friendModel/friend.model.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import tokenGenerator from "../../helper/tokenGenerator/tokenGenerator.js";
import cloudinaryFileUpload from "../../services/cloudinary.service.js";
import mongoose from "mongoose";

/**************************************
/** there should be responseConfigure    inatead of that rename is not        working for this at this instant
 *************************************/
 
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import {
  checkLoggedInUserSendRequest,
  checkOtherSendRequest,
  getAllLoggedInUserRequests,
  getMutualFriendCheckIds,
  getViewUserFriends,
  getMutualFriendsId,
  getRequestStatus,
getRelationStatus
} from "../../Utils/CommonAggregationStages.js"
const test=(req,resp,next)=>{
  console.log("test controller")
  console.log(req.files)
  let check=false;
  if(check===true){
    
  //**********************************
   /** return next(new customError("bad   request",400));
  **********************************/
  
   return next(new Error());
  }
  resp.json({success:true,message:"this is test message"});
}
const userRegistration=wrapper(async (req,resp,next)=>{
  let addUser;
let userData=req.body;
  console.log(userData)
  console.log(req.file);
 let checkEmpty= Object.values(userData).some((ele)=>(ele===null || ele===undefined || ele===" "));
 if(checkEmpty===true) return next(new customError("all fields are required,400"));
  let refresh_token=await tokenGenerator(userData,process.env.REFRESH_TOKEN_SECRET,process.env.REFRESH_TOKEN_EXPIRES);
  //for profile picture
  if(req.file){
    console.log("file found")
 let profileUpload=await cloudinaryFileUpload(req.file?.path,"chatApp/profile");
 console.log(profileUpload)
 if(profileUpload?.url){
   addUser=await userModel.create({
    ...userData,
    refresh_token,
    profile:profileUpload.url
  });
 }else{
   return next(new customError("failed to upload image",400))
 }
  }else{
    console.log("file not found");
    delete userData.profile;
    addUser=await userModel.create({
    ...userData,
    refresh_token
  });
  }
  
  if(addUser){
      let access_token=await tokenGenerator(userData,process.env.ACCESS_TOKEN_SECRET,process.env.ACCESS_TOKEN_EXPIRES);
    resp.cookie("access_token",`Bearer ${access_token}`,{maxAge:Number(process.env.ACCESS_COOKIE_EXPIRES),secure:true,httpOnly:true});
    resp.cookie("refresh_token",`Bearer ${refresh_token}`,{maxAge:Number(process.env.REFRESH_COOKIE_EXPIRES),secure:true,httpOnly:true});
    console.log(addUser)
    resp.status(201).send(new response(true,"Your account has been created"));
  }else{
        next(new customError("Failed to create account ! try again!",400));
  }
})
//user logged in controller
const userLoggedIn=wrapper(async (req,resp,next)=>{
let {email,password}=req.body;
let checkEmailExist=await userModel.find({email});
if(checkEmailExist?.length===1){
  let verifyUser=await bcrypt.compare(password,checkEmailExist[0].password);
  if(verifyUser){
    let access_token=await tokenGenerator({email},process.env.ACCESS_TOKEN_SECRET,process.env.ACCESS_TOKEN_EXPIRES);
    let refresh_token=await tokenGenerator({email},process.env.REFRESH_TOKEN_SECRET,process.env.REFRESH_TOKEN_EXPIRES);
    let update_refresh_token=await userModel.updateOne({email},{$set:{refresh_token}});
    if(update_refresh_token.modifiedCount>0){
      console.log(update_refresh_token)
    resp.cookie("access_token",`Bearer ${access_token}`,{maxAge:Number(process.env.ACCESS_COOKIE_EXPIRES),secure:true,httpOnly:true});
    resp.cookie("refresh_token",`Bearer ${refresh_token}`,{maxAge:Number(process.env.REFRESH_COOKIE_EXPIRES),secure:true,httpOnly:true});
    console.log(req.cookie)
  return resp.status(200).json(new response(true,`Welcome,${checkEmailExist[0].username}`));
  }
  }
}
return next(new customError("email or password does not match",400));
});

//find all user
const getAllUsers=wrapper(async (req,resp)=>{
  const findUsers=await userModel.find({});
  if(findUsers.length>0){
    resp.status(200).json(new response(true,"user data",findUsers));
  }
});
//logout controller
const logout=(req,resp)=>{
  resp.clearCookie("access_token");
  resp.clearCookie("refresh_token");
  resp.json(new response(true,"user logged out successfully"));
}
//controller for profile pic
const getProfile=wrapper(async (req,resp,next)=>{
  let email=req.query.email;
  let {userId}=req.body;
  let profile=await userModel.findOne({email}).select("_id profile username");
  console.log(profile)
  if(process) return resp.json(new response(true,"success",profile));
  next(new customError("profile not found!",400));
})

//controller function for initial check for user's token is available or not
const checkUserLogs=(req,resp)=>{
  console.log("user logged in");
  return resp.json(new response(true,`Welcome,${req.userData.username}`,req.userData));
}

//Search user controller
const searchUsers=wrapper(async(req,resp,next)=>{
  let {input}=req.body;
  let loggedInUserId=req.userData._id;
  let searchUsers;//storing search users 
  console.log({input,loggedInUserId});
  
 /* let findUsers=await userModel.find({
    username: { $regex: new RegExp(input,"i")}
  });
  if(findUsers.length>0){
    let filterUsers=await Promise.all(findUsers.map(async user=>{
      let friendStatus=await friendModel.findOne({
        $or:[
          {sender:userId,receiver:user._id},
          {sender:user._id,receiver:userId}
          ]
      });
      let status="none";
      let isYou=false;
      let youSendRequest=false;
      let otherSendRequest=false;
      if(user._id.equals(userId)) isYou=true;
      if(friendStatus){
        status=friendStatus.status;
        if(friendStatus.sender.equals(userId)) youSendRequest=true;
        
        if(friendStatus.receiver.equals(userId)) otherSendRequest=true;
      }
      return {
       requestId:friendStatus?._id,
        searchUserId:user._id,
        username:user.username,
        profile:user.profile,
        status,
        youSendRequest,
        otherSendRequest,
        isYou,
      };
    }));*/
    let pipeline=[
      {
        $match:{
          username: { $regex: new RegExp(input,"i")}
        }
      },{
        $project:{
          _id:1,
          username:1,
          profile:1
        }
      },
      ]
      searchUsers=await userModel.aggregate(pipeline);
      if(searchUsers.length>0){
        pipeline.push(
          //retrieve all loggedInUser requests
          getAllLoggedInUserRequests(loggedInUserId),
        //as loggedInUserFriendRequests
        {
          $addFields:{
            isLoggedInUser:{
              $eq:["$_id",loggedInUserId]
            },
            requestId:{
              $cond:{
                if:{
                  $gt:[{$size:"$loggedInUserFriendRequests"},0]
                },
                then:{
                  $arrayElemAt:["$loggedInUserFriendRequests._id",0]
                },
                else:null
              },
              
            },
            //closed
            totalLoggedInUserFriends:{
            $filter:{
              input:"$loggedInUserFriendRequests",
              as:"friend",
              cond:{
                $eq:["$$friend.status","accepted"]
              }
          }
        },
        
        //closed
        
        }
         //add fields closed
        },
        //new stage
        {
          $addFields:{
            //this will contain id except loggedInUserId and viewProfileId
            loggedInUserFriendsId:getMutualFriendCheckIds("$totalLoggedInUserFriends",loggedInUserId,"$_id")
        
        //closed totalMutualFriend
          }
        },
        //closed
        getViewUserFriends("$_id"),
        //as :viewUserFriends
      /*****************************/
      
      {      
          $addFields:{
            //retrieve searchUser and loggedInUser relation for each user
            checkRelationStatus:getRequestStatus("$loggedInUserFriendRequests","$_id"),
            mutualFriendsId:getMutualFriendsId("$viewUserFriends","$loggedInUserFriendsId")
         }
     },
     /*****************************/
     {
       $addFields:{
          youSendRequest:checkLoggedInUserSendRequest("$checkRelationStatus",loggedInUserId),
            otherSendRequest:checkOtherSendRequest("$checkRelationStatus",loggedInUserId),
            status:getRelationStatus("$checkRelationStatus"),
         totalMutualFriends:{
           $size:"$mutualFriendsId"
         }
       }
     },
       {
        $project:{
          loggedInUserFriend:0
           }
          }
      
        )
        //response will come here
        searchUsers=await userModel.aggregate(pipeline);
        console.log(JSON.stringify({searchUsers},null,2));
        searchUsers.sort((a,b)=>b.isLoggedInUser-a.isLoggedInUser);
    
    return resp.json(new response(true,"success",searchUsers));
      }
      next(new customError("no data found",400));
})
export {test,userRegistration,userLoggedIn,getAllUsers,getProfile,logout,searchUsers,checkUserLogs};