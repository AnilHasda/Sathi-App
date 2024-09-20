import {useState,useEffect} from "react";
import {Label} from "../../shadcnComponents/ui/label";
import {Input} from "../../shadcnComponents/ui/input";
import {Button} from "../../shadcnComponents/ui/button";
import Toast from "react-hot-toast";
import useAxiosPost from "../CustomHooks/AxiosPost";
import { ClipLoader} from 'react-spinners';
import {useNavigate} from "react-router-dom";
const SignupPage=()=>{
  let [formData,setFormData]=useState({});
  let[previewImage,setPreviewImage]=useState(null);
  let [confirmpass,setConfirmpass]=useState();
  let[profile,setProfile]=useState(null);
  let {postData,data,loading,error}=useAxiosPost();
  let navigate=useNavigate();
  useEffect(
    ()=>{
      if(data?.success){ Toast.success(data?.message);
      navigate("/auth/login");
      }
      if(error){
      console.log(error)
      Toast.error(error?.response?.data?.message || "Something went wrong");
      }
      },[data,error]);
  const registerUser=async (e)=>{
    e.preventDefault();
    let {password}=formData;
    if(password===confirmpass){
      let userData=new FormData();
      userData.append("firstname",formData.firstname);
      userData.append("lastname",formData.lastname);
      userData.append("username",formData.username);
      userData.append("email",formData.email);
      userData.append("password",formData.password);
      userData.append("profile",profile);
      await postData("/auth/register",userData);
    }else{
      alert("confirm password doesn't matched");
    }
  }
  const handleInput=(e)=>{
    let {name,value}=e.target;
    setFormData(prev=>{
      let data={...prev,[name]:value};
      return data;
    });
  }
  //set preview image for profile
  const previewProfile=(e)=>{
   let file=e.target.files[0];
   setProfile(file);
    setPreviewImage(URL.createObjectURL(file));
  }
  return (
    <>
      <form method="post"className="w-auto mb-[100px]"encType="multipart/form-data"onSubmit={registerUser}>
        <div className=" w-[300px] m-auto mt-[80px]">
         <div className="text-center mb-5">Signup Form</div>
         
         <label htmlFor="fname">First -name <p className="text-[red] text-xl inline">*</p></label><br/>
        <input type="text"placeholder="Enter your firstname"id="fname"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="firstname"onChange={handleInput}required/><br/>
        
           <label htmlFor="lname">Last -name <p className="text-[red] text-xl inline">*</p></label><br/>
        <input type="text"placeholder="Enter your lastname"id="lname"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="lastname"onChange={handleInput}required/><br/>
        <label htmlFor="username">User -name <p className="text-[red] text-xl inline">*</p></label><br/>
        
        <input type="text"placeholder="Enter username"id="username"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="username"onChange={handleInput}required/><br/>
        
        <label htmlFor="email">Email <p className="text-[red] text-xl inline">*</p></label><br/>
        <input type="email"placeholder="Enter your email"id="email"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="email"onChange={handleInput}required/><br/>
         <label htmlFor="password">Password <p className="text-[red] text-xl inline">*</p>
         </label><br/>
        <input type="password"placeholder="Enter your password"id="password"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="password"onChange={handleInput}required/><br/>
        
           <label htmlFor="cpassword">Confirm-Password <p className="text-[red] text-xl inline">*</p>
           </label><br/>
        <input type="password"placeholder="Enter your confirm-password"id="cpassword"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"name="cpassword"onChange={e=>setConfirmpass(e.target.value)}required/><br/>
        
        <label htmlFor="profile">Profile</label><br/>
        <input type="file"name="profile_image"className="h-10 w-full border border-[gray] rounded-sm mb-[10px] mt-[10px] text-sm pl-1"accept="image/*"onChange={previewProfile}/>
        {previewImage &&
        <>
        <label>Preview Profile</label><br/>
        <img src={previewImage} className="h-[200px] w-auto border border-[gray] rounded-sm mb-[10px] mt-[10px]"width="100%"/>
        </>
        }
        <Button variant="default"type="submit"className="w-full mt-1">
          {
            loading ?<ClipLoader size={20} color="#fff"/>
            :"Submit"
          }
         </Button>
        </div>
      </form>
    </>
    )
}
export default SignupPage;