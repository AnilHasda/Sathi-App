import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema=new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  refresh_token:{
    type:String,
    required:true
  },
  profile:{
    type:String,
    default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  }
},{timestamps:true});
userSchema.pre("save",async function (next){
  if(!this.isModified("password")) {
    return next();
  }
  let hashedPassword=await bcryptjs.hash(this.password,10);
  this.password=hashedPassword;
  next();
});
let userModel=mongoose.model("user",userSchema);
export default userModel;
