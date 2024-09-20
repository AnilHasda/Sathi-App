import chat from "../../models/chat/chat.js";
import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
//there should be responseConfigure inatead of that rename is not working for this at this instant
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
const createSingleChat=wrapper(async ()=>{
  let members=req.body;
  if(!members.length==2) return;
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
      return resp.json(new response(true,"single chat created"));
      }
  }

});
export {createSingleChat};