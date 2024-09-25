const getMutualFriendsId=(viewUserFriends,mutualFriendCheckIds)=>{
  return {
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
export {getMutualFriendsId};