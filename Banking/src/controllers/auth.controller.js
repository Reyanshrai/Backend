import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import {sendRegistrationEmail} from "../services/email.service.js"


/** 
 * - user register controller
 * - POST /api/auth/register
 * 
*/

export const userRegisterController = async (req,res)=>{

    const {email,name,password} = req.body

    const isUserExists = await userModel.findOne({
        email : email
    })

    if(isUserExists){
        return res.status(422).json({
            message : "User Already Exists",
            status : "failed"
        })
    }


    const user = await userModel.create({
        email,
        name,
        password 
    })

    const token = jwt.sign({
        userId : user._id
    },process.env.JWT_SECRET,{expiresIn : "3d"})

    res.cookie("token",token)

    res.status(201).json({
        message : "User created Successfully",
        status : "Success",
        user : {
            _id : user._id,
            email: user.email,
            name : user.name 
        },
        token
    })

    await sendRegistrationEmail(user.email,user.name)

}


/** 
 * - user Login controller
 * - POST /api/auth/login
 * 
*/

export const userLoginController = async (req,res) =>{
    const {email,password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message : "Email or Password is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message : "Email or Password is invalid"
        })
    }

    const token = jwt.sign({
        userId : user._id
    },process.env.JWT_SECRET,{expiresIn : "3d"})

    res.cookie("token",token)

    res.status(200).json({
        message : "User Login Successfully",
        status : "Success",
        user : {
            _id : user._id,
            email: user.email,
            name : user.name 
        },
        token
    })

}

