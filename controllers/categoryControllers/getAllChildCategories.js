// import { Category } from "../../Models/category.model.js";
import { SubCategory } from "../../Models/subCategory.model.js";
import { ChildCategory } from "../../Models/childCategory.model.js";

const getAllChildCategories = async (req, res) => {


    const{subCategoryId}=req.body;
    console.log(subCategoryId,"subCategoryId")
    if(!subCategoryId){
      return res.status(400).json({message :" subCategory id is required"})
    }
  try {
    const childCategories = await ChildCategory.find({subCategoryId}).exec();
    console.log(childCategories,"childCategories")
    if (!childCategories) {
      return res.status(404).json({ message: "no childCategories found" });
    }
    res.status(200).json({ message: "categories found", data: childCategories });
  } catch (error) {
    console.log(error, "error in get childCategories");
  }
};

export default getAllChildCategories;