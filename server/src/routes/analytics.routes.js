
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAnalyticsOverview } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/overview", authMiddleware, getAnalyticsOverview);

export default router;
