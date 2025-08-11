import Jwt from "jsonwebtoken";

export const generateToken=async({payload,SIGNATURE,options})=>{
    return Jwt.sign(payload,SIGNATURE,options)
}