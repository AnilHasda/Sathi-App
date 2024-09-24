import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcnComponents/ui/drawer";
import {Button} from  "../../shadcnComponents/ui/button";
import SearchBar from "./SearchBar";
const MutualFriends=({mutualFriends})=>{
  console.log({mutualFriends})
  return (
  <DrawerContent>
    <DrawerHeader>
      <SearchBar/>
    </DrawerHeader>
    {/*Main container open here*/}
    <div>
    {
    mutualFriends &&
      mutualFriends.map(friend=>(
        <div className="flex gap-3 w-full px-10 items-center">
          
          <div className="h-[60px] w-[60px] rounded-full bg-gray-800"
          style={{
            "background":`url(${friend.profile})`,
            "backgroundPosition":"center",
            "backgroundSize":"cover"
          }}
          >
          </div>
          
          <div className="">
            <p className="font-semibold text-xl">
              {friend.username}
            </p>
            {/*friend.mutualFriends>0 &&*/}
            <p className="text-sm text-gray-800 ">{friend.mutualFriends} mutual friends</p>
           
            <p>
              
            </p>
          </div>
        </div>
      ))
    }
    </div>
    {/*main container closed here*/}
  </DrawerContent>
)}
export default MutualFriends;

