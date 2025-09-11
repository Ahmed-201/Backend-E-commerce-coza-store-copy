import { Router } from "express";
import  {registerUser ,registerVendor, loginUser, forgotPassword, verifyOTP, resetPassword}  from "../controllers/user.controller.js";
import addCategory from "../controllers/categoryControllers/addCategory.js";
import addSubCategory from "../controllers/categoryControllers/addSubCategory.js";
import addChildCategory from "../controllers/categoryControllers/addChildCategory.js";

import imageUpload from "../controllers/uploader.js";
import upload from "../Utils/multerUploadImage.js";    //     multer middleware


const router = Router();

router.post("/user/register", registerUser);
router.post("/user/registerVendor", registerVendor);
router.post("/user/login", loginUser);
router.post("/user/forgotPassword", forgotPassword);
router.post("/user/verifyOTP",verifyOTP);
router.post("/user/resetPassword",resetPassword);



router.post("/categories", addCategory);
router.post("/subCategories", addSubCategory);
router.post("/childCategories", addChildCategory);


router.post("/imageUploads"  , upload.single("file"), imageUpload)

export default router;