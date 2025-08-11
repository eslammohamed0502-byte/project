import { Router } from "express";
import * as MS from"./message.service.js"
import { validation } from "../../../middlewares/validation.js";
import * as MV from "../../../validations/message.validation.js";
import { authentication } from "../../../middlewares/authentication.js";

const messageRouter=Router({caseSensitive:true,strict:true,mergeParams:true})

messageRouter.post("/send",validation(MV.createMessageSchema),MS.createMessage)
messageRouter.get("/",MS.listMessage)
messageRouter.get("/:id",validation(MV.getMessageSchema),authentication(),MS.getOneMessage)

export default messageRouter