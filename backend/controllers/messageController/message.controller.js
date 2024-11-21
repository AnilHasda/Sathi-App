import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
const getMessages=wrapper(async (req,resp,next)=>{
  console.log({chatId:req.params});
  let {chatId}=req.params;
  const retrieveMessages=await messages.find({chat:chatId}).populate("sender","_id username profile");
 // console.log({retrieveMessages})
  if(retrieveMessages) return resp.json(new response(true,"success",retrieveMessages));
  return next(new Error());
});
export {getMessages};