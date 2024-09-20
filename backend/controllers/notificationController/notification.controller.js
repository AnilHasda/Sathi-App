import notifications from "../../models/notification/notification.js";
import wrapper from "../../helper/tryCatch/wrapperFunction.js";
//there should be responseConfigure inatead of that rename is not working for this at this instant
import response from "../../helper/response.configure.js/response.js";
import customError from "../../helper/errorHandler/errorHandler.js";
const getNotifications=wrapper(
  async (req,resp,next)=>{
    console.log(req.query);
    let userId;
    if(req.params.id) userId=req.params.id;
    else userId=req?.userData?._id;
    console.log({userId})
    let {pageNumber,limit}=req.query;
    let pagenumber=parseInt(pageNumber) ;
    let skip=(pagenumber-1)*parseInt(limit);
    let totalNotifications=await notifications.countDocuments({receiver:userId});
  let retrieveNotifications=await notifications.find({receiver:userId}).populate("sender","username profile").skip(skip).limit(limit);
if(retrieveNotifications.length>0){
  console.log(retrieveNotifications);
  return resp.json(new response(true,"success",{retrieveNotifications,totalNotifications}));
}
next(new customError("failed to retrieve notifications",500));
})
export {getNotifications}