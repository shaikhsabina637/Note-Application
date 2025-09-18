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
    set:value => value.charAt(0).toUpperCase()+ value.slice(1).toLowerCase()
   },
   content :{
    type:String,
    required:[true,"Please enter the content!"],
    trim :true,
   },
    status: {
    type: String,
    enum: ["active", "archived", "trash"],
    default: "active"
  },
   noteAttachment:[{
    type:String,
    trim :true
   }],
   category: {
  type: String,
  enum: ["Work", "Personal", "Study", "Others"],
  required: true
},
   isPinned:{
    type:Boolean,
    default:false
   }
},{timestamps:true})

export default mongoose.model("Note",noteSchema)