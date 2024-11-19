import jwt from "jsonwebtoken";
import userModel from "../models/authModels/user.model.js";
const isSocketAuthonticate = async (socket, next) => {
  const cookies = socket.cookie;
  console.log({socketCookie:cookies})
  if (cookies) {
   /* const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );*/

    const accessToken = cookies?.access_token?.split(" ")[1];
    if (accessToken) {
      try {
        console.log("Access token present");
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const { email } = jwt.decode(accessToken);
        const findUser = await userModel.findOne({ email }).select("-password -refresh_token");
        socket.userData = findUser;
        return next();
      } catch (error) {
        return next(new Error("Unauthorized access"));
      }
    }

  }
  console.log("Unauthorized socket access")
  return next(new Error("Unauthorized access"));
};

export default isSocketAuthonticate;