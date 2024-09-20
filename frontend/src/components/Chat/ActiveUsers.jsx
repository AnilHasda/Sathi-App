import "../../styles/ActiveUser.css";
const ActiveUsers=()=>{
  let data=[...new Array(10)];
  return(
    <>
      <div className="h-auto w-full flex gap-[15px] overflow-x-scroll items-center mt-[10px] px-2 no-scrollbar">
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