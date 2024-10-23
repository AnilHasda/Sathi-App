import useAxiosInstance from "../CustomHooks/axios.js";
import {useDispatch} from "react-redux";
import {updateNotifications} from "../../Redux/Slices/notification";
const useGetInitialInfo=()=>{
  let dispatch=useDispatch();
  let axiosInstance=useAxiosInstance();
  return async ()=>{
    let {data:initialInfo}=await axiosInstance.get("/notifications/getInitialInfo");
    if(initialInfo.success){
      dispatch(updateNotifications({
        totalNotifications:10,
        totalPendingRequests:10
      }));
    }
  }
    
}
export default useGetInitialInfo;