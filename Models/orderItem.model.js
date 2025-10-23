import mongoose from "mongoose";


 const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"product",
        required: true
    },
    productName:{
        type:String,
        required:true
    },
    productImage:{
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required: true,
        max: 5,
        min: 1
    },
    price:{
        type:Number,
        required:true,
        min:1,
        max:100000     // user cant order product more than 100000 price
    },
    size:{
        type:String,   
    },
    color:{
        type:String,
    }




}, { timestamps: true })


export const orderItem = mongoose.model("orderitem", orderItemSchema)