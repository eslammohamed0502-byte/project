import Joi from "joi";
import { userGender } from "../DB/models/user.model.js";
import {  customId, generalRules } from "../utils/generalRules/index.js";

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().alphanum().min(3).max(15),
    password: generalRules.password,
    cPassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string().valid(userGender.male, userGender.famale),
    email: generalRules.email,
    age: Joi.number().min(18).max(70).integer().positive(),
    phone: Joi.string(),
  })
  .options({ presence: "required" })
  .with("password", "cPassword"),
  // files: Joi.array().items(generalRules.file).required()
  file:generalRules.file.required()
};

export const updateProfileImageSchema = {
file:generalRules.file.required()
};


export const signinSchema={
   body:Joi.object({
        email:generalRules.email,
        password:generalRules.password
      }).options({presence:"required"})
}

export const updatePasswordSchema={
   body:Joi.object({
        oldPassword:generalRules.email,
        newPassword:generalRules.password,
        cPassword:Joi.string().valid(Joi.ref("newPassword"))
      }).options({presence:"required"})
}

export const forgetPasswordSchema={
   body:Joi.object({
        email:generalRules.email
      }).options({presence:"required"})
}

export const resetPasswordSchema={
   body:Joi.object({
        email:generalRules.email,
        otp:Joi.string().length(4),
       newPassword:generalRules.password,
        cPassword:Joi.string().valid(Joi.ref("newPassword"))
      }).options({presence:"required"})
}


export const updateProfileSchema={
   body:Joi.object({
        name:Joi.string().alphanum().min(3).max(15),
        gender:Joi.string().valid(userGender.male,userGender.famale),
        email:generalRules.email,
        age:Joi.number().min(18).max(70).integer().positive(),
        phone:Joi.string(),
      }).with("password","cPassword")
}
export const freezeProfileSchema={
   params:Joi.object({
       id:generalRules.id
      })
}

