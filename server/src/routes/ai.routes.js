import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    chatWithAI,
} from "../controllers/ai.controller.js";


const router = express.Router();


// ============================================================================
// AI CHAT
// ============================================================================
//
// POST /api/ai/chat
//
// Authentication required.
//
// Request:
// Authorization: Bearer <JWT>
//
// Body:
// {
//     "message": "Mere assets kitne hain?"
// }
//
// ============================================================================

router.post(
    "/chat",
    authMiddleware,
    chatWithAI
);


export default router;