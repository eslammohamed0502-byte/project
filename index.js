import path from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve("src/config/.env")})
import express from 'express'
import bootstarb from './src/app.controller.js'
import { nanoid } from "nanoid"
const app = express()
const port =process.env.PORT ||5000

bootstarb(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))