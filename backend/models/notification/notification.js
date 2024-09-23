import {Schema,model} from "mongoose";
const notificationSchema=new Schema({
  sender:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:"true"
  },
  receiver:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:"true"
  },
  type:{
    type:String,
    enum:["friend_request","message"],
    required:true
  },
  notification:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:["read","unread"],
    default:"unread"
  },
},
  {
    timestamps:true
  },);
let notifications=model("notifications",notificationSchema);
export default notifications;