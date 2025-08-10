import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
    },
   title:{
    type:String,
    required:[true,"Please enter the title!"],
    trim :true,
    set:value => value.charAt(0).toUpperCase()+value.slice(1).toLowerCase()
   },
   content :{
    type:String,
    required:[true,"Please enter the content!"],
    trim :true,
   },
   noteImage :{
    type:String,
    trim :true,
   },
   noteFile:{
    type:String,
    trim :true
   },
   category :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
   },
   status:{
    type:String,
    required :[true,"Please select the status!"],
    enum :{
        values:["Active","Archived","trash"],
        message:"Please Select the status of note"
    },
    default:"Active"
   },
   pinned:{
    type:Boolean,
    default:false
   }
},{timestamps:true})

module.exports = mongoose.model("Note",noteSchema)