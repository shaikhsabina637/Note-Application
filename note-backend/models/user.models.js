import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   firstName:{
        type:String,
        required:[true,"PLease enter the first name!"],
        // we can also print error message in maxLength and minLength
        maxLength:10,
        minLength:4,
        set:value => value.chartAt(0).toUpperCase()+value.slice(1).toLowerCase(),
        trim:true
   },
   lastName :{
       type:String,
       required:[true,"Please enter the last name!"],
       maxLength :10,
       minLength:4,
       set:value => value.chartAt(0).toUpperCase()+value.slice(1).toLowerCase(),
       trim:true
   },
   password :{
        type:String,
        required:[true,"PLease enter the password!"],
        maxLength:8 ,
        minLength:6,
        trim:true,
        match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/,
       "Password must contain uppercase, lowercase, number, and special character"],
        unique:true,
   },
   confirmPassword:{
        type:String,
        required:[true,"PLease enter the confirm password!"],
        trim :true,
        maxLength:8 ,
        minLength:6,
       match: [
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/,
       "Password must contain uppercase, lowercase, number, and special character"
     ],
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
        required:[true,"Please provide an image url"],
        trim :true,
          match: [
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
    "Please enter a valid image URL"
  ],

   },
   role:{
        type:String,
        required:[true,"Please select the role!"],
        enum:{
            values:["Admin","User"],
            message:"Role must be either Admin or User"
        },
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Note"
    }]
},{timestamps:true})

export default mongoose.model("User",userSchema)