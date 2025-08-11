import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../../middlewares/authentication.js";
import { validation } from "../../../middlewares/validation.js";
import * as UV from "../../../validations/user.validation.js";
import { userRole } from "../../models/user.model.js";
import { authorization } from "../../../middlewares/authorzation.js";
import { allowedExtentions, MulterHost } from "../../../middlewares/multer.js";
import messageRouter from "../messages/message.controller.js";
const userRouter=Router({caseSensitive:true,strict:true})

userRouter.use("/:id/messages",messageRouter)


userRouter.post(
  "/signup",
  MulterHost({
    customPath: "users",
    customExtentions: allowedExtentions.image
  }).single("attachment"),
  validation(UV.signUpSchema),
  US.signUp
);
userRouter.post("/signin",validation(UV.signinSchema),US.signIn)
userRouter.post("/loginWithGmail",US.loginWithGmail)
userRouter.get("/confirmEmail/:token",US.confirmEmail)
userRouter.get("/profile",authentication(),US.getProfile)
userRouter.get("/profile/:id",US.getProfileData)
userRouter.post("/refreshToken",US.refreshToken)
userRouter.post("/logout",authentication(),US.logout)
userRouter.patch("/updatePassword",validation(UV.updatePasswordSchema),authentication(),US.updatePassword)
userRouter.patch("/updateProfile",validation(UV.updateProfileSchema),authentication(),US.updateProfile)

userRouter.patch("/updateImage",authentication(),
MulterHost({
    customPath: "users",
    customExtentions: allowedExtentions.image
  }).single("attachment"),validation(UV.updateProfileImageSchema),US.updateProfileImage)

userRouter.patch("/forgetPassword",validation(UV.forgetPasswordSchema),authentication(),US.forgetPassword)
userRouter.patch("/resetPassword",validation(UV.resetPasswordSchema),authentication(),US.resetPassword)
userRouter.delete("/freezeProfile/{:id}",validation(UV.freezeProfileSchema),authentication(),US.freezeProfile)



export default userRouter