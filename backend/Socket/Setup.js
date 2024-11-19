import isSocketAuthonticate from "../middlewares/isSocketAuthonticate.js";
import {sendMessage} from "../controllers/socketController/socket.controller.js";
import {Server} from "socket.io";
let io;
const initializeSocket=(server)=>{
  io=new Server(server,{
    cors:{
      origin:"http://localhost:5173",
      credentials:true
    }
  });
  io.use((socket,next)=>{
    const cookies = socket.handshake.headers.cookie;
    socket.cookie=cookies?.split(";").map(ele=>ele.trim()?.split("="))?.reduce((acc,[key,value])=>{
      acc[key]=decodeURIComponent(value);
      return acc;
    },{})
    next();
  })
  io.use(isSocketAuthonticate);
  io.on("connection",(socket)=>{
    console.log(`${socket.id} connected`);
    socket.on("join_chat",({chatId,username})=>{
      socket.chatId=chatId;
      socket.username=username;
      socket.join(chatId);
      console.log(`${socket.username} joined chat ${socket.chatId}`);
    })
     socket.on("send_message",async (data)=>{
      await sendMessage(socket,data);
     })
     socket.on("disconnect",()=>{
       console.log(`${socket.username} disconnected`);
     })
  })
}
export {
  initializeSocket,
}