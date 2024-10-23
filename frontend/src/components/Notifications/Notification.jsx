import {useEffect,useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {Button} from "../../shadcnComponents/ui/button";
//import useAxiosInstance from "./axios";
import calculatePageNumber from "../Utils/CalculatePageNumber";
import useGetNotifications from "../CustomHooks/useGetNotifications";
import {updateNotifications} from "../../Redux/Slices/notification";
import { ClipLoader} from 'react-spinners';
const Notification=()=>{
  let {notifications,totalNotifications,pageNumber}=useSelector(state=>state.notification);
  let {getNotifications,error,loading}=useGetNotifications();
  let dispatch=useDispatch();
  let totalPages=calculatePageNumber(totalNotifications);
  useEffect(()=>{
    if(pageNumber>1){
    getNotifications(undefined,pageNumber)
    }
  },[pageNumber])
  useEffect(()=>{
    notifications.length<10 && getNotifications();
  },[])
  return(
    <div className="flex flex-col h-auto w-full gap-5 mt-2 px-4 pb-10">
      <p className="font-semibold text-xl pt-2">Notifications</p>
      {
        notifications?.length>0?
        notifications.map((ele,index)=>(
        <div key={ele._id+index} className="h-auto w-full items-center flex gap-5 py-1 border-b">
          <div className="h-[60px] w-[60px] box-border rounded-full flex-shrink-0"style={{
          backgroundImage:`url(${ele.sender.profile})`,
            backgroundPosition:"center",
            backgroundSize:"cover",
          }}></div>
          <div className=""><p className="font-bold inline">{ele.sender.username} </p><p className="text-sm inline">{ele.notification}</p>
          <p>at:{ele.createdAt}</p>
          </div>
        </div>
        ))
        :<p className="pl-1.5">There is no any notifications at the moment</p>
      }
          {
          loading ?
         <div className="text-center"><ClipLoader/></div>
          :
            totalNotifications>10 && pageNumber<totalPages &&
            <Button variant="secondary"className="mt-5 w-full"onClick={()=>{
            dispatch(updateNotifications({pageNumber:pageNumber+1}))
            }}>See More</Button>
          }
    </div>
    )
}
export default Notification;