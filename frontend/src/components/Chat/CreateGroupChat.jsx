import {useState,useEffect} from "react";
import { Button } from "../../shadcnComponents/ui/button";
import useGetLoggedInUserFriends from "../CustomHooks/useGetLoggedInUserFriends";
import {useSelector,useDispatch} from "react-redux";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcnComponents/ui/dialog";
import {
  Drawer,
  DrawerTrigger
} from "../../shadcnComponents/ui/drawer";
import { Input } from "../../shadcnComponents/ui/input";
import { Label } from "../../shadcnComponents/ui/label";
import SelectMembers from "./SelectMembers";
import {
  updateChatInfo,
} from "../../Redux/Slices/Chat";
import useAxiosPost from "../CustomHooks/AxiosPost";
import Toast from "react-hot-toast";
import { ClipLoader} from 'react-spinners';
export function CreateGroupChat() {
  let {totalGroupMembers}=useSelector(state=>state.chatInfo);
  //state to open and close drawer
  const [drawerStatus,setDrawerStatus]=useState(false);
  const [input,setInput]=useState({});
let {loggedInUserFriends}=useSelector(state=>state.userData);
let {friendSearchBarInput}=useSelector(state=>state.chatInfo)
let {getFriends,error,loading}=useGetLoggedInUserFriends();
let dispatch=useDispatch();
let {postData:createGroup,data:groupCreationResponse,loading:groupCreationLoading,error:groupCreationError}=useAxiosPost();
const toggleDrawer = () => {
    setDrawerStatus((prev) => !prev);
  };
useEffect(()=>{
  (async ()=>{
    if(friendSearchBarInput){
  await getFriends(friendSearchBarInput)
  }
  })()
},[friendSearchBarInput])
useEffect(()=>{
  if(groupCreationResponse?.success) Toast.success(groupCreationResponse.message);
  if(groupCreationError) Toast.error(groupCreationError?.response?.data?.message|| "failed to create group!!")
},[groupCreationResponse,groupCreationError])
useEffect(()=>{
  console.log({input})
},[input])
//remove members
const removeMembers=(id)=>{
  let data=totalGroupMembers.filter(ele=>ele._id!==id);
  dispatch(updateChatInfo({totalGroupMembers:data}));
}
const createGroupChat=async (e)=>{
  e.preventDefault();
  if(!groupCreationLoading && totalGroupMembers.length>=2){
  let members=totalGroupMembers.map(ele=>ele._id);
  console.log({members});
  let {groupName,groupImage}=input;
  let formData=new FormData();
  formData.append("groupname",groupName);
  formData.append("groupImage",groupImage);
  members.forEach(member=>{
    formData.append("members[]",member);
  })
  await createGroup("/chat/createGroupChat",formData);
  }
}
const handleInput=(e)=>{
  let {name,value}=e.target;
  if(name!=="groupImage"){
  setInput(prev=>({...prev,[name]:value}));
  }else{
    setInput(prev=>({...prev,[name]:e.target.files[0]}))
  }
}
  return (
      <DialogContent>
        <form encType="multipart/form-data"onSubmit={createGroupChat}>
        <DialogHeader>
          <DialogTitle>Group Chat</DialogTitle>
          <DialogDescription>
            create group chat and enjoy
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupName" className="text-right">
              Chat-Name <p className="text-[red] text-xl inline">*</p>
            </Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="enter chat name"
              className="col-span-3"
              onChange={handleInput}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupImage" className="text-right">
              Group-Image
            </Label>
            <Input
            type="file"
              id="groupImage"
              name="groupImage"
              className="col-span-3"
              onChange={handleInput}
              accept="image/*"
            />
          </div>
          <div className="flex gap-5">
            <label>members <p className="text-[red] text-xl inline">*</p></label>
            <Drawer open={drawerStatus}>
              <DrawerTrigger>
          <Button type="button" onClick={toggleDrawer}>Select members</Button>
          <SelectMembers 
          users={loggedInUserFriends}
          friendLoading={loading}
          friendError={error}
          toggleDrawer={toggleDrawer}
          />
          </DrawerTrigger>
          </Drawer>
          </div>
        </div>
        {/*member list*/}
        {
          totalGroupMembers?.length>0 ?
           <div className={`h-auto w-[300px] flex gap-[30px] overflow-x-auto items-center py-2  my-5  px-4 ${totalGroupMembers.length<=3 && "justify-center"}`}>

        {totalGroupMembers.map(friend=>(
        <div key={friend._id} className="h-auto w-auto flex-shrink-0">
       <div className="h-14 w-14 rounded-full bg-slate-900 relative"
       style={{
        backgroundImage:`url(${friend.profile})`,
        backgroundPosition:"center",
        backgroundSize:"cover"}}
     >
            <div className="h-5 w-5 rounded-full absolute border-2 border top-0 right-[-15px] grid place-content-center text-red-900"
            onClick={()=>removeMembers(friend._id)}
            >x</div>
     </div>
     <p className="text-sm text-red-900">{friend.username.slice(0,5)+"..."}</p>
     </div>
      ))}
      </div>
          :<p className="text-red-900 text-center pb-5">no members</p>
        }
        <DialogFooter>
          <Button type="submit"variant="default"disabled={totalGroupMembers?.length<2}
          >
            {groupCreationLoading ?
             <ClipLoader size={20}/>
             :"Create  Chat"}</Button>
        </DialogFooter>
         </form>
      </DialogContent>
  )
}
