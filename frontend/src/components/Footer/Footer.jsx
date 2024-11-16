import { TiHomeOutline } from "react-icons/ti";
import { RiMessengerLine } from "react-icons/ri";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import {Link,useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
const Footer=()=>{
  let {totalNotifications:unreadNotifications}=useSelector(state=>state.notification);
  const location=useLocation();
  const activeLink=(path)=>{
    return location.pathname===path ? "text-[#f2f2f2]" : "text-[#f1f1f1]";
  }
  return(
    <div className="h-16 w-full bg-slate-900 flex justify-between items-center text-[30px] text-[#f1f1f1] text-center border-b px-5 pr-8
    mt-[100px] fixed bottom-0">
         <div><TiHomeOutline/></div>
         <Link to="/people"><div className={activeLink("/people")}><FaUserFriends/></div></Link>
       <Link to="/"> 
       <div><RiMessengerLine className={activeLink("/")}/></div>
       </Link>
        <Link to="/notifications/getNotifications"> <div className="relative">
          {unreadNotifications !==0 &&
          <div className="absolute h-6 w-8  rounded-full top-[-12px] right-[-15px] flex-shrink-0 bg-[#f1f1f1] text-red-800 text-sm text-center">{unreadNotifications}</div>
          }
           <IoNotificationsCircleOutline className={activeLink("/notifications/getNotifications")}/>
           </div></Link>
    </div>
    )
}
export default Footer;