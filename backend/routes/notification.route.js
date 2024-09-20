import express from "express";
import {getNotifications} from "../controllers/notificationController/notification.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
const router=express.Router();
router.route("/request/getNotifications/:id?").get(isLoggedIn,getNotifications);
export default router;