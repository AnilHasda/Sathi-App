import messages from "../../models/messages/messages.js";
import cloudinaryFileUpload from "../../services/cloudinary.service.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sendMessage=async (socket,data)=>{
  //loggedIn user id
  let senderId=socket.userData._id;
 let {filesData,message}=data;
 let files=[];
 let response=[];
  let createMessage;
  let chatId=socket.chatId;
  if(filesData){
    files=filesData.map(file=>{
     let fileData=Buffer.from(file.fileData);
     console.log({file})
     return {fileData,originalName:file?.originalName,fileType:file?.fileType};
      });
  }
  console.log({filesData})
  console.log({data,senderId,socektId:socket.chatId});
  if(files?.length>0){
    files.forEach(ele=>{
      console.log("test")
      const extension=ele?.originalName?.split(".")[1] || "jpg";
      const filePath = path.join(__dirname, '../../ImageMessages',`${Date.now()}_${ele.originalName?ele.originalName:""}.${extension}`);
      ele.path=filePath;
    fs.writeFileSync(filePath,ele.fileData);
    })
    let cloudinaryFileUploadPromises;
    let resolveCloudinaryFileUploadPromises;
    let imageMessagePromises=[];
  
  cloudinaryFileUploadPromises=files.map(file=>cloudinaryFileUpload(file?.path,"chatApp/ImageMessages"));
  
  resolveCloudinaryFileUploadPromises=await Promise.all(cloudinaryFileUploadPromises);
  
  let filterSuccessUploadFiles=resolveCloudinaryFileUploadPromises.map(file=>file?.url);
  
  imageMessagePromises=filterSuccessUploadFiles.map(file=>messages.create({
    sender:senderId,
    chat:chatId,
    message:file,
    messageType:"image"
  }));
  if(message){
    imageMessagePromises.push(messages.create({
      sender:senderId,
      chat:chatId,
      message
    }))
  }
  createMessage=await Promise.all(imageMessagePromises);
  }else if(message){
    createMessage=await messages.create({
      sender:senderId,
      chat:chatId,
      message
    })
  }
  if(createMessage){
    if(Array.isArray(createMessage)){
      createMessage=createMessage.map(message=>{
        message=message.toObject();
        message.sender={_id:senderId};
        return message;
      })
    }else{
    createMessage=createMessage.toObject();
    createMessage.sender={_id:senderId};
    }
    console.log(JSON.stringify(createMessage, null, 2));
    socket.emit("you_send_message",{message:createMessage});
    socket.to(chatId).emit("receive_message",{message:createMessage,chatId});
    
  }else{
  socket.emit("failed","failed to deliver message");
  }
}
export {
sendMessage,
}