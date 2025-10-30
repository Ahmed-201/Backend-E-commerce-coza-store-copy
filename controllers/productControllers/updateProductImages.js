import { Product } from "../../Models/product.model.js";
import imageUpload from "../uploader.js";

export const updateProductImages = async (req, res) => {

  const productId = req.params.productId;

  var existingImageUrls = req.body.existingimageUrls;
  let updatedImageUrls = []; ////   Initialize an empty array to hold updated image URLs = existing + new uploads

  // ✅ 1. Add existing image URLs (if any)
  // Normalize single values into array bcz if single image url is sent then wo string ki form m ayega na ki array ki form m
  if (existingImageUrls && !Array.isArray(existingImageUrls)) {

    existingImageUrls = [existingImageUrls]; ///   here is the conversion into array
    updatedImageUrls.push(...existingImageUrls);

  } else if (Array.isArray(existingImageUrls)) {
    //  if it's already an array
    updatedImageUrls.push(...existingImageUrls);

  } else {
    updatedImageUrls = [];
  }

  // console.log(updatedImageUrls, "updatedImageUrls after existing urls");

  // ✅ 2. Upload new image files (if any)
  if (req.files && req.files.length > 0) {
    for (const files of req.files) {
      
      const uploadedImagesResultOnCloudinary = await imageUpload([files]);

      if (!uploadedImagesResultOnCloudinary) {
        return res.status(500).json({ message: "Error uploading images" });
      }
      // uploadedImagesResultOnCloudinary ye ek array hai jisme ek object hai es wajah sy nechy line m [0] use kiya hai us object ko lene k liay
      updatedImageUrls.push(uploadedImagesResultOnCloudinary[0].url);
    }
  }
  // Wrap each URL in an object matching imageSchema
  const formattedImages = updatedImageUrls.map(function (url) {
    // yahan har element (string) ko variable "url" mil raha hai
    // hum return kar rahe hain ek naya object jisme key hai "url"
    // aur value hai variable url ki value

    return {
      url: url,
    };
  });

  // console.log(formattedImages, "formattedImages");
  if (formattedImages.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one product image is required" });
  }

  const productImagesUpdatedResponse = await Product.findByIdAndUpdate(
    productId,
    { productImages: formattedImages },
    { new: true }
  );

  if (!productImagesUpdatedResponse) {
    return res
      .status(404)
      .json({ message: "error updating product images check productId" });
  }

  return res
    .status(200)
    .json({ message: "update product images", productImagesUpdatedResponse });
};
