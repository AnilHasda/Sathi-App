import {createSlice} from "@reduxjs/toolkit";
let initialState={
  currentChatInfo:null,
  //this one is for friendSearchBarInput
  friendSearchBarInput:null,
  totalGroupMembers:[],
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
    },
    updateGroupMembers:(state,action)=>{
      state.totalGroupMembers=[...state.totalGroupMembers,action.payload];
    }
  }
});
export const {
  updateChatInfo,
  updateFriendSearchInput,
  updateGroupMembers,
}=ChatSlice.actions;
export default ChatSlice.reducer;