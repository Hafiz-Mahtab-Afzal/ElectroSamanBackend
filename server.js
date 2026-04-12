// install (1)
import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import products from './routes/products.routes.js'
import users from './routes/user.routes.js'
import adsRoute from './routes/ads.Routes.js'
import orders from './routes/order.routes.js'
import morgan from 'morgan'

 
import cors from 'cors'
// initialize (2)
const app = express()
// important apis 
app.use(express.json({ limit: "12mb" })) //allow incoming json data
app.use(morgan("dev"))
app.use(cors({
  origin: [
    "http://localhost",        
    "http://localhost:5173",
    "http://localhost:3000",
    "https://electro-saman-frontend.vercel.app",
    /https:\/\/electro-saman-frontend.*\.vercel\.app/
  ],
  credentials: true
}))
// testing apis (3)
app.get("/api/v1",(req,res) => {
  res.json("api is running")
})
// get our all routes (5)
app.use("/api/v1/products",products)
app.use("/api/v1/users",users)
app.use("/api/v1/orders",orders)
app.use("/api/v1",adsRoute)
// server start (4)
const port = process.env.PORT
app.listen(port,() => {
  console.log(`The server is running on port http://localhost:${port}/api/v1`)
})
// we connect dbconnect to our database (6)
import dbconnect from './database/dbconnect.js'
dbconnect()