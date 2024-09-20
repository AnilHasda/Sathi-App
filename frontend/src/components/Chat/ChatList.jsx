const ChatList=()=>{
  let data=[...new Array(20)];
  return(
    <div className="mt-[10px] grid gap-3 px-1.5 pl-3">
      {data.map((_,index)=>(
      <div key={index} className="h-[55px] w-full flex gap-2">
        
        <div className="h-full w-[55px] bg-slate-600 rounded-full"></div>
        
          <div className="flex flex-col pt-1">
          <div className="font-semibold text-[16px]">Anil Hasda</div>
          <div className="text-[gray]">mesaage:something</div>
        </div>
        
      </div>
      ))}
    </div>
    )
}
export default ChatList;