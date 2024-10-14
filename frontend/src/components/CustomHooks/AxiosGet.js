import {useState,useEffect} from "react";
import useAxiosInstance from "./axios";
const useAxiosGet=()=>{
  let [data,setData]=useState(null);
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState(null);
  let axiosInstance=useAxiosInstance();
  const getData=async (url)=>{
    setLoading(true);
    setError(null);
  try{
    let {data}=await axiosInstance.get(url);
    if(data?.success){
      setData(data);
      console.log({data})
    }
  }catch(error){
    setData([]);
    setError(error);
  }finally{
    setLoading(false);
  }
  }
  return {getData,data,loading,error};
}
export default useAxiosGet;