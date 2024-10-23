import {useEffect,useState} from "react";
import useAxiosGet from "../CustomHooks/AxiosGet";
import { ClipLoader} from 'react-spinners';
import {useNavigate} from "react-router-dom";
import {updateChatInfo} from "../../Redux/Slices/Chat";
import {useDispatch} from "react-redux";
const ChatList=()=>{
  let {getData,data,loading,error}=useAxiosGet();
  let navigate=useNavigate();
  let dispatch=useDispatch();
  useEffect(()=>{
    (async ()=>{
      await getData("/chat/getChatList");
      console.log({profileDetail:data?.profileDetail})
    })()
  },[]);
  const enterChat=(chatId)=>{
    navigate(`/chat/${chatId}`);
  }
  return(
    <div className="mt-[20px] grid gap-3 px-1.5 pl-3">
      { loading ? <div className="text-center"><ClipLoader/></div>
      :
      error ? <p className="text-red-900 text-center pt-5">Something went wrong, try again later!</p>
      :
      data?.data?.length>0 ?
      data?.data?.map(profile=>(
      <div key={profile._id} className="h-[55px] w-full flex gap-2"
      onClick={()=>{
        enterChat(profile.chatId);
        dispatch(updateChatInfo({currentChatInfo:profile.profileDetail}))
      }}
       >
        
        <div className="h-full w-[55px] bg-slate-600 rounded-full"
        style={{
        backgroundImage:`url(${profile.profileDetail.profile})`,
        backgroundPosition:"center",
        backgroundSize:"cover"}}
         ></div>
        
          <div className="flex flex-col pt-1">
          <div className="font-semibold text-[16px]">{profile.profileDetail.username}</div>
          <div className="text-[gray]">mesaage:something</div>
        </div>
        
      </div>
      ))
      :<p className="text-red-900 text-center pt-5">No conversations yet!</p>
      }
    </div>
    )
}
export default ChatList;