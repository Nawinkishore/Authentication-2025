import express from 'express';
import {generateBill,getBills,getBillById,updateBill,deleteBillbyId,deleteAllBills,getCustomerBill,getCustomerBillByIdParams} from "../controllers/billController.js";
const router = express.Router();
// Bill Routes 
router.post('/generateBill' ,generateBill);
router.get('/getBills',getBills);
router.get('/getBillById/:id',getBillById);
router.put('/updateBill/:id',updateBill);
router.delete('/deleteBill/:id',deleteBillbyId);
router.delete('/deleteAllBills',deleteAllBills);

// Customer Routes
router.post('/getCustomerBill',getCustomerBill);
router.get('/getCustomerBillById/:id',getCustomerBillByIdParams);
export default router;