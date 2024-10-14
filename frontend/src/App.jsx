import React,{useEffect,useState} from "react";
import {useDispatch} from "react-redux";
import {updateAuthontication} from "./Redux/Slices/Authontication.Slice";
import {updateProfileData} from "./Redux/Slices/profile";
import toast from "react-hot-toast";
import axios from "axios";
import Router from "./components/Router/router";
import useGetInitialInfo from "./components/CustomHooks/useGetInitialInfo";
import { ClipLoader} from 'react-spinners';
const App=()=>{
  let [loading,setLoading]=useState(true);
  let dispatch=useDispatch();
  let getInitialInfo=useGetInitialInfo();
    //function that loads notifications
  useEffect(() => {
  (async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("http://localhost:5000/api/v1/auth/checkLogs", { withCredentials: true });
      if (data?.success) {
        setLoading(false);
        dispatch(updateAuthontication(true));
        dispatch(updateProfileData({profile:data.data.profile,loggedInUserInfo:data.data}));
        getInitialInfo();
        toast.success(data?.message);
      }
    } catch (error) {
      //alert(error.message);
      console.log(error);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  })();
}, []); // No need to include `dispatch`

  return (
  <div className="max-w-[600px] m-auto relative">
    {
      loading?<ClipLoader/>
      :<Router/>
    }
  </div>
  )
}
export default App;