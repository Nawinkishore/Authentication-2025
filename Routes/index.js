import express from "express";
import authRoutes from "./authRoutes.js";
import billRoutes from "./billRoutes.js";
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/bill", billRoutes);
export default router;