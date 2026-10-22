import express from "express";

import {
    register,
    login,
    requestEmailVerification,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================================================
// AUTH ROUTES
// ============================================================================

// REGISTER
// POST /api/auth/register

router.post("/register", register);

// LOGIN
// POST /api/auth/login

router.post("/login", login);

router.post("/email/verification/request", authMiddleware, requestEmailVerification);
router.post("/email/verify", verifyEmail);
router.post("/password/forgot", requestPasswordReset);
router.post("/password/reset", resetPassword);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
