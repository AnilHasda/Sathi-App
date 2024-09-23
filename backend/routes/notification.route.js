import express from "express";
import {getNotifications,updateNotificationStatus} from "../controllers/notificationController/notification.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
const router=express.Router();
router.route("/request/getNotifications/:id?").get(isLoggedIn,getNotifications);
router.route("/update/notificationStatus").patch(isLoggedIn,updateNotificationStatus);
export default router;