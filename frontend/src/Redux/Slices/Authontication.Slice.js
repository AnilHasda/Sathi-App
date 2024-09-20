import {createSlice} from "@reduxjs/toolkit";
let initialState={
  isAuthonticated:false,
}
const LoginSlice=createSlice({
  name:"Loginslice",
  initialState,
  reducers:{
    updateAuthontication:(state,action)=>{
      state.isAuthonticated=action.payload;
    },
  }
});
export const {updateAuthontication}=LoginSlice.actions;
export default LoginSlice.reducer;