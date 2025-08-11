import Jwt from "jsonwebtoken";

export const verifytoken=({token,SIGNATURE})=>{
    return Jwt.verify(token,SIGNATURE)
}