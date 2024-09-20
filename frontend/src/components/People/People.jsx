
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
            "no friends to show"
            :<SearchUsersList/>
      }
      </div>
    </>
    )
}
export default People;