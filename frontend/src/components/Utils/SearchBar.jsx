import {IoSearchOutline } from "react-icons/io5";
import {useDispatch} from "react-redux";
import {updateInput} from "../../Redux/Slices/profile";
import {useState,useRef,useCallback,useEffect} from "react";
import useAxiosPost from "../CustomHooks/AxiosPost";
import Toast from "react-hot-toast";
const SearchBar=()=>{
  let [input,setInput]=useState("");
  let {postData,data,loading,error}=useAxiosPost();
  let timer=useRef(null);
  let dispatch=useDispatch();
useEffect(()=>{
  if(data){
    dispatch(updateInput({searchResult:data?.data}));
    dispatch(updateInput({searchLoading:loading}));
  }
  else{
    dispatch(updateInput({searchLoading:loading}));
  }
},[data,error,loading]);
  const handleInput=async (e)=>{
    let inputData=e.target.value;
    setInput(inputData);
    if(!inputData){
      dispatch(updateInput({isTypingForSearchUser:false}));
    }
    else {
      dispatch(updateInput({isTypingForSearchUser:true}));
      await postData("/auth/searchUsers",{input:inputData});
    }
  }
  const debounce=useCallback((e)=>{
    e.preventDefault();
    if(timer.current) clearTimeout(timer.current);
      timer.current=setTimeout(()=>handleInput(e),500);
  },[]);
 // const debounced=debounce(handleInput,400);
  return(
    <div className="text-center mb-5">
      <form className="relative">
        <input type="text"name="search-data"className="h-[35px] rounded-2xl border w-[320px] outline-0 focus:outline-none pl-[50px] text-sm"placeholder="search..."onChange={debounce}/>
        <IoSearchOutline size={25} className="absolute top-[5px] left-[30px] text-[gray]"/>
      </form>
    </div>
    )
}
export default SearchBar;