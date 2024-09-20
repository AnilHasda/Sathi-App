import jwt from "jsonwebtoken";
//function to generate access token
const tokenGenerator=async (payload,secret,expiration)=>{
  let token=await jwt.sign(payload,secret,{expiresIn:expiration});
  return token;
}
export default tokenGenerator;