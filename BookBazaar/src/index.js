import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRouter from "./Routes/Auth.router.js";

dotenv.config({
    path:"./.env"
})

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())


app.use("/api/v1/auth", UserRouter);

app.listen(port , ()=>{
    console.log(`Server started at port ${port}`)
})