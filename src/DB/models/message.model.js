 import mongoose from "mongoose";


 const messageSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
        minLength:1
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
 }
 ,
 {
    timestamps:true
 })

 const messageModel=mongoose.models.Message||mongoose.model("Message",messageSchema)
 
 export default messageModel