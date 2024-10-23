import {useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {updateProfileData,updateViewProfile} from "../../Redux/Slices/profile";
import useAxiosPost from  "./AxiosPost";
const useSendRequest=()=>{
  let [loadingId,setLoadingId]=useState(null);
  let {searchResult}=useSelector(state=>state.userData);
  let {postData,data,loading,error}=useAxiosPost();
  let dispatch=useDispatch();
  const sendRequest=async (receiver_id,status="none")=>{
      console.log("useSebdRequest")
    setLoadingId(receiver_id);
    await postData("/friend/sendRequest",{receiver_id});
    setLoadingId(null)
    let updateSearchResult=searchResult.map(ele=>{
     if(ele._id===receiver_id){
       let updateData= {...ele,status:"pending",youSendRequest:true};
       dispatch(updateViewProfile(updateData));
       return updateData;
     }
     return ele;
    });
    console.log(updateSearchResult)
    dispatch(updateProfileData({searchResult:updateSearchResult}));
    
  }
  return {sendRequest,loading,data,error,loadingId};
}
export default useSendRequest;