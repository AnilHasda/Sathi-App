import {Outlet} from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
const Layout=()=>{
  return(
    <>
      <Header/>
      <div className="mb-[80px] mt-14">
      <Outlet/>
      </div>
      <Footer/>
    </>
    )
}
export default Layout;