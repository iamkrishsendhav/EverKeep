import Document from "../models/Document.js";
import cloudinary from "../config/cloudinary.js";

// ----------------------------------------
// Create Document
// POST /api/documents
// ----------------------------------------

export const uploadDocument = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload a file.",
            });

        }

        console.log(req.file);

const document = await Document.create({

    name: req.body.name || req.file.originalname,

    originalName: req.file.originalname,

    fileUrl: req.file.path,

    publicId: req.file.filename || req.file.public_id,

    fileType: req.file.mimetype,

    fileSize: req.file.size,

    category: req.body.category,

    asset: req.body.asset || null,

});

        res.status(201).json({

            success: true,

            message:
                "Document uploaded successfully.",

            data: document,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ----------------------------------------
// Get All Documents
// GET /api/documents
// ----------------------------------------

export const getDocuments = async (req, res) => {

    try {

        const documents = await Document.find()

            .populate("asset")

            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: documents.length,

            data: documents,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ----------------------------------------
// Get Single Document
// GET /api/documents/:id
// ----------------------------------------

export const getDocument = async (req, res) => {

    try {

        const document = await Document.findById(req.params.id)

            .populate("asset");

        if (!document) {

            return res.status(404).json({

                success: false,

                message: "Document not found.",

            });

        }

        res.status(200).json({

            success: true,

            data: document,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ----------------------------------------
// Delete Document
// DELETE /api/documents/:id
// ----------------------------------------

export const deleteDocument = async (req, res) => {

    try {

        const document = await Document.findById(req.params.id);

        if (!document) {

            return res.status(404).json({

                success: false,

                message: "Document not found.",

            });

        }

       await cloudinary.uploader.destroy(
    document.publicId,
    {
        resource_type:
            document.fileType === "application/pdf"
                ? "raw"
                : "image",
    }
);

        await document.deleteOne();

        res.status(200).json({

            success: true,

            message: "Document deleted successfully.",

        });

    }

   catch (error) {

    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message,
    });

}

};