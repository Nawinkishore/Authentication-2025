import express from 'express';
import {generateBill} from "../controllers/billController.js";
const router = express.Router();
// Bill Routes 
router.post('/generateBill' ,generateBill);
export default router;