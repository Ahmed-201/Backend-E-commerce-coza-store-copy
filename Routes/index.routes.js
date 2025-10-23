import { Router } from "express";
import  {registerUser ,registerVendor, loginUser, forgotPassword, verifyOTP, resetPassword}  from "../controllers/user.controller.js";
import addCategory from "../controllers/categoryControllers/addCategory.js";
import addSubCategory from "../controllers/categoryControllers/addSubCategory.js";
import addChildCategory from "../controllers/categoryControllers/addChildCategory.js";

import upload from "../Utils/multerUploadImage.js";    //     multer middleware
import getAllCategories from "../controllers/categoryControllers/getAllCategories.js";
import getAllSubCategories from "../controllers/categoryControllers/getAllSubCategories.js";
import getAllChildCategories from "../controllers/categoryControllers/getAllChildCategories.js";


import {createProduct} from "../controllers/productControllers/createProduct.js";
import { getAllProducts } from "../controllers/productControllers/getAllProducts.js";
import { getProductById } from "../controllers/productControllers/getProductById.js";
import { orderController } from "../controllers/orderControllers/createOrderController.js";
import { getOrders } from "../controllers/orderControllers/getOrdersController.js";
import { getOrderById } from "../controllers/orderControllers/getOrderById.js";


const router = Router();

  // user auth routes
router.post("/user/register", registerUser);
router.post("/user/registerVendor", registerVendor);
router.post("/user/login", loginUser);
router.post("/user/forgotPassword", forgotPassword);
router.post("/user/verifyOTP",verifyOTP);
router.post("/user/resetPassword",resetPassword);


  // main category routes
router.post("/categories", addCategory);
router.get("/categories", getAllCategories);


    // sub category routes
router.post("/subCategories", addSubCategory);
router.get("/subCategories", getAllSubCategories);

    // child cartegories routes 
router.post("/childCategories", addChildCategory);
router.get("/childCategories", getAllChildCategories);

  // product routes
router.post("/createProduct"  , upload.array("productImages" , 5), createProduct)
router.get("/allProducts" , getAllProducts)
router.get("/productById" , getProductById)

  // order routes
  router.post("/createOrder", orderController)
  router.get("/getOrders", getOrders)   ////    with pagination ?page= 1 &limit= 10
  router.get("/getOrderById",getOrderById);




export default router;