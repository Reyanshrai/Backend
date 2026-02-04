import mongoose, { mongo } from "mongoose"

const postSchems = new mongoose.Schema({
    image : String,
    caption : String,
})

const postModel = mongoose.model("post",postSchems)

export default postModel