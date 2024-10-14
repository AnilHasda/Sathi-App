import {Schema,model} from "mongoose";
const messageSchema=new Schema({
  sender:{
    type:Schema.Types.ObjectId,
    ref:"user"
  },
  chat:{
    type:Schema.Types.ObjectId,
    ref:"chat"
  },
  message:{
    type:String,
    required:true
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
    default: "text", 
  },
},{timestamps:true});
const messages=model("messages",messageSchema);
export default messages;