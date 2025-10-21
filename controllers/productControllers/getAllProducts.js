import { Product } from "../../Models/product.model.js";


export const getAllProducts = async (req,res) => {

        try {
            
            const products = await Product.find();

            console.log(products,"productsssssss")

            res.status(200).json({message : "Products fetched successfully", products:products});

        } catch (error) {

            console.log(error,"error fetching products")
            
        }

}