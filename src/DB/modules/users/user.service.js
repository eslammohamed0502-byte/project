import userModel, { userProvider, userRole } from "../../models/user.model.js"
import { verifytoken,generateToken,Encrypt,Dencrypt, Hash,compare,eventEmitter } from "../../../utils/index.js"
import { customAlphabet, nanoid } from "nanoid"
import revokeTokenModel from "../../models/revoke-token.model.js"
import cron from "node-cron"
import OAuth2Client from 'google-auth-library';
import cloudinary from "../../../utils/cloudinary/index.js"

export const signUp=async(req,res,next)=>{
  
  const {name,email,password,cPassword,phone,gender,age}=req.body
 
  // const arrPaths=[]
  //  for (const file of req?.files) {

  const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:"eslam",
    resource_type:"auto"
  });
  // arrPaths.push({secure_url,public_id})
  //  }


    if(await userModel.findOne({email})){
      throw new Error("email already exist",{cause:409})
    }
    const hash=await Hash({plaintext:password,SALT_ROUNDS:process.env.SALT_ROUNDS})
    const ciphertext= await Encrypt({plaintext:phone,SecrectKey:process.env.SECERT_KEY})

    // eventEmitter.emit("sendEmail",{email})
 

  const user=await userModel.create({name,email,password:hash,phone:ciphertext,gender,age,confirmed: false,ProfileImage:{secure_url,public_id}
    // coverImages:arrPaths,
  })

return res.status(201).json({message:"Done",user}) 
  } 



export const confirmEmail= async (req, res, next) => {
  
    const { token } = req.params;
    if (!token) {
        throw new Error( "Token not found",{cause:409})
    }
const decoded = await verifytoken({ token, SIGNATURE: process.env.SIGNATURE });
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      throw new Error("email already exist",{cause:409})
    }
    user.confirmed = true;
    await user.save();
    return res.status(200).json({ message: "Email confirmed successfully" });
  } 




export const loginWithGmail=async(req,res,next)=>{
    const {idToken}=req.body
const client = new OAuth2Client();
async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.WEB_CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    return payload
};
const {email,email_verified,picture,name}=await verify()
  let user= await userModel.findOne({email})
    if(!user){
      userr=await userModel.create({
        name,
        email,
        confirmed:email_verified,
        image:picture,
        password:nanoid(),
        provider:userProvider.google
    })
} 
if(user.provider!==user.provider.google){
throw new Error(" log in ");
}

 const access_token = await generateToken({
  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.ACCESS_TOKEN_USER 
    : process.env.ACCESS_TOKEN_ADMIN,
  options: { expiresIn: "1h", jwtid: nanoid() }
});

    const refresh_token=await generateToken({  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.REFRESH_TOKEN_USER
    : process.env.REFRESH_TOKEN_ADMIN,
  options: { expiresIn: "1y", jwtid: nanoid()}
}) 
return res.status(201).json({message:"Done",access_token,refresh_token}) 
} 


export const signIn=async(req,res,next)=>{
 
    const {email,password}=req.body
    const user= await userModel.findOne({email})
    if(!user){
      throw new Error("email already exist",{cause:409})
    }
    const match=await compare({plaintext:password,ciphertext:user.password})
    if(!match){
    throw new Error("Password Is Not Match",{cause:409}) 
    }
   const access_token = await generateToken({
  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.ACCESS_TOKEN_USER 
    : process.env.ACCESS_TOKEN_ADMIN,
  options: { expiresIn: "1h", jwtid: nanoid() }
});

    const refresh_token=await generateToken({  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.REFRESH_TOKEN_USER
    : process.env.REFRESH_TOKEN_ADMIN,
  options: { expiresIn: "1y", jwtid: nanoid()}
}) 
return res.status(201).json({message:"Done",access_token,refresh_token}) 
} 



export const getProfile=async(req,res,next)=>{
  const phone=await Dencrypt({ciphertext:req.user.phone,SecrectKey:process.env.SECERT_KEY})
  req.user.phone=phone
  return res.status(201).json({message:"Done",user:req.user}) 

 } 


export const logout=async(req,res,next)=>{
const revokeToken= await revokeTokenModel.create({
  tokenId:req.decoded.jti,
  expireAt:req.decoded.exp
})
  return res.status(200).json({message:"success",revokeToken}) 
 }


export const refreshToken=async(req,res,next)=>{
const { authorization } = req.headers;
      const [prefix, token] = authorization?.split(" ") || [];

      if (!prefix || !token) {
        return res.status(404).json({ message: "token not exist" });
      }

      let signature = "";
      if (prefix === "bearer") {
        signature = process.env.REFRESH_TOKEN_USER
      } else if (prefix === "admin") {
        signature = process.env.REFRESH_TOKEN_ADMIN
      } else {
        return res.status(404).json({ message: "wrong prefix" });
      }
      const decoded = await verifytoken({ token, SIGNATURE: signature });
       if (!decoded?.email) {
        throw new Error("Invaild Token",{cause:403});
        }
       const revoked = await revokeTokenModel.findOne({tokenId:decoded.jti});
          if (revoked) {
          return res.status(409).json({ message: "log in again" });
          }
          const user = await userModel.findOne({email:decoded.email});
           if (!user) {
           return res.status(409).json({ message: "user not exist" });
         }
     const access_token = await generateToken({
  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.ACCESS_TOKEN_USER 
    : process.env.ACCESS_TOKEN_ADMIN,
  options: { expiresIn: "1h", jwtid: nanoid() }
});

    const refresh_token=await generateToken({  payload: { id: user._id, email: user.email },
  SIGNATURE: user.role === userRole.user 
    ? process.env.REFRESH_TOKEN_USER
    : process.env.REFRESH_TOKEN_ADMIN,
  options: { expiresIn: "1y", jwtid: nanoid()}
}) 
return res.status(201).json({message:"Done",access_token,refresh_token}) 

 }


 export const updatePassword=async(req,res,next)=>{
  const {oldPassword,newPassword}=req.body
  if(!compare({plaintext:oldPassword,ciphertext:req.user.password})){
    throw new Error("invalid password")
  }
  const hash =await Hash({plaintext:newPassword,SALT_ROUNDS:process.env.SALT_ROUNDS})
  req.user.password=hash
  await req.user.save()
 return res.status(201).json({message:"Changed Password Done"}) 

 }

 
 export const forgetPassword=async(req,res,next)=>{
  const {email}=req.body
   const user= await userModel.findOne({email})
    if(!user){
      throw new Error("email not exist",{cause:409})
    }
    const otp=customAlphabet("0123456789",4)()
    eventEmitter.emit("forgetPassword",{email,otp})
    user.otp= await Hash({plaintext:otp,SALT_ROUNDS:process.env.SALT_ROUNDS})
    await user.save()
     return res.status(201).json({message:"restored Password Done"}) 
 }



 export const resetPassword=async(req,res,next)=>{
  const {email,otp,newPassword}=req.body
   const user= await userModel.findOne({email,otp:{$exists:true}})
    if(!user){
      throw new Error("email not exist",{cause:409})
    }
    if(!await compare({plaintext:otp,ciphertext:user?.otp})){
      throw new Error("invaild otp");
    }
    const hash=await Hash({plaintext:newPassword,SALT_ROUNDS:process.env.SALT_ROUNDS})
    await userModel.updateOne({email},{
      password:hash
    })
     return res.status(201).json({message:" Password Changed"}) 
 }


 export const updateProfile=async(req,res,next)=>{
const {age,gendar,email,phone,name}=req.body
if(name) req.user.name=name
if(age) req.user.age=age
if(gendar) req.user.gendar=gendar
if(email){
 const user= await userModel.findOne({email})
    if(!user){
      throw new Error("email already exist",{cause:409})
    }
   eventEmitter.emit("sendEmail",{email})
  req.user.email=email
  req.user.confirmed=false
}
if(phone){
  const ciphertext= await Encrypt({plaintext:phone,SecrectKey:process.env.SECERT_KEY})
  req.user.phone=phone
} 
await req.user.save()
     return res.status(201).json({message:"updated Profile"}) 
 }


 export const getProfileData=async(req,res,next)=>{
  const {id}=req.params
  const user= await userModel.findById(id).select("-password -role -confirmed -phone")
    if(!user){
      throw new Error("email already exist",{cause:409})
    }
  return res.status(201).json({message:"restored all data",user}) 

 }

 export const freezeProfile=async(req,res,next)=>{
  const {id}=req.params
  if(id&&req.user.role!==userRole.admin){
throw new Error("you can not freeze this account");
  }
  const user= await userModel.updateOne({
    _id:id||req.user._id,
    isDeleted:{$exists:false}
  },{
    isDeleted:true,
    deletedBy:req.user._id
  })
    user.matchedCount? res.status(201).json({message:"freezed Done"}) : res.status(409).json({message:"fail to freeze"})
 }


//  export const deleteExpiredTokens=()=>{
//   cron.schedule("* * * * *",async()=>{
//     try {
//       const result = await revokeTokenModel.deleteMany({ isDeleted: true });
//       console.log("Deleted Tokens Done");
//     } catch (error) {
//       console.error("Failed to delete expired tokens")
//     }
//   })
//  }



export const updateProfileImage=async(req,res,next)=>{

   const arrPaths=[]
   for (const file of req?.files) {

  const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:"eslam",
    resource_type:"auto"
  });
  arrPaths.push({secure_url,public_id})
   }
  const user =await userModel.findByIdAndUpdate({_id:req.user._id},{coverImages:arrPaths})
  for (const image of user.coverImages) {
      await cloudinary.uploader.destroy(image?.public_id)
  }
  res.status(201).json({message:"update done",user})
}