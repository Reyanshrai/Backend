import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs"
import { use } from "react";

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : [true, "Email is required for creating a user"],
        trim : true,
        lowercase : true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid Email Id"],
        unique : [true,"Email Already exists"]
    },
    name:{
        type : String,
        required : [true,"Name is required for creating a user"],

    },
    password : {
        type: String,
        required : [true,"Password is required for creating a user"],
        minlength : [6,"Password should contian more than 6 "],
        select : false,

    }
},{
    timestamps : true
})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        return next()
    }

    const hashed = await bcrypt.hash(this.password,10)
    this.password = hash

    return next()
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("user",userSchema)

export default userModel