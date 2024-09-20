import {DropdownButton} from "../../shadcnComponents/ui/dropdown-button";
const Header=()=>{
  return(
    <>
    <nav className="h-14 w-full bg-slate-900 flex justify-between items-center pl-5 pr-2 fixed top-0 z-10 box-border grow-0">
      <p className="font-bold text-[#f1f1f1] text-xl">Chat App</p>
      <DropdownButton className="bg-[#3b5998]"/>
    </nav>  
    </>
    )
}
export default Header;