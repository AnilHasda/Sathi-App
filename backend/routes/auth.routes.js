import express from "express";
import {test,userRegistration,getAllUsers,userLoggedIn,getProfile,logout,searchUsers,checkUserLogs} from "../controllers/authController/auth.controller.js";
import updateProfile from "../controllers/authController/ProfileUpdate.controller.js"
import uploadProfile from "../middlewares/multer.middleware.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
const router=express.Router();

router.route("/test").get(isLoggedIn,test);
router.route("/register").post(uploadProfile.single("profile"),userRegistration);
router.route("/getallusers").get(isLoggedIn,getAllUsers);
router.route("/login").post(userLoggedIn);
router.route("/checkLogs").get(isLoggedIn,checkUserLogs);
router.route("/getProfile").get(isLoggedIn,getProfile);
router.route("/searchUsers").post(isLoggedIn,searchUsers);
router.route("/logout").get(logout);
router.route("update/profile").patch(userLoggedIn,updateProfile)
export default router;