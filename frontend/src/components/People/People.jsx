
import SearchBar from "../Utils/SearchBar";
import {useSelector} from "react-redux";
import SearchUsersList from "../Profiles/SearchUserList";
const People=()=>{
  let {isTypingForSearchUser}=useSelector(state=>state.userData);
  return(
    <>
      <div className="h-[300px] w-full pt-[30px]">
      <SearchBar/>
      {!isTypingForSearchUser ?
           <p className="text-center text-red-900 pt-5">No friends to show!</p>
            :<SearchUsersList/>
      }
      </div>
    </>
    )
}
export default People;