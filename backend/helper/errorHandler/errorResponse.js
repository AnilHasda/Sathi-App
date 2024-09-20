const errorResponse=(error,req,resp,next)=>{
  error.message=error.message||"Internal server error";
  error.statusCode=error.statusCode || 500;
  if(error.code===11000){
    console.log(error)
   let duplicateError=Object.entries(error.keyValue).map(ele=>`${ele.join(" ")} already exist`);
    error.message=`"${duplicateError[0]}"`;
  error.statusCode= 400;
  console.log(error.message)
  }
  console.log(error)
  resp.status(error.statusCode || false).json({success:error.success,message:error.message,statusCode:error.statusCode});
}
export default errorResponse;