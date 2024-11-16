import {useNavigate} from "react-router-dom";
import Toast from "react-hot-toast";
import useAxiosInstance from "../CustomHooks/axios";
import {useDispatch} from "react-redux";
import {updateAuthontication} from "../../Redux/Slices/Authontication.Slice";
import {updateNotifications} from "../../Redux/Slices/notification";
const Logout=()=>{
  let dispatch=useDispatch();
  let navigate=useNavigate();
  let axiosInstance=useAxiosInstance();
  const logout=async ()=>{
    try{
      let {data}=await axiosInstance.get("/auth/logout");
      if(data?.success){
        dispatch(updateAuthontication(false));
        //dispatch(updateNotifications({unreadNotifications:0}))
        Toast.success(data.message,{
          style:{
            color:"red",
          },
          iconTheme: {
         primary: '#FF6F61',   // The background color behind the icon
  },
        })
        navigate("auth/login");
      }
    }catch(error){
      Toast.error("Failed to logged out");
    }
  }
  return(
    <>
    <span onClick={logout}>log out</span>
    </>
    )
}
export default Logout;