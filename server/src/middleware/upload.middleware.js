import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => ({

        folder: "everkeep/documents",

        resource_type: "auto",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "pdf",
            "doc",
            "docx",
            "webp",
        ],

        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    }),
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

const upload = multer({

    storage,

    limits: {

        fileSize: 10 * 1024 * 1024, // 10 MB

    },

    fileFilter,

});

export default upload;
