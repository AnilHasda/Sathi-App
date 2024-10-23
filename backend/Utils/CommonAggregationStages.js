const getMutualFriendsId=(viewUserFriends,mutualFriendCheckIds)=>{
  return {
         $cond:{
           if:{
             $gt:[
               {$size:{$ifNull:[mutualFriendCheckIds,[]]}},0]
           },
           then:{
          $filter:{
            input:{
           $map:{
             input:viewUserFriends,
             as:"viewFriend",
             in:{
               $cond:{
                 if:{
               $or:[
                 {$in:["$$viewFriend.sender",mutualFriendCheckIds]},
                  {$in:["$$viewFriend.receiver",mutualFriendCheckIds]}
                 ]
                 },
                 then:{
                   $cond:{
                     if:{
                       $in:["$$viewFriend.sender",mutualFriendCheckIds]
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
           },
           else:[]
         }
  }
}
const getLoggedInUserFriends=(loggedInUserId)=>{
  return     {
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
    }
}
const getViewUserFriends=(viewUserId)=>{
  return {
          $lookup:{
            from:"friends",
            let:{viewUserId:viewUserId},
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
    }
}

   /*****************************
   /** this one retrieve id except         loggedInuserId and viewProfileId
    *****************************/
  
const getMutualFriendCheckIds=(loggedInUserFriends,loggedInUserId,viewUserId)=>{
  return {
        $cond:{
          if:{
              $gt: [{ $size: loggedInUserFriends}, 0]
            },
            then:{
          $filter:{
            input:{
          $map:{
            input:loggedInUserFriends,
            as:"friend",
            in:{
          $cond:{
            if:{
              $and:[
                {$ne:["$$friend.sender",loggedInUserId]},
                {$ne:["$$friend.sender",viewUserId]},
                {$ne:[viewUserId,loggedInUserId]},
                ]
            },
            then:"$$friend.sender",
            else:{
              $cond:{
              if:{
               $and:[
                {$ne:["$$friend.receiver",loggedInUserId]},
                {$ne:["$$friend.receiver",viewUserId]},
                {$ne:[viewUserId,loggedInUserId]},
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
            },
            else:[]
        }
        }
}
//This stage check whethether the viewprofile is loggedInUser or not
const checkLoggedInUser=(viewUserId,loggedInUserId)=>{
  return {
          $cond:{
            if:{
               $eq:[viewUserId,loggedInUserId]
                },
                then:true,
                else:false
              }
        }
 }
 //check relation between 
 //this stage check the request is send by loggedInUser or not(true or false)
const checkLoggedInUserSendRequest=(loggedInUserFriendsStatus,loggedInUserId)=>{
  return {
              $cond:{
                if:{
                  $gt:[{$size:loggedInUserFriendsStatus},0]
                },
                then:{
                  $let:{
                    vars:{
                      firstElem:{$arrayElemAt:[loggedInUserFriendsStatus,0]}
                    },
                    in:{
                      $cond:{
                        if:{
                      $eq:["$$firstElem.sender",loggedInUserId]
                      },
                      then:true,
                      else:false
                   }
                  }
                  }
                },
                else:false
         }
      }
       }
       
      const checkOtherSendRequest=(loggedInUserFriendsStatus,loggedInUserId)=>{
         return {
              $cond:{
                if:{
                  $gt:[{$size:loggedInUserFriendsStatus},0]
                },
                then:{
                  $let:{
                    vars:{
                      firstElem:{$arrayElemAt:[loggedInUserFriendsStatus,0]}
                    },
                    in:{
                      $cond:{
                        if:{
                      $eq:["$$firstElem.receiver",loggedInUserId]
                      },
                      then:true,
                      else:false
                   }
                  }
                  }
                },
                else:false
         }
      }
      }
      
      /******************************
      /**this stage return logged in user friend requests whether they are sent or received by loggedInUserI
       *****************************/
       const getAllLoggedInUserRequests=(loggedInUserId)=>{
         return {
          $lookup:{
            from:"friends",
            //this pipeline includes the request made to the loggedInUser or send by loggedInUser
            pipeline:[
              {
              $match:{
                $expr:{
                $or:[
                  {$eq:["$sender",loggedInUserId]},
                  {$eq:["$receiver",loggedInUserId]}
                  
                  ]
                }
              }
              }
              ],
            as:"loggedInUserFriendRequests"
          }
        }
       }
       //this retrieve request status of loggedInUser
       const getRequestStatus=(loggedInUserFriendRequests,viewUserId)=>{
         return {
           $cond:{
             if:{
               $eq:[{$size:loggedInUserFriendRequests},0]
             },
             then:[],
             else:{
             $filter:{
               input:loggedInUserFriendRequests,
               as:"friend",
               cond:{
                 $or:[
                 {$eq:["$$friend.sender",viewUserId]},
                 {$eq:["$$friend.receiver",viewUserId]}
                 ]
               }
             }
             }
           }
         }
       }
       //get status of loggedInUser getRequestStatus
         //retrieve searchUser and loggedInUser relation for each user
         const getRelationStatus=(totalLoggedInUserFriends,viewUserId)=>{
           return {
              $cond:{
                if:{
                  $gt:[{$size:{$ifNull:[totalLoggedInUserFriends,[]]}},0],
                },
                then:{
                  $let:{
                    vars:{status:{$arrayElemAt:[totalLoggedInUserFriends,0]}},
                    in: "$$status.status"
                  }
                },
                else:"none"
              }
            }
         }
       
export {
  getMutualFriendsId,
  getLoggedInUserFriends,
  getViewUserFriends,
  getMutualFriendCheckIds,
  checkLoggedInUser,
  checkLoggedInUserSendRequest,
  checkOtherSendRequest,
  getAllLoggedInUserRequests,
  getRequestStatus,
  getRelationStatus
};