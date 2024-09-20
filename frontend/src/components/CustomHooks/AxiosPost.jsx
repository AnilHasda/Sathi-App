import {useState,useEffect} from "react";
import useAxiosInstance from "./axios";
const useAxiosPost=()=>{
  let [data,setData]=useState(null);
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState(null);
  let axiosInstance=useAxiosInstance();
  const postData=async (url,formData)=>{
  try{
    setLoading(true);
    let {data}=await axiosInstance.post(url,formData,{withCredentials:true});
    if(data?.success){
      setData(data);
    }else{
      setData([]);
    }
  }catch(error){
    setData([]);
    setError(error);
  }finally{
    setLoading(false);
  }
  }
  return {postData,data,loading,error};
}
export default useAxiosPost;