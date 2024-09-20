const calculatePageNumber=(totalPages,pagePerView=10)=>{
  return Math.ceil(totalPages/pagePerView)
}
export default calculatePageNumber;