import {db} from "../lib/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const  RegisterUser = async (req, res) => {

    try {

        const {name, email, password , role} = req.body
  
        if(!name || !email || !password || !role){
        console.log("Data is missing");
        return res.status(400).json({
            success: false,
            message: "All fields are required"
          })
        }

        const existingUser = await db.User.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
        return res.status(400).json({
          success: false,
          message: "User already exists",
         });
        }

        const Hashed_Password = await bcrypt.hash(password , 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const new_user = await db.User.create({
            data:{
                name ,
                email,
                password:Hashed_Password,
                role,
                verificationToken
            }
        })

        console.log(new_user)
        res.status(200).json({
            message:"user created Succefully",
            success:true ,
            new_user
        })


    } catch (error) {
        console.log("error occured while creating new user", error)
        res.status(200).json({
            message:"error occured while creating new user",
            success:false ,
            error
        })

    }
}

export const  LoginUser = async (req, res) => {

   try {
     const {email , password} = req.body;
 
     if(!email || !password){
         console.log("email  or passworf is missing");
         return res.status(500).json({
             message:"all fields are required"
         })
     }
 
     const user = await db.User.findUnique({
         where:{email}
     })
 
     if(!user){
         console.log("no user found")
          return res.status(404).json({
             message:"no user found"
         })
     }
 
     const isMatch = await bcrypt.compare(password , user.password)
     if(!isMatch){
         console.log("Incorrect password")
         return res.status(400).json({
             message:"Incorrect password"
         })
     }
 
     const token =  jwt.sign({id:user.id}, process.env.JWT_SECRET , {expiresIn:"7d"});
 
     res.cookie("jwt" , token , {
         httpOnly : true,
         secure : process.env.NODE_ENV !== "development",
         sameSite : "strict",
         maxAge : 1000 * 60 * 60 * 24 * 7
     })
 
     res.status(200).json({
         success:true ,
         message: "user logged in successfully",
         user:{
             id:user.id ,
             name:user.name ,
             email:user.email,
             role:user.role
           }
        })
   } catch (error) {
        console.log("error occured while loging in user", error)
        res.status(500).json({
            message:"error occured while loging in   user",
            success:false ,
            error
        })
   }
}

export const  Generate_Api_key = (req, res) => {
    
}