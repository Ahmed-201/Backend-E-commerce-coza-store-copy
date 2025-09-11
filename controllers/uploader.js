import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUpload = async (req, res) => {
  console.log(req.file, "local file path after multer");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "e-commerce-coza-store-cloning",
    });

    console.log(result, "cloudinary result after upload");
    if (result) {
      const filePath = path.resolve(req.file.path); // normalize path

      fs.unlinkSync(filePath); // delete file
      console.log("File deleted:", filePath);

      res.json({
        message: "File uploaded successfully!",
        url: result.secure_url, // cloudinary image url
        public_id: result.public_id,
      });
    }
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

export default imageUpload;
