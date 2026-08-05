import express from "express";

import upload from "../middleware/upload.middleware.js";

import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

// Upload Document
router.post(
    "/",
    upload.single("file"),
    uploadDocument
);

// Get All Documents
router.get(
    "/",
    getDocuments
);

// Get Single Document
router.get(
    "/:id",
    getDocument
);

// Delete Document
router.delete(
    "/:id",
    deleteDocument
);

export default router;