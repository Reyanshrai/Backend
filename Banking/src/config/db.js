import mongoose, { mongo } from "mongoose";


const  connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Db connected")
    }catch(err){
        console.log("Db is not connected",err)
    }
}

export default connectDB