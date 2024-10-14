import {configureStore} from "@reduxjs/toolkit";
import LoginReducer from "../Slices/Authontication.Slice.js";
import userProfile from  "../Slices/profile.js" ;
import notification from  "../Slices/notification.js" ;
import chatReducer from "../Slices/Chat";
const Store=configureStore({
  reducer:{
    LoginReducer,
    userData:userProfile,
    notification,
    chatInfo:chatReducer,
  }
});
export default Store;