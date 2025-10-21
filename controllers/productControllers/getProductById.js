
import { Product } from "../../Models/product.model.js";

export const getProductById = async (req, res) => {
  const { productId } = req.body;

  console.log(productId, "productId");

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  try {
    const product = await Product.findById({_id:productId}).exec();
    console.log(product, "product");
    res.status(200).json({data:product})
  } catch (error) {
    console.log(error, "fetch product by id error ");
  }
};
