import notifications from "../../models/notification/notification.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";

/**************************************
/** there should be responseConfigure     inatead of that rename is not         working for this at this instant
*************************************/

import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
import pagination from "../../Utils/pagination.js";
const getNotifications=wrapper(
  async (req,resp,next)=>{
    console.log(req.query);
    let userId=req.userData._id;
    let {pageNumber,limit}=req.query;
    let {skip,limitingValue}=pagination(pageNumber,limit);
    console.log({skip,limitingValue})
    let totalNotifications=await notifications.countDocuments({receiver:userId});
  let retrieveNotifications=await notifications.find({receiver:userId}).populate("sender","username profile").skip(skip).limit(limitingValue);
if(retrieveNotifications.length>0){
  console.log(retrieveNotifications);
  return resp.json(new response(true,"success",{retrieveNotifications,totalNotifications}));
}
next(new customError("failed to retrieve notifications",500));
});

/***************************************
 /** update status of notifications
 *************************************/
 const updateNotificationStatus=wrapper(async (req,resp,next)=>{
  let update=await notifications.findAndUpdate(
    {status:"unread"},
    {$set:{status:"read"}}
    );
    if(update.modifiedCount>0) return resp.json(new response(true,"success"));
    return next(new customError("failed to update notification status",500));
 })
 /*************************************
  /** common controller to get number of    pending request and total unread     notifications
  *************************************/
  const getInitialInfo=wrapper(async (req,resp,next)=>{
    let loggedInUserId=req.userData._id;
    console.log({loggedInUserId})
    let pipeline=[
      {
      $match:{
        receiver:loggedInUserId,
        read:"unread"
      }
      },
      {
        $count:"totalUnreadNotifications"
      },{
        $lookup:{
          from:"friends",
          pipeline:[
            {
            $match:{
              receiver:loggedInUserId,
              status:"pending"
             }
            }
            ],
            as:"pendingRequests"
        }
        },{
          $addFields:{
            totalPendingRequest:{
              $size:"$pendingRequests"
            }
          }
        }
      ];
    let initialInfo=await notifications.aggregate(pipeline);
    console.log({initialInfo})
    if(initialInfo) return resp.json(new response(true,"success",initialInfo));
    return next(new Error());
  })
export {
  getNotifications,
  updateNotificationStatus,
  getInitialInfo
}