import userModel from "../../models/authModels/user.model.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";

import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
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
    },{
          $lookup:{
            from:"friends",
            pipeline:[
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
              }
            ],
            as:"loggedInUserFriends"
       }
    },{
          $lookup:{
            from:"friends",
            let:{viewUserId:"$_id"},
            pipeline:[
              {
            $match:{
              $expr:{
                $and:[
                  {
                    $or:[
                      {$eq:["$sender","$$viewUserId"]},
                      {$eq:["$receiver","$$viewUserId"]}
                      ]
                  },
                  {$eq:["$status","accepted"]}
                  ]
              }
            }
              }
            ],
            as:"viewUserFriends"
       }
    },{
      $addFields:{
         /***********************
         /** this one is for checking mutualfriendIds of mutualfriend
         *************************/
        mutualFriendCheckIds:{
          $filter:{
            input:{
          $map:{
            input:"$loggedInUserFriends",
            as:"friend",
            in:{
          $cond:{
            if:{
              $and:[
                {$ne:["$$friend.sender",loggedInUserId]},
                {$ne:["$$friend.sender","$_id"]},
                {$ne:["$_id",loggedInUserId]},
                ]
            },
            then:"$$friend.sender",
            else:{
              $cond:{
              if:{
               $and:[
                {$ne:["$$friend.receiver",loggedInUserId]},
                {$ne:["$$friend.receiver","$_id"]},
                {$ne:["$_id",loggedInUserId]},
                ]
              },
              then:"$$friend.receiver",
              else:null
            }
            }
          }
            }
          }
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
        /***********************
         /** this one is for mutualfriend of mutualfriend
         *************************/
        mutualFriends:{
          $size:{
          $filter:{
            input:{
           $map:{
             input:"$viewUserFriends",
             as:"viewFriend",
             in:{
               $cond:{
                 if:{
               $or:[
                 {$in:["$$viewFriend.sender","$mutualFriendCheckIds"]},
                  {$in:["$$viewFriend.receiver","$mutualFriendCheckIds"]}
                 ]
                 },
                 then:{
                   $cond:{
                     if:{
                       $in:["$$viewFriend.sender","$mutualFriendCheckIds"]
                       },
                     then:"$$viewFriend.sender",
                     else:"$$viewFriend.receiver"
                   }
                 },
                 else:null
             }
             }
           }
            },
            as:"user",
            cond:{
              $ne:["$$user",null]
            }
          }
          }
        }
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
