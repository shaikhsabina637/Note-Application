import mongoose from "mongoose";
import dotenv from "dotenv"
// loads the nev variable into the process.env object
dotenv.config()
export const databaseConnection = async()=>{
        try{
        // mongoose.connect method to connect with database
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected!")
        }catch(error){
           console.log("error while connecting to database")
           console.error(error.message)
        }
}