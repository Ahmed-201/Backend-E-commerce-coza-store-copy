import mongoose from "mongoose";
import { Product } from "../../Models/product.model.js";

export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
 // Check if ID is not a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "id invalid" });
  }

  const productExists = await Product.findById(productId)

  if(!productExists){
    return res.status(404).json({message:"product not found"})
  }

  const {
    name,
    description,
    price,
    categoryId,
    subCategoryId,
    childCategoryId,
    inStock,
    quantity,
  } = req.body;

  if (
    name === "" ||
    description === "" ||
    price === "" ||
    categoryId === "" ||
    subCategoryId === "" ||
    childCategoryId === "" ||
    inStock === "" ||
    quantity === ""
    
  ) {
    return res
      .status(400)
      .json({ message: "feilds to updated cannot be empty" });
  }
  // ✅ Validate all 3 IDs properly
  if (
    !mongoose.Types.ObjectId.isValid(categoryId) ||
    !mongoose.Types.ObjectId.isValid(subCategoryId) ||
    !mongoose.Types.ObjectId.isValid(childCategoryId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid category or subcategory ID(s)" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        name: name,
        description: description,
        price: price,
        category: categoryId,
        subCategory: subCategoryId,
        childCategory: childCategoryId,
        inStock: inStock,
        quantity: quantity,
      },
    },
    { new: true } //   ye updated document return karega
  );

  res.status(200).json({ mesage: "working fine", updatedProduct });
};
