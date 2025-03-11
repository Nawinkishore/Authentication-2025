import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import protectRoute from "../Middlewares/protectRoute.js";
import {generateBill} from "../controllers/billController.js";
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/me', protectRoute('admin'), getMe);

// router.post('/sendverifyotp', protectRoute('admin'), authController.sendVerifyOtp);
// router.post('/verifyotp', protectRoute('admin'), authController.verifyOtp);

// Bill Routes 

router.post('/generateBill' ,generateBill);
export default router;

// Add service
// Service price