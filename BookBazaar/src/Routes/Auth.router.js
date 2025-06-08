import { Router } from "express";
import { LoginUser, RegisterUser } from "../Controllers/Auth.controller.js";

const router = Router();


router.post("/Signup" , RegisterUser);
router.get("/SignIn" , LoginUser);


export default router