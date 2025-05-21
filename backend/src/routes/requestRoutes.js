import express from "express";
import {
    createRequest,
    getPendingRequests,
    updateRequestStatus,
    getUserRequests
} from "../controllers/requestController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(["Employee", "Admin", "Manager"]), createRequest); // Allow all roles to create for testing, or restrict to Employee
router.get("/my-requests", authenticateToken, authorizeRole(["Employee", "Admin", "Manager"]), getUserRequests); 
router.get("/pending", authenticateToken, authorizeRole(["Manager", "Admin"]), getPendingRequests);
router.patch("/:id", authenticateToken, authorizeRole(["Manager", "Admin"]), updateRequestStatus);

export default router;
