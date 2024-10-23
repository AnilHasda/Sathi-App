import mongoose from "mongoose";
import friendModel from "../../models/friendModel/friend.model.js";
import notifications from "../../models/notification/notification.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import paginatiom from "../../Utils/pagination.js";
import {
  checkLoggedInUserSendRequest,
  checkOtherSendRequest,
  getLoggedInUserFriends,
  getMutualFriendsId,
  getMutualFriendCheckIds,
  getViewUserFriends
} from "../../Utils/CommonAggregationStages.js";
/************************************** /** 
 *************************************/

import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import userModel from "../../models/authModels/user.model.js";
const sendFriendRequest=wrapper(async (req,resp,next)=>{
  let sender_id=req.userData._id;
  let {receiver_id,username}=req.body;
  console.log(req.body)
  let makeRequest=await friendModel.create({
    sender:sender_id,
    receiver:receiver_id,
  });
  if(makeRequest){
    let sentNotification=await notifications.create({
      sender:sender_id,
      receiver:receiver_id,
      type:"friend_request",
      notification:`sent you friend request`,
    });
    if(makeRequest){
      return resp.json(new response(true,"Request sent"));
    }
  }
  next(new customError("failed to send request",501));
});
const updateRequestStatus=wrapper(async (req,resp,next)=>{
  let {requestId,searchUserId:receiverId,statusValue:status}=req.body;
  let senderId=req.userData._id;
  console.log(req.body);
  
  /***********************************
  /** function to convert into mongodb   ObjectId
  ************************************/
  
  function convertToObjectId(id){
    return new mongoose.Types.ObjectId(id);
  }
  if(status==="accepted" || status==="rejected"){
let updateStatus=await friendModel.updateOne(
    {_id:requestId,status:"pending"},
    {$set:{status}},
    );
    console.log(updateStatus)
    if(updateStatus.modifiedCount>0){
      let sentNotification=await notifications.create({
      sender:senderId,
      receiver:searchUserId,
      type:"friend_request",
      notification:`${status} your request`,
    });
    console.log(sentNotification);
      return resp.json(new response(true,`Request ${status}`));
    }
  }else{
     let updateStatus=await friendModel.deleteOne({sender:senderId,receiver:convertToObjectId(receiverId)});
    
  if(updateStatus){
    console.log(updateStatus)
    return resp.json(new response(true,"You cancelled request"));
  }
  next(new customError("Failed to cancel request",500))
  }
    next(new customError("something went wrong",500));
});

//controller for getting view profile friends,mutual friends
const getFriendsList=wrapper(async (req,resp,next)=>{
  let loggedInUserId=req.userData._id;
  let userId;
  let friends;
  let isYou=false; //this one is for examine whether the user is logged in user or not for profile section
  if(req.params?.id) userId=req.params.id;
  else userId=loggedInUserId;
  console.log({userId})
  console.log({logId:loggedInUserId})
  let pipeline=[
    {
      $match:{
        $or:[
          { sender:new mongoose.Types.ObjectId(userId)},
          { receiver:new mongoose.Types.ObjectId(userId) }
          ],
          status:"accepted"
      }
    },
    {
    $lookup:{
      from:"users",
      localField:"sender",
      foreignField:"_id",
      as:"sender"
    }
    },{
     $unwind:"$sender"
   },
   {
    $lookup:{
      from:"users",
      localField:"receiver",
      foreignField:"_id",
      as:"receiver"
    }
   },{
     $unwind:"$receiver"
   },
    ];
    if(req.params?.id){
      pipeline.push(
        {
        $addFields:{
          friend:{
            $cond:{
              if:{$eq:["$sender._id",{$toObjectId:userId}]},
              then:{
                $mergeObjects:["$receiver"]
              },
              else:{
                $mergeObjects:["$sender"]
              }
            }
          }
          
        }
      },
        {
          $project:{
            _id:1,
            status:1,
            friend:{
              _id:1,
              username:1,
              profile:1
            }
          }
      },
      
      )
    }
    //check whether the friend's of viewprofile is also friend of loggedInUser or not
    pipeline.push(
      {
        
        $lookup:{
          from:"friends",
          pipeline:[
            {
              $match:{
                $or:[
                  {sender:loggedInUserId},
                  {receiver:loggedInUserId}
                  ],
              },
            }
            ],
            as:"loggedInUserFriendStatus"
        }
        
      },
     // {$unwind:"$loggedInFriend"},
     //$unwind is preferable for only small data, for large data should use array methods
      {
        
      $addFields:{
        loggedInUserFriends:{
          $filter:{
            input:"$loggedInUserFriendStatus",
            as:"friend",
            cond:{
              $eq:["$$friend.status","accepted"]
            }
          }
        },
        //loggedInUserFriend closed
        mutualFriend:{
        $anyElementTrue:{
          $map:{
            input:"$loggedInUserFriendStatus",
            as:"friend",
            in:{
              $and:[
                {
                $or:[
              {$eq:["$$friend.sender","$friend._id"]},
               {$eq:["$$friend.receiver","$friend._id"]},
              ]},
              {$eq:["$$friend.status","accepted"]}
              ]
          }
        }
        },
        },
          isLoggedInUser:{
            $cond:{
              if:{$eq:["$friend._id",loggedInUserId]},
              then:true,
              else:false
            }
          },
         status:{
           $arrayElemAt:[
             {
            $map:{
              input:{
                $filter:{
                  input:"$loggedInUserFriendStatus",
                  as:"friend",
                  cond: { $or: [
                 { $eq: ["$$friend.sender", "$friend._id"] },
                 { $eq: ["$$friend.receiver", "$friend._id"] }
        ]}
                },
              },
              as:"friend",
              in:"$$friend.status"
              },
          },0]
        },
       }
     },
      //This one is for mutualFriends list for viewprofile's friends
      {
        $lookup:{
          from:"friends",
          let:{friendId:"$friend._id"},
          pipeline:[
            {
            $match:{
              $expr:{
              $and:[
                {
                  $or:[
                    {$eq:["$sender","$$friendId"]},
                    {$eq:["$receiver","$$friendId"]}
                    ]
                },
                {$eq:["$status","accepted"]}
                ],
              }
            }
            }
            ],
            as:"viewProfileFriends"
        }
      },
      //
     {
        $addFields: {
     mutualFriendCheckIds: {
    $filter:{
      input:{
    $map: {
      input: "$loggedInUserFriends",
      as: "loggedFriend",
      in: {
        $cond: {
          if:{
            $and:[
              {$ne:["$$loggedFriend.sender",loggedInUserId]},
                  {$ne:["$$loggedFriend.sender","$friend._id"]},
                   {$ne:["$friend._id",loggedInUserId]}
              ]
          },
          then:"$$loggedFriend.sender",
          else:{
            $cond:{
              if:{
            $and:[
              {$ne:["$$loggedFriend.receiver",loggedInUserId]},
                  {$ne:["$$loggedFriend.receiver","$friend._id"]},
                  {$ne:["$friend._id",loggedInUserId]}
              ]
          },
              then:"$$loggedFriend.receiver",
              else:null
            }
          }
      }
    }
  },
      },
      as:"user",
      cond:{
        $ne:["$$user",null]
      }
    }
}
}
},{
  $addFields:{
mutualFriendsId:{
    $filter:{
      input:{
  $cond:{
    if:{
      $gt:[{$size:"$mutualFriendCheckIds"},0]
    },
  then:{
    $map:{
      input:"$viewProfileFriends",
      as:"viewFriend",
      in:{
        //logic will come here
      $cond:{
        if:{
          $in:["$$viewFriend.sender","$mutualFriendCheckIds"]
        },
        then:"$$viewFriend.sender",
        else:{
          $cond:{
          if:{
            $in:["$$viewFriend.receiver","$mutualFriendCheckIds"]
          },
          then:"$$viewFriend.receiver",
          else:null
        }
        }
      }
      }
    }
  },
  else:[]
},
      },
      as:"user",
      cond:{
        $ne:["$$user",null]
      }
}


}
//totalMutualFriends closed here
}
},{
  $addFields:{
    youSendRequest:checkLoggedInUserSendRequest("$loggedInUserFriendStatus",loggedInUserId),
    otherSendRequest:checkOtherSendRequest("$loggedInUserFriendStatus",loggedInUserId),
    totalMutualFriends:{
      $size:"$mutualFriendsId"
    }
  }
},
     {
        $project:{
          loggedInUserFriendStatus:0,
          viewProfileFriends:0,
         loggedInUserFriends:0,
         mutualFriendsId:0
        }
      }
      )
/*else{
  friends=fetchFriends.map(ele=>{
  if(ele.sender._id.equals(userId)) return ele.receiver;
  return ele.sender;
})
}*/
friends=await friendModel.aggregate(pipeline);
   console.log(JSON.stringify(friends,null,2))
  if(friends.length<1) return resp.json(new response(true,"you have not make any friends yet"));
  resp.json(new response(true,"friend list",friends));
})

//controller for searching loggedInUserFriends
const getAllLoggedInUserFriends=wrapper(async (req,resp,next)=>{
  let{input}=req.body;
  let loggedInUserId=req.userData._id;
  let pipeline=[
      {
          $match:{
              $expr:{
                $and:[
                  {
                    $or:[
                      {$eq:["$sender",loggedInUserId]},
                      {$eq:["$receiver",loggedInUserId]}
                      ]
                  },
                  {$eq:["$status","accepted"]}
                  ]
              }
            }
      },
      {
        $project:{
          sender:1,
          receiver:1
        }
      },
      {
        $addFields:{
          friendId:{
                $cond:{
                  if:{
                    $eq:["$sender",loggedInUserId]
                  },
                  then:"$receiver",
                  else:"$sender"
                }
          }
        },
      },{
        $lookup:{
          from:"users",
          let:{friendId:"$friendId"},
          pipeline:[
            {
            $match:{
              $expr:{
                $eq:["$_id","$$friendId"]
              }
            }
            },
        {
         $match:{
          username: { $regex: new RegExp(input,"i")}
           }
            }
            ],
            as:"friendDetail"
        }
      },{
      // Filter out any documents where friendDetail is an empty array
      $match: {
        $expr: {
          $gt: [{ $size: "$friendDetail" }, 0]
        }
      }
    },{
        $addFields:{
          friend:{
              $arrayElemAt:[
              "$friendDetail",0
            ]
          }
        }
      },{
        $project:{
          _id:0,
         // friendDetail:1,
          _id:"$friend._id",
          username:"$friend.username",
          profile:"$friend.profile"
        }
      }
    ]
  let totalFriends=await friendModel.aggregate(pipeline);
  console.log(JSON.stringify(totalFriends,null,2))
  if(totalFriends) return resp.json(new response(true,"success",totalFriends))
  else return next(new customError("no such data found",404));
  return next(new Error());
})
//get pending request
const getPendingRequests=wrapper(async (req,resp,next)=>{
  let loggedInUserId=req.userData._id;
  let totalPendingRequests=await friendModel.find({
    receiver:loggedInUserId,
    status:"pending"
  });
  if(totalPendingRequests) return resp.json(new response(true,"success",totalPendingRequests));
})
export {
  sendFriendRequest,
  updateRequestStatus,
  getFriendsList,
  getAllLoggedInUserFriends,
  getPendingRequests
};