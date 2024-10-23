import messages from "../../models/messages/messages.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import cloudinaryFileUpload from "../../services/cloudinary.service.js";
const sendMessage=wrapper(async (req,resp,next)=>{
  //loggedIn user id
  let senderId=req.userData._id;
  let {chatId,message}=req.body;
  let files=req.files;
  console.log({data:req.body});
  let createMessage;
  if(files?.length>0){
    let cloudinaryFileUploadPromises;
    let resolveCloudinaryFileUploadPromises;
    let imageMessagePromises;
    
  cloudinaryFileUploadPromises=files.map(file=>cloudinaryFileUpload(file?.path,"chatApp/ImageMessages"));
  
  resolveCloudinaryFileUploadPromises=await Promise.all(cloudinaryFileUploadPromises);
  
  let filterSuccessUploadFiles=resolveCloudinaryFileUploadPromises.map(file=>file?.url);
  
  imageMessagePromises=filterSuccessUploadFiles.map(file=>messages.create({
    sender:senderId,
    chat:chatId,
    message:file,
    messageType:"image"
  }));
  
  createMessage=await Promise.all(imageMessagePromises);
  }
  if(message){
    createMessage=await messages.create({
      sender:senderId,
      chat:chatId,
      message
    })
  }
  if(createMessage){
    console.log(createMessage);
    return resp.json(new response(true,"success"));
  }
  return next(new Error());
})
const getMessages=wrapper(async (req,resp,next)=>{
  console.log({chatId:req.params});
  let {chatId}=req.params;
  const retrieveMessages=await messages.find({chat:chatId}).populate("sender","_id username profile");
  console.log({retrieveMessages})
  if(retrieveMessages) return resp.json(new response(true,"success",retrieveMessages));
  return next(new Error());
});
export {sendMessage,getMessages};