import CryptoJS from "crypto-js"


export const Dencrypt=async({ciphertext,SecrectKey})=>{
    return CryptoJS.AES.decrypt(ciphertext,SecrectKey).toString(CryptoJS.enc.Utf8)
}