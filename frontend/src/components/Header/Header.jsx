import {DropdownButton} from "../../shadcnComponents/ui/dropdown-button";
const Header=()=>{
  return(
    <>
    <nav className="h-14 w-full  flex justify-between items-center pl-5 pr-2 fixed top-0 z-10 box-border grow-0 border backdrop-blur shadow-sm">
      <p className="font-bold text-emerald-900 text-xl">Sathi App</p>
      <DropdownButton />
    </nav>  
    </>
    )
}
export default Header;