const pagination=(pageNumber,limit)=>{
  let pagenumber=parseInt(pageNumber);
  let limitingValue=parseInt(limit);
  let skip=(pagenumber-1)*limitingValue;
  return {skip,limitingValue};
}
export default pagination;