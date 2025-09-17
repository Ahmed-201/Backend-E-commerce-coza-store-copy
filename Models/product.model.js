import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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
    childCaqtegory: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"childCategory",
      required: true,
    },

    thumbnail: {
      type: String, // Single main image
      required: true,
    },
    images: [
      {
        type: String, // Remaining gallery images
      },
    ],
  },
  { timestamps: true }
);


export const Product = mongoose.model("Product", productSchema);