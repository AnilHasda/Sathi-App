import chat from "../../models/chat/chat.js";
import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";

/***********************************
 /** 
  ***********************************/
  
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import cloudinaryFileUpload from "../../services/cloudinary.service.js";

const createSingleChat=wrapper(async (req,resp,next)=>{
  let {chatId,memberId}=req.body;
  let loggedInUserId=req.userData._id;
  let isChatExist;
  if(!chatId && memberId){
  let members=[memberId,loggedInUserId];
  console.log({members})
  if(members.length<2) return;
  isChatExist=await chat.findOne({
    members:{$all:members},
    isGroupChat:false
  });
  }else{
    console.log({chatId});
    isChatExist=await chat.findOne({_id:chatId});
  }
  if(!isChatExist){
      //creating one-on-one chat
      let createSingleChat=await chat.create({
        members
      });
      if(createSingleChat) {
      console.log(createSingleChat);
      return resp.json(new response(true,"single chat created",{chatId:createSingleChat._id}));
      }
  }
return resp.json(new response(true,"chat exist",{chatId:isChatExist._id}));
});

const createGroupChat=wrapper(async (req,resp,next)=>{
let groupImage=req.file;
let loggedInUserId=req.userData._id;
  let {members,groupname}=req.body;
  members.push(loggedInUserId);
console.log({groupImage,data:req.body});
if(groupImage){
 groupImage= await cloudinaryFileUpload(groupImage?.path,"chatApp/groupImage");
 if(!groupImage?.url) return next(new customError("failed to upload group cover photo",500));
}
  if(members.length<3) return next(new customError("there should be more than two members to create group chat",400));
  let createChat=await chat.create({
    isGroupChat:true,
    groupname,
    members,
    ...(groupImage && groupImage?.url && {groupImage:groupImage?.url}),
    groupAdmin:[loggedInUserId]
  });
  if(createChat) return resp.json(new response(true,"group chat created successfully"));
  return next(new customError("failed to create chat!",400));
});

const deleteSingleChat=wrapper(async (rew,resp,next)=>{
  let {chatId}=rew.body;
  let removeChat=await chat.findOneAndDelete({_id:chatId});
  if(removeChat.deletedCount>0) return resp.json(new response(true,"chat removed"));
  return next(new customError("failed to delete chat",400));
});

const deleteGroupChat=wrapper(async (rew,resp,next)=>{
  let loggedInUserId=req.userData._id;
  let {chatId}=req.body;
  let findChat=await chat.findOne({_id:chatId});
  if(loggedInUserId.includes(findChat.groupAdmin)){
  let removeChat=await chat.findOneAndDelete({_id:chatId});
  if(removeChat.deletedCount>0) return resp.json(new response(true,"chat removed"));
  return next(new customError("failed to remove chat",500));
  }
  return next(new customError("only admin can remove chat",403));
});

/********************************
 /** remove user from group
 ********************************/
 const removeMemberFromGroupChat=wrapper(async (req,resp,next)=>{
   let loggedInUserId=req.userData._id;
   let {chatId}=req.body;
   let findChat=await chat.findOne({_id:chatId});
   if(loggedInUserId.includes(findChat.groupAdmin)){
     //logic
   }
   return next(new customError("only admin can remove the members",403));
 });
 
 const getChatList=wrapper(async (req,resp,next)=>{
   let loggedInUserId=req.userData._id;
   let pipeline=[
     {
       $match:{
        members:{$in:[loggedInUserId]}
       }
   },{
     $addFields:{
       friendId:{
         $arrayElemAt:[
           {
         $filter:{
           input:"$members",
           as:"userId",
           cond:{
             $ne:["$$userId",loggedInUserId]
           }
         }
         },
         0
         ]
       }
     }
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
         }
         ],
         as:"profile"
     }
   },{
     $addFields:{
       profileDetail:{
         $arrayElemAt:[
           "$profile",0
           ]
       }
     }
   },{
     $project:{
       chatId:"$_id",
      isGroupChat: 1,
      groupname: 1,
      members: 1,
      latestMessage: 1,
      groupAdmin: 1,
      
       profileDetail:{
         _id:1,
         username:1,
         profile:1,
       }
     }
   }
     ]
   let chatList=await chat.aggregate(pipeline);
  // console.log({chatList})
   if(chatList) return resp.json(new response(true,"success",chatList));
   return next(new Error());
 })
export {
  createSingleChat,
  createGroupChat,
  deleteSingleChat,
  deleteGroupChat,
  getChatList
};