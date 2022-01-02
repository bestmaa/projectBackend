import cookieParser from "cookie-parser"
import express from "express"
import errorMiddleware from "./middleware/error.js"
import orderRouter from "./routes/orderRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import userRouter from "./routes/userRoute.js"
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'
import cors from 'cors'

const app=express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileupload())
app.use("/api/v1",ProductRoute)
app.use("/api/v1",userRouter)
app.use("/api/v1",orderRouter)
//Middleware for Error
app.use(errorMiddleware)


export default app