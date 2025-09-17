// import { Category } from "../../Models/category.model.js";
import { SubCategory } from "../../Models/subCategory.model.js";

const getAllSubCategories = async (req, res) => {


    const{categoryId}=req.body;
    console.log(categoryId,"categoryId")
    if(!categoryId){
      return res.status(400).json({message :" category id is required"})
    }
  try {
    const subCategories = await SubCategory.find({categoryId}).exec();
    console.log(subCategories,"subCategories")
    if (!subCategories) {
      return res.status(404).json({ message: "no subCategories found" });
    }
    res.status(200).json({ message: "categories found", data: subCategories });
  } catch (error) {
    console.log(error, "error in get subCategories");
  }
};

export default getAllSubCategories;