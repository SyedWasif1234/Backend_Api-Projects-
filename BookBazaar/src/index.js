import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRouter from "./Routes/Auth.router.js";
import BookRouter from "./Routes/Book.router.js";
import OrderRouter from "./Routes/Order.router.js";

dotenv.config({
    path:"./.env"
})

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())


app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/books",BookRouter);
app.use("/api/v1/orders",OrderRouter);


app.listen(port , ()=>{
    console.log(`Server started at port ${port}`)
})