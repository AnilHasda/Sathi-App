import {Routes,Route} from "react-router-dom";
import Layout from "../Outlet/Outlet";
import Home from "../Chat/Home";
import LoginPage from "../Authontication/Login";
import SignupPage from "../Authontication/Signup";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import People from "../People/People";
import ProfileUpdate from "../Profiles/ProfileUpdate";
import Notification from "../Notifications/Notification";
import ViewProfile from "../Profiles/ViewProfile";
import {updateAuthontication} from "../../Redux/Slices/Authontication.Slice";
import Chat from "../Chat/Chat";
import {useEffect} from "react";
import {useSelector} from "react-redux";
const Router=()=>{
  let {isAuthonticated}=useSelector(state=>state.LoginReducer);
  console.log({isAuthonticated})
  return(
    <div className="w-full">
    <Routes>
      <Route path="/"element={<Layout/>}>
        
    <Route element={<ProtectedRoute isAuthonticated={isAuthonticated}/>}>
      <Route exact path="/"element={ <Home/>}/>
      <Route path="/auth/profileUpdate"element={<ProfileUpdate/>}/>
       <Route path="/notifications/getNotifications"element={<Notification/>}/>
       <Route path="/profile/viewProfile/"element={<ViewProfile/>}/>
        <Route path="/people/"element={<People/>}/>
    </Route>
    
      <Route path="/auth/login"element={<LoginPage/>}/>
      <Route path="/auth/signup"element={<SignupPage/>}/>
      </Route>
      
      <Route element={<ProtectedRoute isAuthonticated={isAuthonticated}/>}>
       <Route path="/chat/:chatId"element={<Chat/>}/>
      </Route>
    </Routes>
    </div>
    )
}
export default Router;