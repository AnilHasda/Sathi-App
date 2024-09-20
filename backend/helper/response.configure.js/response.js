class response{
  constructor(success,message,data=null){
    this.success=success;
    this.message=message;
    this.data=data;
  }
}
export default response;