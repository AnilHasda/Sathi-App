import { useState,useEffect } from "react";
import {useSelector} from "react-redux";
import { Button } from "../../shadcnComponents/ui/button";
import FriendSearchBar from "../Utils/FriendSearchBar";
import useGetLoggedInUserFriends from "../CustomHooks/useGetLoggedInUserFriends";
import {
  Drawer,
  DrawerTrigger
} from "../../shadcnComponents/ui/drawer";
import SearchUsers from "../Utils/SearchUsers";
import ActiveUsers from "./ActiveUsers";
import ChatList from "./ChatList";

const Home = () => {
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
    <>
      <div className="h-[300px] w-full pt-[30px]">
        <Drawer onOpenChange={handleDrawerOpenChange}>
          <DrawerTrigger>
            {!hide &&
            <div className="w-full  ml-3"><FriendSearchBar hideComponent={setHide}/>
            </div>
            }
          </DrawerTrigger>
          <SearchUsers 
          users={loggedInUserFriends}
          location="chat"
          friendLoading={loading}
          friendError={error}
          />
        </Drawer>
        <ActiveUsers />
        <ChatList />
      </div>
    </>
  );
};

export default Home;
