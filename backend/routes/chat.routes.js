import express from "express";
import {
  createSingleChat,
  createGroupChat,
  getChatList,
} from "../controllers/chatController/chat.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import multerConfiguration from "../middlewares/multer.middleware.js";
let router=express.Router();
let uploadGroupImage=multerConfiguration("profileImages");
router.route("/createSingleChat").post(isLoggedIn,createSingleChat);
router.route("/createGroupChat").post(isLoggedIn,uploadGroupImage.single("groupImage"),createGroupChat);
router.route("/getChatList").get(isLoggedIn,getChatList);

export default router;