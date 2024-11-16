import {useState} from "react";
import {Drawer,DrawerTrigger} from "../../shadcnComponents/ui/drawer";
import {IoSearchOutline } from "react-icons/io5";
import {useDispatch} from "react-redux";
import {updateFriendSearchInput} from "../../Redux/Slices/Chat";
const FriendSearchBar=()=>{
  let [input,setInput]=useState(null);
  let dispatch=useDispatch();
  //this function for chat section to search a particular user
  const handleForm=(e)=>{
    e.preventDefault();
    e.stopPropagation()
    dispatch(updateFriendSearchInput(input));
    setInput("");
  }
  const handleInput=(e)=>{
    setInput(e.target.value);
  }
  return(
    <div className="text-center mb-5">
      <form className="relative"onSubmit={handleForm}>
        <input type="text"name="search-data"className="h-[35px] rounded-2xl border w-[320px] outline-0 focus:outline-none pl-[50px] text-sm"placeholder="search..."onChange={handleInput}value={input}/>
        <IoSearchOutline size={25} className="absolute top-[5px] left-[30px] text-[gray]"/>
      </form>
    </div>
    )
}
export default FriendSearchBar;