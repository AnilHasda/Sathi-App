import {useState} from "react";
import useAxiosPost from "./AxiosPost";
import {useSelector,useDispatch} from "react-redux";
import {updateProfileData} from "../../Redux/Slices/profile";
const useUpdateRequest=()=>{
  let [updateRequestLoadingId,setUpdateRequestLoadingId]=useState(null);
  let dispatch=useDispatch();
  let {searchResult}=useSelector(state=>state.userData);
  const {postData,data,loading,error}=useAxiosPost();
  const updateRequestStatus=async (requestId,statusValue,searchUserId)=>{
    setUpdateRequestLoadingId(searchUserId);
    await postData("/friend/updateRequestStatus",{requestId,statusValue,searchUserId});
    setUpdateRequestLoadingId(null);
    let updateSearchResult=searchResult.map(ele=>{
      if(ele._id===searchUserId){
        if(statusValue==="accepted" || statusValue==="rejected"){ return {...ele,status:statusValue};
        }
        return {...ele,status:"none",youSendRequest:false};
      }
      return ele;
    })
    console.log({updateSearchResult})
    dispatch(updateProfileData({searchResult:updateSearchResult}));
  
  }
  return {updateRequestStatus,loading,error,data,updateRequestLoadingId}
}
export default useUpdateRequest;