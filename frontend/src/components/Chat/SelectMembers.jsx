import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateChatInfo} from "../../Redux/Slices/Chat";
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
const SearchUsers=({users,location,friendLoading,friendError})=>{
  console.log({users});
  let {postData,data:chatResponse,loading,error:singleChatCreationError}=useAxiosPost();
  let navigate=useNavigate();
  let dispatch=useDispatch();
  useEffect(()=>{
    console.log({friendLoading})
    if(friendError) toast.error("something went wrong! try again later");
  },[friendError])
  return (
  <DrawerContent>
    <DrawerHeader>
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
        <div key={friend._id} className="flex gap-3 w-full px-10 items-center flex-shrink-0">
          
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
        </div>
      ))
    :<p className="text-center">User not found</p>
    }
    </div>
    {/*main container closed here*/}
  </DrawerContent>
)}
export default SearchUsers;

