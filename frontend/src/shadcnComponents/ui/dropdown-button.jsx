import {useState} from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import {Link} from "react-router-dom";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import Logout from "../../components/Authontication/Logout";
import Profile from "../../components/Profiles/Profile";
import {useSelector,useDispatch} from "react-redux";
import {updateViewProfile} from "../../Redux/Slices/profile";
export function DropdownButton() {
  const [position, setPosition] =useState("bottom");
let {isAuthonticated}=useSelector(state=>state.LoginReducer);
let {loggedInUserInfo}=useSelector(state=>state.userData);
let dispatch=useDispatch();
  return (
    <>
<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"className="text-black"><HiMenuAlt1
        size={30} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
    <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {isAuthonticated &&
          <>
           <Link to="/profile/viewProfile">
           <div onClick={()=>{
             dispatch(updateViewProfile({...loggedInUserInfo,isLoggedInUser:true}))
           }}>
          <DropdownMenuRadioItem >
           <Profile/>
           </DropdownMenuRadioItem>
           </div>
           </Link>
          </>
          }
          <Link to="/">
          <DropdownMenuRadioItem value="top">Home</DropdownMenuRadioItem></Link>
         {!isAuthonticated &&
         <>
           <Link to="/auth/signup">
          <DropdownMenuRadioItem value="bottom">signup</DropdownMenuRadioItem>
          </Link>
          <Link to="/auth/login">
          <DropdownMenuRadioItem value="right">Login</DropdownMenuRadioItem>
          </Link>
          </>
          }
          {isAuthonticated &&
            <DropdownMenuRadioItem><Logout/
            ></DropdownMenuRadioItem>
            }
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}
