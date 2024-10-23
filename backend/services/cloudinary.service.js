import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
import wrapper from "../helper/tryCatch/wrapperFunction.js"
dotenv.config();
// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });
const cloudinaryFileUpload=async(filePath,folderName)=>{
  try{
  if(filePath){
    let options=folderName?{
      folder:folderName,resource_type:"image"}:{};
    let uploadedFile=await cloudinary.uploader.upload(filePath,options);
    if(uploadedFile){
      fs.unlinkSync(filePath);
      console.log("image uploaded successfully into cloudinary");
      console.log(uploadedFile)
      return uploadedFile;
    }
    fs.unlinkSync(filePath);
    console.log("failed to upload");
  }
  console.log("requested file not found");
  }catch(error){
    console.log(error)
  }
}
export default cloudinaryFileUpload;