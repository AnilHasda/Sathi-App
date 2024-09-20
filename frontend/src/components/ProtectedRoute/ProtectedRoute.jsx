import {Navigate,Outlet} from "react-router-dom";
const ProtectedRoute=({isAuthonticated,children})=>{
if(!isAuthonticated) return <Navigate to={"/auth/login"}/>
 return children?children:<Outlet/>;
}
export default ProtectedRoute;