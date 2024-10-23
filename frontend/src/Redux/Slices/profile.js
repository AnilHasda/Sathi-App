import {createSlice} from "@reduxjs/toolkit";
let initialState={
  profile:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  loggedInUserInfo:{},
  isTypingForSearchUser:false,//This one is for searching people
  searchResult:[],//it will store user to be search
  searchLoading:false,
  viewProfileData:{},//it will store view-profile data
  loggedInUserFriends:[]//it will stores logged-in user friends
}
let userProfile=createSlice({
  name:"userProfile",
  initialState,
  reducers:{
    updateProfileData:(state,action)=>{
      Object.keys(action.payload).forEach(key=>{
       if(state.hasOwnProperty(key)){
          state[key]=action.payload[key];
       }
       })
    },
      updateInput:(state,action)=>{
      Object.keys(action.payload).forEach(key=>{
        if(state.hasOwnProperty(key)){
          state[key]=action.payload[key];
        }
      })
    },
    updateViewProfile:(state,action)=>{
      state.viewProfileData=action.payload;
    }
  }
});
export const {updateProfileData,updateInput,updateViewProfile}=userProfile.actions;
export default userProfile.reducer;