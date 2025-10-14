import { Category } from "../../Models/category.model.js";
import { ChildCategory } from "../../Models/childCategory.model.js";
import { Product } from "../../Models/product.model.js";
import { SubCategory } from "../../Models/subCategory.model.js";
import { User } from "../../Models/user.model.js";
import imageUpload from "../uploader.js";

export const createProduct = async (req, res) => {
  const {
    userId,
    name,
    description,
    price,
    inStock,
    quantity,
    category,
    subCategory,
    childCategory,
  } = req.body;
  console.log(userId, name, req.files, "userId");

  if (
    !userId ||
    !name ||
    !description ||
    !price ||
    !quantity ||
    !category ||
    !subCategory ||
    !childCategory ||
    !inStock
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "product images are required" });
  }
            // validation for existing user 
  const userExists = await User.findById(userId).select("_id");
  if (!userExists) {
    return res.status(404).json({ message: "user not found" });
  }

            // Validate for existing category references
  const [categoryExists, subCategoryExists, childCategoryExists] =
    await Promise.all([
      Category.exists({ _id: category }),
      SubCategory.exists({ _id: subCategory }),
      ChildCategory.exists({ _id: childCategory }),
    ]);

  if (!categoryExists || !subCategoryExists || !childCategoryExists) {
    return res
      .status(400)
      .json({ message: "Invalid category or subcategory reference" });
  }

  try {
            // Upload images and get their URLs
    const uploadedImagesResultOnCloudinary = await imageUpload(req.files);
    // console.log(uploadedImagesResultOnCloudinary, "uploadedImagesResult");
    if (!uploadedImagesResultOnCloudinary) {
      return res.status(500).json({ message: "error uploading images" });
    }

    const productData = {
      userId,
      name,
      description,
      price,
      inStock,
      quantity,
      category,
      subCategory,
      childCategory,
      productImages: uploadedImagesResultOnCloudinary,
    };
        // Save product to the DB
    const savedProduct = await new Product(productData).save();
    console.log("Product created successfully:", savedProduct);

    res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    console.log(error, "error uploading images");
  }
};
