class customError extends Error{
  constructor(message,statusCode,extra,success=false){
    super(message);
    this.statusCode=statusCode;
    this.success=success;
  }
}
export default customError;