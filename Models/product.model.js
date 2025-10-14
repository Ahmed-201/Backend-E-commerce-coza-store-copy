import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },   // Cloudinary / AWS S3 URL
});

const productSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"subCategory",
      required: true,
    },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"childCategory",
      required: true,
    },
    productImages: [imageSchema],
  },
  { timestamps: true }
);


export const Product = mongoose.model("Product", productSchema);