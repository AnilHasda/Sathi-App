import React,{useState,useEffect,useRef} from "react";
import {useParams} from "react-router-dom";
import {Input} from "../../shadcnComponents/ui/input";
import {useSelector} from "react-redux";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import {HiArrowSmallLeft} from "react-icons/hi2";
import useAxiosPost from "../CustomHooks/AxiosPost";
import useAxiosGet from "../CustomHooks/AxiosGet";
import { ClipLoader} from 'react-spinners';
import { IoCallSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
const Chat=()=>{
  let [messages,setMessage]=useState([]);
  let [input,setInput]=useState(null);
  let [messageImages,setMessageImage]=useState(null);
  let {currentChatInfo}=useSelector(state=>state.chatInfo);
  let {_id:loggedInUserId}=useSelector(state=>state.userData.loggedInUserInfo)
  let {chatId}=useParams();
  let messageEnd=useRef(null);
  //this one is for sending message
  let {postData,error:messageError,loading:messageLoading,data:messageResponse}=useAxiosPost();
  //this one is for getting message
  let {getData:getMessages,loading:getLoading,error:getError,data:responseMessage}=useAxiosGet();
  console.log({loggedInUserId})
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
    window.history.back();
  }
  useEffect(()=>{
    if(!currentChatInfo) goBack();
  },[])
  useEffect(()=>{
    console.log({messageImages})
  },[messageImages])
  //this one is for scroll down to last message
  useEffect(()=>{
    messageEnd.current?.scrollIntoView({behavior:"auto"});
  },[messages])
  //function to send image or message
  const sendMessage=async (e)=>{
    e.preventDefault();
  if(messageImages){
  const formData = new FormData();
  for (let i = 0; i < messageImages.length; i++) {
    formData.append('messageImages', messageImages[i]);
    }
    formData.append("chatId",chatId);
    if(input){
      formData.append("message",input);
    }
  await postData("/message/sendMessage",formData);
    setMessageImage(null);
  }
  if(messageImages.length<0 && input){
    await postData("/message/sendMessage",{chatId,message:input});
    setInput("");
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
        <div className="h-[40px] w-[40px] rounded-full bg-slate-900"
          style={{
            backgroundImage:`url(${currentChatInfo?.profile})`,
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
        ></div>
        <p className="bold text-black text-[16px]">{currentChatInfo?.username}</p>
        </section>
        <section className="flex gap-10 text-[25px] ml-5">
          <IoCallSharp/>
          <FaVideo/>
        </section>
        </header>
        {/*message section starts from here*/}
        <section className="h-[calc(100vh-140px)] overflow-y-auto flex flex-col my-4 px-2 mt-[80px]">
          {
          getLoading ?
          <div className="text-center"><ClipLoader/></div>
          :
           messages?.length>0 ?
            messages.map((message,index)=>{
            let isLastMessageFromSender=messages[index+1]?.sender._id !==message.sender._id;
            return(
            <div key={message._id} className={`flex ${message.sender._id===loggedInUserId && "self-end"} gap-2 h-auto flex-shrink-0 items-center mt-1`}>
              { 
              (message.sender._id !==loggedInUserId) &&
                <div className={`h-[30px] w-[30px] rounded-full bg-slate-900 ${!isLastMessageFromSender && "bg-transparent"}`}
          style={{
            backgroundImage:`url(${isLastMessageFromSender && message.sender.profile})`,
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
        ></div>
              }
              {message.messageType==="image" &&
              <img src={message.message}alt="image"className="max-w-[200px] mb-1"/>
              }
              {message.messageType!=="image" &&
            <div className={`max-w-[200px] h-auto px-2 py-2 rounded-xl leading-[20px] break-words
              ${loggedInUserId === message.sender._id ? "bg-[#08546c] text-gray-200":"bg-[#f1f1f1]"}
            `}>{message.message}</div>
              }
            </div>
            )
            }
            )
            :
           (messageError || getError) ?
               <p className="text-center text-red-900 pt-5">Something went wrong,Try Again!</p>
            :
            <p className="text-center text-red-900 pt-5">Start a conversation</p>
          }
          <div ref={messageEnd}></div>
        </section>
        {/*message section end here*/}
      <footer className="fixed bottom-[0] left-0 bg-[#fff] w-full py-4">
      <form onSubmit={sendMessage} encType="multipart/form-data">
        <div className="flex gap-2 px-4 items-center">
          <label htmlFor="messageImages"><MdOutlinePhotoSizeSelectActual size={30} color="#6b3e26"/></label>
          <input type="file"id="messageImages"className="hidden" multiple accept="image/*" onChange={
          e=>setMessageImage(e.target.files)
          }/>
        <Input type="text"placeholder="enter message..."className="h-[35px] focus:outline-0 rounded-2xl w-[15rem] "value={input}onChange={e=>setInput(e.target.value)}/>
            {
              messageImages?.length > 0 && (
                <button type="submit" className="bg-blue-500 text-gray-200 bg-[#6b3e26] px-4 py-2 rounded-2xl">
                  {
                  messageLoading ?
                  <ClipLoader size={25}/>
                  :
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