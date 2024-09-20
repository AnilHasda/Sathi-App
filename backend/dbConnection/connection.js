import mongoose from "mongoose";
const connection=async()=>{
  try{
    let con=await mongoose.connect(process.env.DB_URL);
    if(con) console.log("connection successful");
  }catch(error){
    console.log(`error:${error.message}`);
  }
}
export default connection;