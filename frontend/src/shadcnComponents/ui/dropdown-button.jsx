import {useState} from "react";
import { FaBars } from "react-icons/fa6";
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
import {useSelector} from "react-redux";

export function DropdownButton() {
  const [position, setPosition] =useState("bottom")
let {isAuthonticated}=useSelector(state=>state.LoginReducer);
  return (
    <>
<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"className="text-black"><FaBars
        size={20+"px"}/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
    <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {isAuthonticated &&
          
           <Link to="/auth/profileUpdate">
          <DropdownMenuRadioItem ><Profile/></DropdownMenuRadioItem></Link>
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
