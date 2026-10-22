import { randomUUID } from "node:crypto";

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "webp"];

export class CloudinaryStorage {
    constructor({ cloudinary, folder = "everkeep/documents" }) {
        if (!cloudinary?.uploader?.upload_stream || !cloudinary?.uploader?.destroy) {
            throw new TypeError("A configured Cloudinary client is required.");
        }
        this.cloudinary = cloudinary;
        this.folder = folder;
    }

    _handleFile(req, file, callback) {
        let completed = false;
        const finish = (...args) => {
            if (completed) return;
            completed = true;
            callback(...args);
        };

        try {
            const publicId = randomUUID();
            const uploadStream = this.cloudinary.uploader.upload_stream({
                folder: this.folder,
                resource_type: "auto",
                allowed_formats: ALLOWED_FORMATS,
                public_id: publicId,
            }, (error, result) => {
                if (error) return finish(error);
                if (!result?.secure_url || !result?.public_id) {
                    return finish(new Error("Cloudinary returned incomplete upload metadata."));
                }
                return finish(null, {
                    path: result.secure_url,
                    filename: result.public_id,
                    public_id: result.public_id,
                    resource_type: result.resource_type,
                    format: result.format,
                    size: result.bytes,
                });
            });

            file.stream.once("error", finish);
            uploadStream.once("error", finish);
            file.stream.pipe(uploadStream);
        } catch (error) {
            finish(error);
        }
    }

    _removeFile(req, file, callback) {
        const publicId = file.public_id || file.filename;
        if (!publicId) return callback(null);
        this.cloudinary.uploader.destroy(publicId, {
            resource_type: file.resource_type || "image",
        }).then(() => callback(null), callback);
    }
}

export default CloudinaryStorage;
