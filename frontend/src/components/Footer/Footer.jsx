import { TiHomeOutline } from "react-icons/ti";
import { RiMessengerLine } from "react-icons/ri";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
const Footer=()=>{
  let {totalNotifications:unreadNotifications}=useSelector(state=>state.notification);
  return(
    <div className="h-16 w-full bg-slate-900 flex justify-between items-center text-[#f1f1f1] text-[30px] text-center border-b px-5 pr-8
    mt-[100px] fixed bottom-0">
         <div><TiHomeOutline/></div>
         <Link to="/people"><div><FaUserFriends/></div></Link>
       <Link to="/"> 
       <div><RiMessengerLine/></div>
       </Link>
        <Link to="/notifications/getNotifications"> <div className="relative">
          {unreadNotifications !==0 &&
          <div className="absolute h-6 w-8  rounded-full top-[-12px] right-[-15px] flex-shrink-0 bg-[#f1f1f1] text-red-800 text-sm text-center">{unreadNotifications}</div>
          }
           <IoNotificationsCircleOutline/>
           </div></Link>
    </div>
    )
}
export default Footer;