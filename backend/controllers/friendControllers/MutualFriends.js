import userModel from "../../models/authModels/user.model.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";

import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import {
  getMutualFriendsId,
  getLoggedInUserFriends,
  getViewUserFriends,
  getMutualFriendCheckIds,
  checkLoggedInUser,
  checkLoggedInUserSendRequest,
  checkOtherSendRequest
} from "../../Utils/CommonAggregationStages.js";
import mongoose from "mongoose";
/************************************** /** 
 *************************************/

const mutualFriends=wrapper(async (req,resp,next)=>{
  let userIds=req.body;
  let loggedInUserId=req.userData._id;
  console.log({userIds});
  let pipeline=[
    {
      $match:{
        _id:{$in:userIds.map(id=>(new mongoose.Types.ObjectId(id)))}
      }
    },{
      $project:{
        _id:1,
        username:1,
        profile:1
      }
    },
    //loggedInUserFriends from helper function 
    getLoggedInUserFriends(loggedInUserId),
    getViewUserFriends("$_id"),
    {
      $addFields:{
         /***********************
         /** this one is for checking mutualfriendIds of mutualfriend
         *************************/
        mutualFriendCheckIds:getMutualFriendCheckIds("$loggedInUserFriends",loggedInUserId,"$_id")
      }
      },{
          $addFields:{
        /***********************
         /** this one is for mutualfriend of mutualfriend
         *************************/
        mutualFriendsId:getMutualFriendsId("$viewUserFriends","$mutualFriendCheckIds"),
          isLoggedInUser:checkLoggedInUser("$_id",loggedInUserId)
          }
        },{
        $addFields:{
            totalMutualFriends:{
              $size:"$mutualFriendsId"
            },
            youSendRequest:checkLoggedInUserSendRequest("$loggedInUserFriends",loggedInUserId),
            otherSendRequest:checkOtherSendRequest("$loggedInUserFriends",loggedInUserId)
          }
        },{
          $project:{
            loggedInUserFriends:0,
            viewUserFriends:0,
          }
        }
    ]
    let MutualFriends=await userModel.aggregate(pipeline);
    console.log(JSON.stringify(MutualFriends,null,2))
    if(MutualFriends.length>0){
      return resp.json(new response(true,"success",MutualFriends));
    }
    return next(new Error());
});
export {mutualFriends};
