import {createSlice} from "@reduxjs/toolkit";
let initialState={
  unreadNotifications:0,
  notifications:[],
  totalNotifications:0,
  totalPendingRequests:0,
  pageNumber:1
}
let createNotificationSlice=createSlice({
  name:"notification slice",
  initialState,
  reducers:{
    updateNotifications:(state,action)=>{
      Object.keys(action.payload).forEach(key=>{
        if(state.hasOwnProperty(key)){
          state[key]=action.payload[key];
        }
      })
    },
  }
});
export const {updateNotifications}=createNotificationSlice.actions;
export default createNotificationSlice.reducer;