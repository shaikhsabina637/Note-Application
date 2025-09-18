import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   firstName:{
        type:String,
        required:[true,"PLease enter the first name!"],
        // we can also print error message in maxLength and minLength
        maxLength:10,
        minLength:4,
        set:value => value.charAt(0).toUpperCase()+value.slice(1).toLowerCase(),
        trim:true
   },
   lastName :{
       type:String,
       required:[true,"Please enter the last name!"],
       maxLength :10,
       minLength:4,
       set:value => value.charAt(0).toUpperCase()+value.slice(1).toLowerCase(),
       trim:true
   },
   password :{
        type:String,
        required:[true,"Please enter the password!"],
        trim:true,
         
        unique:true,
   },

   email:{
        type:String,
        required:[true,"Please enter the email!"],
        trim :true,
        unique:true,
        lowercase:true,
        match: [
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  "Please enter a valid email address"]
   },
    image:{
        type:String,
        trim :true,
        

   },
   role:{
        type:String,
        required:[true,"Please select the role!"],
        enum:{
            values:["Admin","User"],
            message:"Role must be either Admin or User"
        },
        default:"User"
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Note"
    }]
},{timestamps:true})

export default mongoose.model("User",userSchema)