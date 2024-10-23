import {createSlice} from "@reduxjs/toolkit";
let initialState={
  currentChatInfo:null,
  friendSearchBarInput:null//this one is for friendSearchBarInput
}
let ChatSlice=createSlice({
  name:"chatSlice",
  initialState,
  reducers:{
    updateChatInfo:(state,action)=>{
      Object.keys(action.payload).forEach(key=>{
        if(state.hasOwnProperty(key)){
          state[key]=action.payload[key];
        }
      })
    },
    updateFriendSearchInput:(state,action)=>{
      state.friendSearchBarInput=action.payload;
    }
  }
});
export const {updateChatInfo,updateFriendSearchInput}=ChatSlice.actions;
export default ChatSlice.reducer;