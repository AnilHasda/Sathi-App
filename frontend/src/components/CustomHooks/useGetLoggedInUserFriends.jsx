import {useState} from "react";
import useAxiosInstance from "./axios";
import {useDispatch,useSelector} from "react-redux";
import {updateProfileData} from "../../Redux/Slices/profile";
import {updateFriendSearchInput} from "../../Redux/Slices/Chat";
const useGetLoggedInUserFriends=()=>{
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState();
  let dispatch=useDispatch();
  let axiosInstance=useAxiosInstance();
const getFriends=async (input)=>{
  setLoading(true);
  setError(null)
      try{
        let url=`/friend/getLoggedInUserFriends`;
      let {data}=await axiosInstance.post(url,{input});
      if(data?.success){
        dispatch(updateFriendSearchInput(""));
      dispatch(updateProfileData({loggedInUserFriends:data.data}));
      }
      }catch(error){
        setError("something went wrong!")
      }finally{
        setLoading(false);
      }
    }
    return {getFriends,error,loading};
}
export default useGetLoggedInUserFriends;