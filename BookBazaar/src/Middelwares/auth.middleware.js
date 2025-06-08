import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";

export const authMiddelware = async (req, res , next) => {
    try {

        const token = req.cookies.jwt;
        if(!token){
            console.log("user is not logedIn");
            return res.status(500).json({message:"Unauthorised"})
        }

        const Decode_Token = jwt.verify(token , process.env.JWT_SECRET)
        console.log("Decoded token :" , Decode_Token);

        const user = await db.User.findUnique({
            where:{id:Decode_Token.id},
            select:{
                id : true ,
                name : true ,
                email: true ,
                role: true
            }
        })

        if(!user){
            return res.status(500).json({message:"Unauthorised"})
        }

        req.user = user ;
        next();
        
    } catch (error) {
        console.log("error occured in auth middleware",error);
        res.status(500).json({message:"error occured in auth middleware"} , error)
    }
}

export const apiKeyAuthMiddleware  = async (req, res , next) => {
    try {
        
        const apiKey = req.headers['x-api-key'];
        if(!apiKey){
            res.status(401).json({message:"Api Key is missing"})
        }

        const keyRecord = await db.ApiKey.findUnique({
            where: { key: apiKey },
            include: { user: true },
        }); 

        if(!keyRecord || !keyRecord.isActive){
            return res.status(403).json({ message: "Invalid or inactive API key" });
        }

        if(keyRecord.role === "BLOCKED"){
            return res.status(403).json({ message: "his API key has been blocked" });
        } 

         req.apiKeyRole = keyRecord.role;

        next()

    } catch (error) {
        console.log("error occured in api key middleware" , error);
        return res.status(500).json({message:"error occured in api key middleware"},error)
    }
}

export const checkAdmin = async(req , res , next) => { 

    if(req.user.role === "ADMIN") {
        next()
    } else {
        res.status(403).json({message : "You are not authorized to perform this action"})
    }
}