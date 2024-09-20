import {combineReducers} from "@reduxjs/toolkit";

//creating wrapper to combine all LoginReducer
const mainReducer=combineReducers({
    
});
// create root reducer to clear all of the state while logout action is perfomred
const resetReducer=(state,action)=>{
  if(action.type==="loggedOut/reset"){
    state=undefined;
  }
  return mainReducer(state,action);
}
export default resetReducer;