import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const imageUpload = async (req, res) => {
const imageUpload = async (files) => {
  // console.log(req.files, "local file path after multer");
  console.log(files, "local file path after multer");
  
  if (!files) {
    return ;
  }

  try {
    // Upload all files to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "e-commerce-coza-store-cloning",
      });

      // Try deleting local file safely
      try {
        await fs.promises.unlink(file.path);
        console.log("Deleted local file:", file.path);
      } catch (err) {
        console.warn("Failed to delete local file:", file.path, err.message);
      }

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;

  } catch (err) {
    console.error("Error uploading file in imageUploader:", err);
  }
};

export default imageUpload;
