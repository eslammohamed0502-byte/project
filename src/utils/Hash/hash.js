import bcrypt from "bcrypt"


export const Hash=async({plaintext,SALT_ROUNDS=process.env.SALT_ROUNDS}={})=>{
    return bcrypt.hashSync(plaintext,Number(SALT_ROUNDS))
}