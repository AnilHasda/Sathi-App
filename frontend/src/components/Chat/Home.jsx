import {Button} from "../../shadcnComponents/ui/button";
import SearchBar from "../Utils/SearchBar";
import ActiveUsers from "./ActiveUsers";
import ChatList from "./ChatList";
import {useSelector} from "react-redux";
import SearchUsersList from "../Profiles/SearchUserList";
const Home=()=>{
  let {isTyping}=useSelector(state=>state.userData);
  return(
    <>
      <div className="h-[300px] w-full pt-[30px]">
      <SearchBar/>
      <ActiveUsers/>
      <ChatList/>
      </div>
    </>
    )
}
export default Home;