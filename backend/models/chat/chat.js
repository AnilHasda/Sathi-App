import {Schema,model} from "mongoose";
let chatSchema=new Schema({
  isGroupChat:{
    type:Boolean,
    enum:[true,false],
    default:false
  },
  groupname:{
    type:String,
  },
  members:[
    {
    type:Schema.Types.ObjectId,
    ref:"user"
    }
    ],
    latestMessage:{
      type:Schema.Types.ObjectId,
      ref:"messages"
    },
    groupImage:{
      type:String
    },
    groupAdmin:[
      {
        type:Schema.Types.ObjectId,
        ref:"user"
      }
      ]
},{timestamps:true});
const chat=model("chat",chatSchema);
export default chat;