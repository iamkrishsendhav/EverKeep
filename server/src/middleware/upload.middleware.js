import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import CloudinaryStorage from "./cloudinaryStorage.js";

const storage = new CloudinaryStorage({ cloudinary });

const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (req, file, callback) => {
    if (allowedTypes.has(file.mimetype)) return callback(null, true);
    const error = new Error("Unsupported file type.");
    error.statusCode = 400;
    return callback(error);
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 30, parts: 32 },
    fileFilter,
});

export default upload;
