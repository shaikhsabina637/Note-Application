import express from "express"
import dotenv from "dotenv"
import { databaseConnection } from "./db/databaseConnection.js"
// initilaize the express application object
const app = express()
// load the env variable from .env to process.env
dotenv.config()
// built-in middleware that parse the incoming request with json payload
app.use(express.json())
// define the port
const PORT = process.env.PORT || 4000
// home route
app.get("/",(req,res)=>{
      res.send("hello this is home route")
})
// calling db function
databaseConnection()
// activate the server with this port
app.listen(PORT,()=>{
    console.log(`server is running on port no ${PORT}`)
})
