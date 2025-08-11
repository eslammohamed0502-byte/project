import Joi from "joi"
import { Types } from "mongoose";

 export const customId=(value,helper)=>{
    const data=Types.ObjectId.isValid(value)
    return data? value:helper.message("invalid Id")
  }



  export const generalRules = {
  id: Joi.string().custom(customId),
  password: Joi.string(),
  email: Joi.string().email({ tlds: { allow: true }, minDomainSegments: 2 }),
  file: Joi.object({
    size: Joi.number().positive(),
    path: Joi.string(),
    filename: Joi.string(),
    destination: Joi.string(),
    mimetype: Joi.string(),
    encoding: Joi.string(),
    originalname: Joi.string(),
    fieldname: Joi.string(),
  }).optional(),
  headers: Joi.object({
    authentication: Joi.string().required(),
    host: Joi.string().required(),
    "accept-encoding": Joi.string().required(),
    "content-type": Joi.string().required(),
    "content-length": Joi.string().required(),
    connection: Joi.string().required(),
    "user-agent": Joi.string().required(),
    accept: Joi.string().required(),
    "cache-control": Joi.string().required(),
    "postman-token": Joi.string().required()
  }).options({ presence: "required" }),
};