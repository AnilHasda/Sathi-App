import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import {sendFriendRequest,getFriendsList,updateRequestStatus} from "../controllers/friendControllers/FriendRequest.js";
import {mutualFriends} from "../controllers/friendControllers/MutualFriends.js"
const router=express.Router();
router.route("/sendRequest").post(isLoggedIn,sendFriendRequest);
router.route("/getFriendsList/:id?").get(isLoggedIn,getFriendsList);
router.route("/updateRequestStatus").post(isLoggedIn,updateRequestStatus);
router.route("/getMutualFriends").post(isLoggedIn,mutualFriends);
export default router;