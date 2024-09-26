import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
const sendMessage=wrapper(async (req,resp,next)=>{
  let {sender,chatId,message}=req.body;
  let createMessage=await message.create({sender,chat:chatId,message});
  if(createMessage){
    console.log(createMessage);
    return resp.json(new response(true,"success"));
  }
  return next(new Error());
})