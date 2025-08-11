
 import mongoose from "mongoose";


 const revokeTokenSehema= new mongoose.Schema({
    tokenId:{
        type:String,
        required:true,
    },
    expireAt:{
        type:String,
        required:true,
    }
 }
 ,
 {
    timestamps:true
 })

 const revokeTokenModel=mongoose.models.revokeToken||mongoose.model("revokeToken",revokeTokenSehema)
 
 export default revokeTokenModel