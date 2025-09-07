import { Router } from "express";
import  {registerUser ,registerVendor, loginUser, forgotPassword, verifyOTP, resetPassword}  from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/registerVendor", registerVendor);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP",verifyOTP);
router.post("/resetPassword",resetPassword);


export default router;