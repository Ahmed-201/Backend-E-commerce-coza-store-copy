import mongoose from "mongoose";


const childCategorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },
    subCategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubCategory",
    }

},{timestamps:true})

export const ChildCategory= mongoose.model('ChildCategory',childCategorySchema);