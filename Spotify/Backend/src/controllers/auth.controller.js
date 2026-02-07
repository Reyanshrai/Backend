import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function registerUser(req,res){
    try{

        const {username , email , password , role = "user"} = req.body

        const isUserAlreadyExists = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })

        if(isUserAlreadyExists){
            res.status(409).json({
                message:"User already exists"
            })
        }

        const hash = await bcrypt.hash(password,10)

        const user = await userModel.create({
            username,
            email,
            password : hash,
            role
        })

        const token = jwt.sign({
            id:user._id,
            role: user.role
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(201).json({
            message : "User registred successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                role : user.role
            }
        })
        


    }catch(err){
        console.error("User not created",err)
    }
}

export async function loginUser(req,res){
    try{

        const {username, email , password} = req.body

        const user = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })

        if(!user){
            return res.status(401).json({message : "Invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({message : "Invalid credentials"})

        }

        const token = jwt.sign({
            id : user._id,
            role : user.role,
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(200).json({
            message : "Login Succesfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                role : user.role
            }
        })


    }catch(err){
        console.error("User not created",err)

    }
}

export async function logout(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message : 'Logout succesfully'
    })
}