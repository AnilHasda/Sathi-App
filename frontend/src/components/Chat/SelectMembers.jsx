import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {
  updateChatInfo,
  updateGroupMembers,
} from "../../Redux/Slices/Chat";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcnComponents/ui/drawer";
import {Button} from  "../../shadcnComponents/ui/button";
import FriendSearchBar from "../Utils/FriendSearchBar";
import useGetLoggedInUserFriends from "../CustomHooks/useGetLoggedInUserFriends";
import { ClipLoader} from 'react-spinners';
import useAxiosPost from "../CustomHooks/AxiosPost";
import toast from "react-hot-toast";
const SelectMembers=({users,location,friendLoading,friendError,toggleDrawer})=>{
  console.log({users});
  let {totalGroupMembers}=useSelector(state=>state.chatInfo)
  let {postData,data:chatResponse,loading,error:singleChatCreationError}=useAxiosPost();
  let navigate=useNavigate();
  let dispatch=useDispatch();
  useEffect(()=>{
    console.log({friendLoading})
    if(friendError) toast.error("something went wrong! try again later");
  },[friendError])
    //check whether member is selected or not
  const checkGroupMembers=(id)=>{
   let checkStatus=totalGroupMembers.some(ele=>ele._id===id);
   return checkStatus;
  }
  //function to dispatch updateGroupMembers
  const updateMembers=(membersData)=>{
    if(checkGroupMembers(membersData?._id)){
      alert(checkGroupMembers(membersData?._id))
      let data=totalGroupMembers.filter(ele=>ele._id!==membersData._id);
    dispatch(updateChatInfo({totalGroupMembers:data}));
    }else{
    dispatch(updateGroupMembers(membersData));
    }
  }
  return (
  <DrawerContent>
    <DrawerHeader>
      <span onClick={toggleDrawer} className="text-red-900 text-xl relative left-1/2 pr-10 top-[-20px]">
        X
          </span>
      <FriendSearchBar/>
    </DrawerHeader>
    {/*Main container open here*/}
    <div className="flex flex-col gap-5 flex-shrink-0">
    {
    friendLoading ? 
    <div className="text-center"><ClipLoader/></div>
    :
    users?.length>0 ?
      users.map(friend=>(
        <div key={friend._id} className="flex justify-around w-full px-10 items-center flex-shrink-0">
            <label htmlFor={`checkbox${friend._id}`}className="flex gap-3 items-center"onClick={()=>updateMembers(friend)}>
            
          <div className="h-[60px] w-[60px] rounded-full bg-gray-800"
          style={{
            backgroundImage:`url(${friend.profile})`,
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
          >
          </div>
          
          <div className="">
            <p className="font-semibold text-[16px]">
              {friend.username}
            </p>
            {friend.mutualFriends>0 &&
            <p className="text-sm text-gray-800 ">{friend.mutualFriends} mutual friends</p>
            }
          </div>
          </label>
            <input type="checkbox"id={`checkbox${friend._id}`}
            checked={checkGroupMembers(friend._id || false)}
            onChange={()=>updateMembers(friend)}
            />
        </div>
      ))
    :<p className="text-center">User not found</p>
    }
    </div>
    {/*main container closed here*/}
  </DrawerContent>
)}
export default SelectMembers;

