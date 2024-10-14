import express from "express";
import {
  createSingleChat,
  createGroupChat,
  getChatList,
} from "../controllers/chatController/chat.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
let router=express.Router();

router.route("/createSingleChat").post(isLoggedIn,createSingleChat);
router.route("/getChatList").get(isLoggedIn,getChatList);

export default router;