import mongoose from "mongoose";

const subCategorySchema= new mongoose.Schema({

        name:{
            type:String,
            required:true,
            unique:true
        },
        categoryId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }



    },{timestamps:true})


export const SubCategory= mongoose.model('SubCategory',subCategorySchema);