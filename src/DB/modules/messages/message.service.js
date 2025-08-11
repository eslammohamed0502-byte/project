import messageModel from "../../models/message.model.js";
import userModel from "../../models/user.model.js"


export const createMessage= async(req,res,next)=>{
    const {userId,content}=req.body
    const userExist= await userModel.findOne({_id:userId,isDeleted:{$exists:false}})
    if(!userExist){
        throw new Error("user not exist");
    }
    const message=await messageModel.create({userId,content})
    res.status(201).json({message:"message created",message})
}


export const listMessage= async(req,res,next)=>{
    
    const messages=await messageModel.find({userId:req?.params?.id}).populate([
        {
            path:"userId"
        }
    ])
    res.status(200).json({message:"message created",messages})
}


export const getOneMessage= async(req,res,next)=>{
    const {id}=req.params
    const messages=await messageModel.findOne({userId:req?.user?._id,_id:id})
    if(!message){
        throw new Error("message not found");
    }
    res.status(200).json({message:"message created",messages})
}