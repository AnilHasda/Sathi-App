import {useEffect,useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {updateViewProfile} from "../../Redux/Slices/profile";
import { ClipLoader} from 'react-spinners';
import {Button} from "../../shadcnComponents/ui/button";
import { IoPersonAddSharp } from "react-icons/io5";
import Toast from "react-hot-toast";
import useSendRequest from "../CustomHooks/useSendRequest.js";
import useUpdateRequest from "../CustomHooks/useUpdateRequest";
import {Link} from "react-router-dom";
import {
  updateRequestButton,
  updateViewButton,
} from "../Utils/RequestButtonsUpdates";
const SearchUsersList=()=>{
  let dispatch=useDispatch();
  let {searchResult,searchLoading}=useSelector(state=>state.userData);
  let {sendRequest,loading,loadingId,data,error}=useSendRequest();
  let {updateRequestStatus,data:requestData,error:requestUpdateError,loading:requestUpdateLoading,
    data:updateData,
    updateRequestLoadingId}=useUpdateRequest();
  
  //this one is for sending request
  useEffect(()=>{
    if(error) Toast.error(error?.response?.data?.message || "please check you network!");
    
      if(data?.data?.success) Toast.success(data?.data?.message);
  },[error,data])
  
  //this one is for updating request
  useEffect(()=>{
    if(requestUpdateError) Toast.error(requestUpdateError?.response?.updateData?.message || "please check your network!");
    if(updateData?.data?.success) Toast.success(updateData?.data?.message);
  },[updateData,requestUpdateError])

  // this one is for or sending request or updating requests(for initial button)
      const updateFriendStatus=(ele)=>{
        ele.status==="none" &&
            sendRequest(ele._id,ele.status);
            ele.status==="pending" &&
            (ele.youSendRequest ?
            updateRequestStatus(ele.requestId,"cancelled",ele._id)
            :
            updateRequestStatus(ele.requestId,"accepted",ele._id)
            )
            }
  // updating view buttom
  const updateViewButtonContent=(ele)=>{
    dispatch(updateViewProfile(ele));
      if(ele.status==="pending"&& ele.otherSendRequest){
        updateRequestStatus(ele.requestId,"rejected",ele._id)
              }
  }
  return(
    <>
      {
      !searchLoading ?
        searchResult?.length>0 ?
        <div className="main flex flex-col items-center h-auto pt-[30px] pb-14 gap-2">
        {searchResult.map(ele=>(
        <div key={ele._id} className="flex gap-5 py-4 border-b  w-full h-auto ">
          
        <div className={`h-[60px] w-[60px] self-center rounded-full bg-red-100 ml-5 flex-shrink-0`} style={{
        backgroundImage:`url(${ele.profile})`,
        backgroundPosition:"center",
        backgroundSize:"cover"}}>
        </div>
        
        <div className={`pt-1.5 flex flex-col ${ele.totalMutualFriends===0 && "gap-1.5"}`}>
          <p className="font-semibold text-[18px] ">
            {`${ele.isLoggedInUser ?`${ele.username} (You)`:ele.username}`}
            </p>
            {/* Here mutual friends will display */}
            {!ele.isLoggedInUser && ele.totalMutualFriends>0 &&
            <div className="mt-1.5 mb-3 text-sm text-[gray] flex gap-1"><p className="text-black font-bold">{ele.totalMutualFriends}</p><p>mutual friend</p></div>
            }
            <div></div>
          <div className="flex gap-[20px]">
            <Button variant={`${ele.status !== "none" && "secondary"}`}size="sm"className={`${ele.isLoggedInUser&& "hidden"}
             ${(ele.status==="pending" || ele.status==="accepted") ? "text-black"
             : "text-[#f1f1f1] bg-[#3b5998]"}
            `}onClick={()=>{
              updateFriendStatus(ele)
            }}
            disabled={ele.status==="rejected"}
            >
              {loading && loadingId===ele._id ||
              requestUpdateLoading && updateRequestLoadingId===ele._id?<ClipLoader size={20}/>
            :
              updateRequestButton(ele)
              }
            </Button>
           <Link to="/profile/viewProfile"> <Button variant="secondary"size="sm"
           onClick={()=>{
              updateViewButtonContent(ele)
              }}>
              {
               updateViewButton(ele)
              }
              </Button>
              </Link>
              </div>
        </div>
        
        </div>
        ))}
        </div>
        :<div className="text-center">No such user found!</div>
        :<div className="text-center"><ClipLoader/></div>
      }
    </>
    )
}
export default SearchUsersList;