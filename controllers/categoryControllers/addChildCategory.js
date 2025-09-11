import { SubCategory } from "../../Models/subCategory.model.js";
import { ChildCategory } from "../../Models/childCategory.model.js";

const addChildCategory = async (req, res) => {
  const { name, subCategoryId } = req.body;
  console.log(subCategoryId,name, "subCategoryId");
  if (!name || !subCategoryId) {
    return res.status(400).json({ message: "all feilds are required" });
  }

  try {
    const subCategoryExist = await SubCategory.findById(subCategoryId);
    console.log(subCategoryExist, "subCategoryExist");


    if (!subCategoryExist) {
      return res.status(404).json({ message: "sub category not founddd" });
    }

    const checkExisting = await ChildCategory.findOne({ name });
    if (checkExisting) {
      return res.status(409).json({ message: "ChildCategory already exists" , status:409});
    }

    const subCategory = await ChildCategory.create({ name });
    return res.status(201).json(subCategory);
  } catch (error) {
    console.log(error, "Subcategory error");
  }
};

export default addChildCategory;
