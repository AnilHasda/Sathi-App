import express from "express";
import {createSingleChat} from "../controllers/chatController/chat.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
let router=express.Router();

router.route("/createSingleChat").post(isLoggedIn,createSingleChat);

export default router;