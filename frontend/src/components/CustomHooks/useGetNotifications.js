import {useState} from "react";
import useAxiosInstance from "./axios";
import {useDispatch,useSelector} from "react-redux";
import {updateNotifications} from "../../Redux/Slices/notification";
const useGetNotifications=()=>{
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState();
  let dispatch=useDispatch();
  let {notifications}=useSelector(state=>state.notification)
  let axiosInstance=useAxiosInstance();
const getNotifications=async (pageNumber,limit=10)=>{
  console.log({pageNumber})
  setLoading(true);
  setError(null);
      try{
        let url=`/notifications/request/getNotifications`;
      let {data}=await axiosInstance.get(url,{
        params:{
          pageNumber,
          limit
        }
      });
      if(data?.success){
        setLoading(false);
        let combinedData=[...notifications,...data.data.retrieveNotifications];//while clicking see all it will add new data to it
      
              dispatch(updateNotifications({unreadNotifications:data.data.length,notifications:combinedData,totalNotifications:data.data.totalNotifications}));
      }
      }catch(error){
        setError("something went wrong!")
      }finally{
        setLoading(false);
      }
    }
    return {getNotifications,error,loading};
}
export default useGetNotifications;