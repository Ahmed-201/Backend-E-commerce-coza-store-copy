import { SubCategory } from "../../Models/subCategory.model.js";
import { Category } from "../../Models/category.model.js";

const addSubCategory = async (req, res) => {
  const { name, mainCategoryId } = req.body;
  console.log(mainCategoryId, "mainCategoryId");
  if (!name || !mainCategoryId) {
    return res.status(400).json({ message: "all feilds are required" });
  }

  try {
    const mainCategory = await Category.findById(mainCategoryId);
    console.log(mainCategory, "mainCategoryexist");


    if (!mainCategory) {
      return res.status(404).json({ message: "main category not found" });
    }

    const checkExisting = await SubCategory.findOne({ name });
    if (checkExisting) {
      return res.status(409).json({ message: "subCategory already exists" , status:409});
    }

    const subCategory = await SubCategory.create({ name });
    return res.status(201).json(subCategory);
  } catch (error) {
    console.log(error, "Subcategory error");
  }
};

export default addSubCategory;
