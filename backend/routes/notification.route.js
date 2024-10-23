import express from "express";
import {getNotifications,updateNotificationStatus,getInitialInfo} from "../controllers/notificationController/notification.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
const router=express.Router();
router.route("/request/getNotifications").get(isLoggedIn,getNotifications);
router.route("/update/notificationStatus").patch(isLoggedIn,updateNotificationStatus);
router.route("/getInitialInfo").get(isLoggedIn,getInitialInfo);
export default router;