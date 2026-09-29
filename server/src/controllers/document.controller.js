import mongoose from "mongoose";

import Document from "../models/Document.js";
import Asset from "../models/Asset.js";

import cloudinary from "../config/cloudinary.js";


// ============================================================================
// DOCUMENT CONTROLLER
// ============================================================================
//
// Authentication:
// authMiddleware runs before these controllers.
//
// Ownership:
// Every document belongs to req.user._id.
//
// Asset relationship:
// If a document is linked to an asset, that asset must also belong
// to the authenticated user.
//
// ============================================================================


// ============================================================================
// HELPER — GET USER ID
// ============================================================================

const getUserId = (req) => {

    return (
        req.user?._id ||
        req.user?.id ||
        null
    );

};


// ============================================================================
// HELPER - CLEAN UP UPLOADED CLOUDINARY FILE
// ============================================================================

const cleanupUploadedFile = async (file) => {

    const publicId =
        file?.filename ||
        file?.public_id;


    if (!publicId) {
        return;
    }


    try {

        await cloudinary.uploader.destroy(

            publicId,

            {
                resource_type:
                    file.mimetype === "application/pdf" ||
                    file.mimetype === "application/msword" ||
                    file.mimetype ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ? "raw"
                        : "image",
            }

        );

    } catch (cloudinaryError) {

        console.error(
            "Cloudinary cleanup error:",
            cloudinaryError
        );

    }

};


// ============================================================================
// UPLOAD DOCUMENT
// POST /api/documents
// ============================================================================

export const uploadDocument = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);


        // =====================================================================
        // AUTHENTICATION
        // =====================================================================

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required.",

            });

        }


        // =====================================================================
        // FILE VALIDATION
        // =====================================================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload a file.",

            });

        }


        // =====================================================================
        // OPTIONAL ASSET VALIDATION
        // =====================================================================

        let assetId = null;


        if (req.body.asset) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    req.body.asset
                )
            ) {

                await cleanupUploadedFile(req.file);

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid asset ID.",

                });

            }


            const asset =
                await Asset.findOne({

                    _id:
                        req.body.asset,

                    owner:
                        userId,

                });


            if (!asset) {

                await cleanupUploadedFile(req.file);

                return res.status(404).json({

                    success: false,

                    message:
                        "Selected asset was not found.",

                });

            }


            assetId =
                asset._id;

        }


        // =====================================================================
        // CREATE DOCUMENT
        // =====================================================================

        const document =
            await Document.create({

                name:
                    req.body.name?.trim() ||
                    req.file.originalname,

                originalName:
                    req.file.originalname,

                fileUrl:
                    req.file.path,

                publicId:
                    req.file.filename ||
                    req.file.public_id,

                fileType:
                    req.file.mimetype,

                fileSize:
                    req.file.size,

                category:
                    req.body.category ||
                    "Other",

                asset:
                    assetId,

                owner:
                    userId,

            });


        // =====================================================================
        // RESPONSE
        // =====================================================================

        return res.status(201).json({

            success: true,

            message:
                "Document uploaded successfully.",

            data:
                document,

        });

    } catch (error) {

        console.error(
            "Upload document error:",
            error
        );

        await cleanupUploadedFile(req.file);


        return res.status(400).json({

            success: false,

            message:
                error.message ||
                "Unable to upload document.",

        });

    }

};


// ============================================================================
// GET ALL DOCUMENTS
// GET /api/documents
// ============================================================================

export const getDocuments = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required.",

            });

        }


        const documents =
            await Document
                .find({
                    owner: userId,
                })
                .populate(
                    "asset",
                    "name brand category"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                documents.length,

            data:
                documents,

        });

    } catch (error) {

        console.error(
            "Get documents error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load documents.",

        });

    }

};


// ============================================================================
// GET SINGLE DOCUMENT
// GET /api/documents/:id
// ============================================================================

export const getDocument = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required.",

            });

        }


        const {
            id,
        } = req.params;


        // =====================================================================
        // VALIDATE DOCUMENT ID
        // =====================================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid document ID.",

            });

        }


        // =====================================================================
        // GET ONLY CURRENT USER'S DOCUMENT
        // =====================================================================

        const document =
            await Document
                .findOne({

                    _id:
                        id,

                    owner:
                        userId,

                })
                .populate(
                    "asset",
                    "name brand category"
                );


        if (!document) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found.",

            });

        }


        return res.status(200).json({

            success: true,

            data:
                document,

        });

    } catch (error) {

        console.error(
            "Get document error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load document.",

        });

    }

};


// ============================================================================
// DELETE DOCUMENT
// DELETE /api/documents/:id
// ============================================================================

export const deleteDocument = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required.",

            });

        }


        const {
            id,
        } = req.params;


        // =====================================================================
        // VALIDATE DOCUMENT ID
        // =====================================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid document ID.",

            });

        }


        // =====================================================================
        // FIND ONLY USER'S DOCUMENT
        // =====================================================================

        const document =
            await Document.findOne({

                _id:
                    id,

                owner:
                    userId,

            });


        if (!document) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found.",

            });

        }


        // =====================================================================
        // DELETE FROM CLOUDINARY
        // =====================================================================

        if (document.publicId) {

            try {

                await cloudinary.uploader.destroy(

                    document.publicId,

                    {
                        resource_type:
                            document.fileType ===
                            "application/pdf" ||
                            document.fileType ===
                            "application/msword" ||
                            document.fileType ===
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                ? "raw"
                                : "image",
                    }

                );

            } catch (cloudinaryError) {

                console.error(
                    "Cloudinary delete error:",
                    cloudinaryError
                );

            }

        }


        // =====================================================================
        // DELETE DATABASE RECORD
        // =====================================================================

        await document.deleteOne();


        // =====================================================================
        // RESPONSE
        // =====================================================================

        return res.status(200).json({

            success: true,

            message:
                "Document deleted successfully.",

        });

    } catch (error) {

        console.error(
            "Delete document error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete document.",

        });

    }

};
