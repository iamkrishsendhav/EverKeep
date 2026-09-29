import express from "express";

import upload from "../middleware/upload.middleware.js";

import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
} from "../controllers/document.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();


// ============================================================================
// PROTECTED DOCUMENT ROUTES
// ============================================================================
//
// All document operations require a valid authenticated user.
//
// Authorization:
// Authorization: Bearer <JWT>
//
// authMiddleware:
// - verifies JWT
// - finds authenticated user
// - checks account status
// - attaches user to req.user
//
// File upload:
// upload.single("file") handles the uploaded document.
//
// ============================================================================


// ============================================================================
// UPLOAD DOCUMENT
// POST /api/documents
// ============================================================================
//
// Middleware order is intentional:
//
// authMiddleware
//      ↓
// upload.single("file")
//      ↓
// uploadDocument
//
// Authentication happens before file processing.
// ============================================================================

router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);


// ============================================================================
// GET ALL DOCUMENTS
// GET /api/documents
// ============================================================================

router.get(
    "/",
    authMiddleware,
    getDocuments
);


// ============================================================================
// GET SINGLE DOCUMENT
// GET /api/documents/:id
// ============================================================================

router.get(
    "/:id",
    authMiddleware,
    getDocument
);


// ============================================================================
// DELETE DOCUMENT
// DELETE /api/documents/:id
// ============================================================================

router.delete(
    "/:id",
    authMiddleware,
    deleteDocument
);


// ============================================================================
// EXPORT
// ============================================================================

export default router;