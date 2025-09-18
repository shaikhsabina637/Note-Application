import express from "express"
import dotenv from "dotenv"
import { databaseConnection } from "./db/databaseConnection.js"
import authRoutes from "./routes/auth.route.js"
import noteRoutes from "./routes/note.route.js"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import cors from "cors"
import { cloudinaryConnect } from "./utils/cloudinary/cloudinary.js"

// initilaize the express application object
cloudinaryConnect()
const app = express()
// load the env variable from .env to process.env
dotenv.config()
// built-in middleware that parse the incoming request with json payload
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["https://note-application-easy-to-handle.vercel.app"],
    credentials:true
}))
//  express-fileupload middleware file ko temporary folder me save karta hai aur uski information req.files me daal deta hai.
app.use(fileUpload({
  useTempFiles: true,       // temp file banata hai
  tempFileDir: "/tmp/"      // temp file ka folder
}));
// define the port
const PORT = process.env.PORT || 4000
// home route
app.get("/",(req,res)=>{
      res.send("hello this is home route")
})
// importing routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/note",noteRoutes);
// calling db function
databaseConnection()
// activate the server with this port
app.listen(PORT,()=>{
    console.log(`server is running on port no ${PORT}`)
})
