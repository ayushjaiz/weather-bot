import express from "express";
import { updateApiKey, deleteSubscriber, getAllSubscribers } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

// Update API Key (Admin only)
router.patch("/api-key", authMiddleware, updateApiKey);

// Delete Subscriber (Admin only)
router.delete("/subscribers/:id", authMiddleware, deleteSubscriber);

router.get("/subscribers", authMiddleware, getAllSubscribers);

export default router;
