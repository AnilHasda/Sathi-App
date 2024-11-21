import React,{useState,useEffect,useRef} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {Input} from "../../shadcnComponents/ui/input";
import {useSelector} from "react-redux";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import {HiArrowSmallLeft} from "react-icons/hi2";
import useAxiosPost from "../CustomHooks/AxiosPost";
import useAxiosGet from "../CustomHooks/AxiosGet";
import { ClipLoader} from 'react-spinners';
import { IoCallSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
const Chat=()=>{
  let [messages,setMessage]=useState([]);
  let [input,setInput]=useState(null);
  let [messageImages,setMessageImage]=useState(null);
  let [sendingMessageStatus,setSendingMessageStatus]=useState(false);
  let navigate=useNavigate();
  let {currentChatInfo}=useSelector(state=>state.chatInfo);
  let {_id:loggedInUserId,username}=useSelector(state=>state.userData.loggedInUserInfo);
  let {socket}=useSelector(state=>state.socket);
  console.log({currentChatInfo})
  let {chatId}=useParams();
  let messageEnd=useRef(null);
  let imageRef=useRef(null);
  //this one is for sending message

  //this one is for getting message
  let {getData:getMessages,loading:getLoading,error:getError,data:responseMessage}=useAxiosGet();
  console.log({loggedInUserId});
  useEffect(()=>{
    socket.emit("join_chat",{chatId,username})
    //this event fire for gettimg you send message
    const handleYouSendMessage=(message)=>{
      console.log({socketreceivedMesage:message})
      setSendingMessageStatus(false);
        let newMessage=Array.isArray(message)?message:[message];
        setMessage(prev=>([...prev,...newMessage]));
    }
    const handleReceiveMessage=(message)=>{
      console.log({receivemessage:message});
     let newMessage=Array.isArray(message)?message:[message];
        setMessage(prev=>([...prev,...newMessage]));
    }
    socket.on("you_send_message",({message})=>{
      handleYouSendMessage(message);
  })
  socket.on("receive_message",(({message,chatId})=>{
    handleReceiveMessage(message);
  }))
    return()=>{
      socket.off("you_send_message",handleYouSendMessage);
      socket.off("receive_message",handleReceiveMessage);
    }
  },[socket]);
  //function to get Messages
  useEffect(()=>{
    (async ()=>{
      await getMessages(`/message/getMessages/${chatId}`);
    })()
  },[])
  useEffect(()=>{
    setMessage(responseMessage?.data);
    console.log({messages})
  },[responseMessage])
  const goBack=()=>{
    navigate("/");
  }
  useEffect(()=>{
    if(!currentChatInfo) goBack();
  },[])
  useEffect(()=>{
    if(messageImages)
    console.log({messageImages})
    else if(messages) 
    console.log({messages})
  },[messageImages,messages])
  //this one is for scroll down to last message
  useEffect(()=>{
    if(messages?.length>6)
    messageEnd.current?.scrollIntoView({behavior:"smooth"});
    console.log({renderMessage:messages})
  },[messages])
  //function to send image or message
  const sendMessage=async (e)=>{
    e.preventDefault();
    setSendingMessageStatus(true);
  if(messageImages && messageImages.length>0){
    const image=messageImages[0];
    let filesData=[]
    alert("image present");
    let readFiles=Array.from(messageImages).map(image=>{
        return new Promise(resolve=>{
          const reader=new FileReader();
    reader.onload=()=>{
      const fileData=reader.result;
      filesData.push({
        fileData,
        originalName:image.name,
        fileType:image.type,
      });
        resolve();
       }
       reader.readAsArrayBuffer(image);//this reads file and convert it into binary data
      })
    })
      await Promise.all(readFiles);
      if(messageImages && !input){
      socket.emit("send_message",{filesData});
      }
      if(messageImages && input){
      socket.emit("send_message",{
        filesData,
        message:input || null
      })
    }
    setMessageImage(null);
    imageRef.current.value=null;
  }
  else if(messageImages?.length<1 || input){
   socket.emit("send_message",{message:input})
  }
  setInput("");
  }
  return(
    <>
      <header className="h-[70px] w-full border-b-2 flex flex-shrink-0 bg-white gap-5 items-center px-2 fixed top-0 left-0 text-[#6b3e26]">
        <section onClick={goBack}>
          <HiArrowSmallLeft size={30}/>
        </section>
        <section className="flex flex-shrink-0 gap-3 items-center ">
        <div className="h-[40px] w-[40px] grid place-items-center rounded-full bg-slate-900"
          style={{
            backgroundImage:`url(${
            currentChatInfo?.isGroupChat ? currentChatInfo.groupImage
            :
            currentChatInfo?.profileDetail?.profile
            })`,
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
        >
          {
            currentChatInfo?.isGroupChat && !currentChatInfo.groupImage && <MdGroups size={25} className="text-white"/>
          }
        </div>
        <p className="bold text-black text-[16px]">{
        currentChatInfo?.isGroupChat ?
        currentChatInfo.groupname.slice(0,8)+"..."
        :
        currentChatInfo?.profileDetail?.username.slice(0,8)+"..."
          
        }</p>
        </section>
        <section className="flex gap-10 text-[25px] ml-5">
          <IoCallSharp/>
          <FaVideo/>
        </section>
        </header>
        {/*message section starts from here*/}
        <section className="h-[calc(100vh-140px)] overflow-y-auto flex flex-col my-4 px-2 mt-[80px] mb-[55px]">
          {
          getLoading ?
          <div className="text-center"><ClipLoader/></div>
          :
           messages?.length>0 ?
            messages.map((message,index)=>{
            let isLastMessageFromSender=messages[index+1]?.sender?._id !==message.sender?._id;
            return(
            <div key={message?._id} className={`flex ${message.sender?._id===loggedInUserId && "self-end"} gap-2 h-auto flex-shrink-0 items-center mt-1`}>
              { 
              (message.sender?._id !==loggedInUserId) &&
                <div className={`h-[30px] w-[30px] rounded-full bg-slate-900 ${!isLastMessageFromSender && "bg-transparent"}`}
          style={{
            backgroundImage:`url(${isLastMessageFromSender && message.sender?.profile})`,
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
        ></div>
              }
              {message.messageType==="image" &&
              <img src={message.message}alt="image"className="max-w-[200px] mb-1"/>
              }
              {message.messageType!=="image" &&
            <div className={`max-w-[200px] h-auto px-2 py-2 rounded-xl leading-[20px] break-words my-2
              ${loggedInUserId === message.sender?._id ? "bg-[#08546c] text-gray-200":"bg-[#f1f1f1]"}
            `}>{message.message}</div>
              }
            </div>
            )
            }
            )
            :
           (getError) ?
               <p className="text-center text-red-900 pt-5">Something went wrong,Try Again!</p>
            :
            <p className="text-center text-red-900 pt-5">Start a conversation</p>
          }
          <div ref={messageEnd} className="mb-5 relative left-10 inline">
          {sendingMessageStatus?"sending...":""}
            </div>
        </section>
        {/*message section end here*/}
      <footer className="fixed bottom-[0] left-0 backdrop-blur h-auto w-full pb-4">
      <form onSubmit={sendMessage}>
        <div className="flex gap-2 px-4 items-center">
          <label htmlFor="messageImages"><MdOutlinePhotoSizeSelectActual size={30} color="#6b3e26"/></label>
          <input type="file"
          id="messageImages"
          className="hidden" 
          multiple accept="image/*"
          ref={imageRef}
          onChange={
          e=>{
          setMessageImage(e.target.files);
          }
          }/>
        <Input type="text"placeholder="enter message..."className="h-[35px] focus:outline-0 rounded-2xl w-[15rem] "value={input}onChange={e=>setInput(e.target.value)}/>
            {
              messageImages?.length > 0 && (
                <button type="submit" className="bg-blue-500 text-gray-200 bg-[#6b3e26] px-4 py-2 rounded-2xl">
                  {
                  /* messageLoading ?
                  <ClipLoader size={25}/>
                  
                  :*/
                  "Send"
                  }
                </button>
              )
            }
        </div>
      </form>
      </footer>
    </>
    )
}
export default Chat;