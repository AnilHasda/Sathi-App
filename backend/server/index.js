import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "../dbConnection/connection.js";
import authRouter from "../routes/auth.routes.js";
import friendRouter from "../routes/friend.route.js";
import notificationRouter from "../routes/notification.route.js";
import chatRouter from "../routes/chat.routes.js";
import errorResponse from "../helper/errorHandler/errorResponse.js";

dotenv.config();
const app=express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
connection();
let port=process.env.PORT || 4000;
app.use("/api/v1/auth/",authRouter);
app.use("/api/v1/friend/",friendRouter);
app.use("/api/v1/notifications/",notificationRouter);
app.use("/api/v1/chat/",chatRouter);
app.use(errorResponse);
app.listen(port,()=>{
  console.log(`App is listening on port:${port}`);
})
