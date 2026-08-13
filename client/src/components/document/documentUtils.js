export const formatFileSize = (bytes = 0) => {
    if (!bytes) return "0 KB";

    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export const formatDate = (date) => {
    if (!date) return "Not available";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

export const getAssetName = (asset) => {
    if (!asset) return "Unlinked";
    if (typeof asset === "string") return asset;

    return asset.name || "Linked asset";
};

export const getFileKind = (fileType = "") => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word")) return "DOCX";
    if (fileType.includes("image")) return "Image";

    return "File";
};

export const isImageFile = (fileType = "") => fileType.includes("image");

export const isPdfFile = (fileType = "") => fileType.includes("pdf");
