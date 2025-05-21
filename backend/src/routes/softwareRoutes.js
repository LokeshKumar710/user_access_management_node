import express from "express";
import { createSoftware, getAllSoftware } from "../controllers/softwareController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(["Admin"]), createSoftware);
router.get("/", authenticateToken, getAllSoftware);

export default router;
