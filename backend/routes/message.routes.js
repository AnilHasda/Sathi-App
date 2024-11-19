import express from "express";
import {
  getMessages
} from "../controllers/messageController/message.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import multerConfiguration from "../middlewares/multer.middleware.js";
const router=express.Router();
let imageMessages=multerConfiguration("MessageImages");
router.route("/getMessages/:chatId").get(isLoggedIn,getMessages);
export default router;