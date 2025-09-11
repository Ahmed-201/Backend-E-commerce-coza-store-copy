
import  {Category}  from "../../Models/category.model.js";

const addCategory = async(req,res)=>{


  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const checkExisting = await Category.findOne({ name });
    if (checkExisting) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    console.log(error, "category error");
  }


}


export default addCategory;