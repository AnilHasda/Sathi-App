import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let storage=multer.diskStorage({
  destination:function (req,file,cb){
    console.log(file)
    cb(null,path.join(__dirname,"../profileImages"));
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+"_"+file.originalname);
  }
});
let uploadProfile=multer({storage});
export default uploadProfile;