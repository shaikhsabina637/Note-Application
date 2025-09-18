import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
// load all the cloud detail from .env file
dotenv.config();

// configuration
export const cloudinaryConnect=()=>{
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key:process.env.CLOUD_API_KEY , 
            api_secret: process.env.CLOUD_SECRET
          });
    } catch (error) {
         console.log(error);
         console.log("error while connecting to cloudinary!")
    }
}



