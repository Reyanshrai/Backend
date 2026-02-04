import mongoose, { mongo } from "mongoose"

async function connectDB(){

    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Db connected")
}

export default connectDB