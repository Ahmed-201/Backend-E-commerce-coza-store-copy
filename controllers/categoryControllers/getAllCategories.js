import { Category } from "../../Models/category.model.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    // console.log(categories,"categories")
    if (!categories) {
      return res.status(404).json({ message: "no categories found" });
    }
    res.status(200).json({ message: "categories found", data: categories });
  } catch (error) {
    console.log(error, "error in get categories");
  }
};

export default getAllCategories;
