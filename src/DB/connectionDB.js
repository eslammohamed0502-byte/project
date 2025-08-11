import mongoose from "mongoose";

const CheckConnection= async()=>{
    await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("success to connect to db");
    }).catch((error)=>{
        console.log("fail to connect to db",error);
    })


}
export default CheckConnection