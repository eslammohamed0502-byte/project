import Joi from "joi"
import { generalRules } from "../utils/index.js"


export const createMessageSchema={
    body:Joi.object({
        userId:generalRules.id,
        content:Joi.string().min(1).required()
    }).required()
}

export const getMessageSchema={
    params:Joi.object({
        id:generalRules.id
    }).required()
}