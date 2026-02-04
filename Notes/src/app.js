import express from "express"
import noteModel from "./models/notes.model.js"

const app = express()
app.use(express.json())


app.post('/notes',  async (req,res)=>{

    const {title , description} = req.body
    
    await noteModel.create({
        title : title,
        description : description
    })

    res.status(201).json({
        message:"Note Created"
    })
})

app.get("/notes",async (req,res)=>{

    const notes = await noteModel.find() // find always return an array [{}] , findOne {} or null
    res.status(200).json({
        message: "Notes fetched succesfully",
        notes : notes
    })
})

app.delete("/notes/:id",async (req,res)=>{
    const {id} = req.params

    const notes = await noteModel.findOneAndDelete(id)

    res.status(200).json({
        message : "Note Deleted Succesfully",
    })
})

app.patch("/notes/:id", async (req,res)=>{
    const {id} = req.params
    const {description} = req.body

    await noteModel.findOneAndUpdate({   // findOneUpdate takes 2 object first is based on find and second is based on update 
        _id:id
    },{
        description:description
    })

    res.status(200).json({
        message : "Note update Succesfully"
    })
})
export default app