import {configureStore} from "@reduxjs/toolkit";
import LoginReducer from "../Slices/Authontication.Slice.js";
import userProfile from  "../Slices/profile.js" ;
import notification from  "../Slices/notification.js" ;
//import resetReducer from "../Slices/RootSlice";
const Store=configureStore({
  reducer:{
    LoginReducer,
    userData:userProfile,
    notification,
  }
});
export default Store;