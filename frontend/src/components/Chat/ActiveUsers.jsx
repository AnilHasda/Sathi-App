import "../../styles/ActiveUser.css";
import { MdGroups } from "react-icons/md";
import{
  Dialog,
  DialogTrigger
}from "../../shadcnComponents/ui/dialog";
import {CreateGroupChat} from "./CreateGroupChat";
const ActiveUsers=()=>{
  let data=[...new Array(10)];
  return(
    <>
      <div className="h-auto w-full flex gap-[15px] overflow-x-scroll items-center mt-[10px] px-2 no-scrollbar">
        {/*create group chat section*/}
         <Dialog>
         <DialogTrigger asChild>
        <div className="h-14 w-14 flex flex-shrink-0 rounded-full border-2 items-center justify-center"><MdGroups size={30}/></div>
              </DialogTrigger>
              <CreateGroupChat/>
              </Dialog>
      {data.map((_,index)=>(
     <div key={index} className="h-14 w-14 flex-shrink-0 rounded-full bg-slate-900 relative">
            <div className="h-5 w-5 bg-[#3b5998] rounded-full absolute border-2 border-[white] bottom-0 right-0"></div>
     </div>
      ))}
      </div>
    </>
    )
}
export default ActiveUsers;