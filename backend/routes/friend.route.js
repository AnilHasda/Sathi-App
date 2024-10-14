import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import {
  sendFriendRequest,
  getFriendsList,
  updateRequestStatus,
  getAllLoggedInUserFriends,
  getPendingRequests
} from "../controllers/friendControllers/FriendRequest.js";
import {mutualFriends} from "../controllers/friendControllers/MutualFriends.js"
const router=express.Router();
router.route("/sendRequest").post(isLoggedIn,sendFriendRequest);
router.route("/getFriendsList/:id?").get(isLoggedIn,getFriendsList);
router.route("/updateRequestStatus").post(isLoggedIn,updateRequestStatus);
router.route("/getMutualFriends").post(isLoggedIn,mutualFriends);
//this is for searching LoggedInUserFriends
router.route("/getLoggedInUserFriends").post(isLoggedIn,getAllLoggedInUserFriends);
router.route("getPendingRequests").get(isLoggedIn,getPendingRequests);
export default router;