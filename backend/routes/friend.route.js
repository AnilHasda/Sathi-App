import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import {sendFriendRequest,getFriendsList,updateRequestStatus} from "../controllers/friendControllers/FriendRequest.js";
const router=express.Router();
router.route("/sendRequest").post(isLoggedIn,sendFriendRequest);
router.route("/getFriendsList/:id?").get(isLoggedIn,getFriendsList);
router.route("/updateRequestStatus").post(isLoggedIn,updateRequestStatus);
export default router;