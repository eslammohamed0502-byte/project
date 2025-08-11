import CheckConnection from "./DB/connectionDB.js";
import messageRouter from "./DB/modules/messages/message.controller.js";
import userRouter from "./DB/modules/users/user.controller.js";
import cors from "cors"
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const bootstrap = (app, express) => {

  
var whitelist = [process.env.FRONT_ORIGIN,undefined]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const limiter=rateLimit({
  windowMs:60*1000,
  max:5,
  message:{
    error:"Try Later"
  }
})
app.use(limiter)
app.use(helmet())
  app.use(cors(corsOptions))
  app.use(express.json());
  CheckConnection();
  app.use(morgan("dev"))
  app.use("/uploads",express.static("uploads"))
  app.use("/users", userRouter);
  app.use("/message",messageRouter)
 app.use((req, res, next) => {
  next(new Error(`404 Url Not Found ${req.originalUrl}`, { cause: 404 }));
});
  app.use((err, req, res, next) => {
 return res.status(err["cause"] || 500).json({
  message: err.message,
  stack: err.stack,
  error: err 
});
  });
};
export default bootstrap