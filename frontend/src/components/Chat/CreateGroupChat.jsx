import {useState,useEffect} from "react";
import { Button } from "../../shadcnComponents/ui/button";
import useGetLoggedInUserFriends from "../CustomHooks/useGetLoggedInUserFriends";
import {useSelector} from "react-redux";
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

export function CreateGroupChat() {
  let [members,setMembers]=useState([]);
  let [hide, setHide] = useState(false);
let {loggedInUserFriends}=useSelector(state=>state.userData);
let {friendSearchBarInput}=useSelector(state=>state.chatInfo)
let {getFriends,error,loading}=useGetLoggedInUserFriends();
  const handleDrawerOpenChange = (isOpen) => {
    if (!isOpen) {
      setHide(false); // Reset hide state when drawer is closed
    }
  };
useEffect(()=>{
  (async ()=>{
    if(friendSearchBarInput){
  await getFriends(friendSearchBarInput)
  }
  })()
},[friendSearchBarInput])
  return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Chat</DialogTitle>
          <DialogDescription>
            create group chat and enjoy
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chatName" className="text-right">
              Chat-Name
            </Label>
            <Input
              id="chatName"
              placeholder="enter chat name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupImage" className="text-right">
              Group-Image
            </Label>
            <Input
            type="file"
              id="groupImage"
              className="col-span-3"
            />
          </div>
          <div className="flex gap-5">
            <label>members</label>
            <Drawer>
              <DrawerTrigger>
          <Button>Select members</Button>
          <SelectMembers 
          users={loggedInUserFriends}
          friendLoading={loading}
          friendError={error}
          />
          </DrawerTrigger>
          </Drawer>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"variant="secondary"disabled={members?.length<3}>Create  Chat</Button>
        </DialogFooter>
      </DialogContent>
  )
}
