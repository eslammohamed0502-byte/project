import CryptoJS from "crypto-js"


export const Encrypt=async({plaintext,SecrectKey})=>{
    return CryptoJS.AES.encrypt(plaintext,SecrectKey).toString()
}