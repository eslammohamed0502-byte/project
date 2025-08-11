
import bcrypt from "bcrypt"


export const compare=async({plaintext,ciphertext}={})=>{
    return bcrypt.compareSync(plaintext,ciphertext)
}