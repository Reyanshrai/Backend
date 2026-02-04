import express from "express"
import multer from "multer"
import uploadFile from "./services/storage.service.js"
import postModel from "./models/post.model.js"


const app = express()
app.use(express.json())

const upload = multer({storage:multer.memoryStorage()})


app.post("/create-post",upload.single("image"),async (req,res)=>{

    const result = await uploadFile(req.file.buffer)

    const post = await postModel.create({
        image : result.url,
        caption : req.body.caption
    })

    return res.status(201).json({
        message : "Post created Successfully",
        post
    })
})

app.get("/posts",async (req,res) =>{

    const posts = await postModel.find()

    res.status(200).json({
        message : "Feed fetched successfully",
        posts
    })
})


export default app