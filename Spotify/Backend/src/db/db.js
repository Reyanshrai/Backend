import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db Connected");
  } catch (error) {
    console.error("Db error :", error);
  }
}

export default connectDB;
