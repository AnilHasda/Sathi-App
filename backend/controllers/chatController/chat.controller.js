import chat from "../../models/chat/chat.js";
import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";

/***********************************
 /** 
  ***********************************/
  
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";

const createSingleChat=wrapper(async ()=>{
  let members=req.body;
  if(members.length<2) return;
  let isChatExist=await chat.findOne({
    members:{$all:members},
    isGroupChat:false
  });
  if(!isChatExist){
      //creating one-on-one chat
      let createSingleChat=await chat.create({
        members
      });
      if(createSingleChat) {
      console.log(createSingleChat);
      return resp.json(new response(true,"single chat created",{chatId:isChatExist._id}));
      }
  }
return resp.json(new response(true,"chat exist",{chatId:isChatExist._id}));
});

const createGroupChat=wrapper(async (req,resp,next)=>{
  let loggedInUserId=req.userData._id;
  let {members,chatName}=req.body;
  if(members.length<3) return next(new customError("there should be more than two members to create group chat",400));
  let createChat=await chat.create({
    isGroupChat:true,
    groupname:chatName,
    members,
    groupAdmin:loggedInUserId
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
export {createSingleChat,deleteSingleChat,deleteGroupChat};