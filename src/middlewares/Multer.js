import multer from "multer";
import fs from "fs"
 import path from "path";
export const allowedExtentions={
  image:["image/png","image/jpeg"],
  video:["video/mp4"],
}


export const MulterLocal=({customPath,customExtentions=[]}={})=>{

const fullPath = path.resolve(`uploads/${customPath}`);
  if(!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath,{recursive:true})
  }
    const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,fullPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "_" + file.originalname)
  }
})

function fileFilter(req, file, cb) {
    if (!customExtentions.includes(file.mimetype)) {
      cb(new Error("invalidType"), false) 
    } else {
      cb(null, true)
    }
  }
  const upload = multer({
    storage,
    fileFilter,
  });
  return upload
}




export const MulterHost=({customExtentions=[]}={})=>{

    const storage = multer.diskStorage({})

function fileFilter(req, file, cb) {
    if (!customExtentions.includes(file.mimetype)) {
      cb(new Error("invalidType"), false) 
    } else {
      cb(null, true)
    }
  }
  const upload = multer({
    storage,
    fileFilter,
  });
  return upload
}
