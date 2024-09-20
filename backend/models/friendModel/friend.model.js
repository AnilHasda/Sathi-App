import mongoose,{Schema,model} from "mongoose";
const friendSchema=new Schema({
  sender:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  receiver:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  status:{
    type:String,
    enum:["pending","accepted","rejected"],
    default:"pending"
  },
},{
    timestamps:true
  });
let friendModel=model("friends",friendSchema);
export default friendModel;