import {useState} from "react";
import axiosInstance from "../CustomHooks/axios";
import {useSelector} from "react-redux";
const Profile=()=>{
  let profilePic=useSelector(state=>state.userData.profile);

  return(
    <>
      <div className="h-[50px] w-[50px] rounded-full bg-slate-900 ">
        <img src={profilePic}alt="profile"width="100%"className="rounded-full"/>
      </div>
    </>
    )
}
export default Profile;