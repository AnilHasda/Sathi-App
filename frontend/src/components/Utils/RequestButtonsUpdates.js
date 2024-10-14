  //function for request button
  const updateRequestButton=(ele)=>{
    console.log({ele})
    if(ele.status==="pending"){
      if(ele.youSendRequest) return "cancel"
        if(ele.otherSendRequest) return "Accept request" 
        return "Add friend"
    }else{
      if(ele.status==="accepted") return "Friends"
      return "Add friend"
    }
  }
  
  //function for view button
  const updateViewButton=(ele)=>{
    if(ele.isLoggedInUser) return "view profile"
    else{
      if(ele.status!=="accepted"){
        if(ele.otherSendRequest && ele.status !=="rejected") return "delete" 
        else return "view profile"
      }else{
        return "view profile"
      }
    }
  }
  // this one is for or sending request or updating requests(for initial button)
      const updateFriendStatus=(ele)=>{
        ele.status==="none" &&
            sendRequest(ele._id,ele.status);
            ele.status==="pending" &&
            (ele.youSendRequest ?
            updateRequestStatus(ele.requestId,"cancelled",ele._id)
            :
            updateRequestStatus(ele.requestId,"accepted",ele._id)
            )
            }
  export {
    updateRequestButton,
    updateViewButton,
    updateFriendStatus
  };