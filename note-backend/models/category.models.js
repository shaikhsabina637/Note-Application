import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    categoryName:{
        type:String,
        required:[true,"Please enter the category!"],
         enum: {
    values: ["Work", "Personal", "Study", "Others"],
    message: "Category must be one of: Work, Personal, Study, Others"
  }
}
},{
    timestamps:true
})
export default mongoose.model("Category",categorySchema)