import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const multerConfiguration=(folderName)=>{
let storage=multer.diskStorage({
  destination:function (req,file,cb){
    console.log(file)
    cb(null,path.join(__dirname,`../${folderName}`));
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+"_"+file.originalname);
  }
});
let multerImage=multer({storage});
return multerImage;
}
export default multerConfiguration;