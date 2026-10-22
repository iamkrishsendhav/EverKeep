import Document from "../models/Document.js";
import assetService from "./asset.service.js";

const escapeSearchTerm = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchForUser = async (userId, query) => {
    const term = String(query || "").trim().replace(/\s+/g, " ");
    if (!term || term.length > 80) {
        const error = new Error("Search must contain 1 to 80 characters.");
        error.statusCode = 400;
        throw error;
    }

    const expression = new RegExp(escapeSearchTerm(term), "i");
    const [assets, documents] = await Promise.all([
        assetService.searchAssetsForUser(userId, term, 5),
        Document.find({
            owner: userId,
            $or: [{ name: expression }, { originalName: expression }, { category: expression }],
        })
            .select("name originalName category fileType asset createdAt")
            .sort({ createdAt: -1, _id: -1 })
            .limit(5)
            .lean(),
    ]);

    return {
        query: term,
        assets: assets.map((asset) => ({
            id: String(asset._id),
            type: "asset",
            name: asset.name,
            detail: [asset.brand, asset.model, asset.category].filter(Boolean).join(" · "),
            status: asset.status,
        })),
        documents: documents.map((document) => ({
            id: String(document._id),
            type: "document",
            name: document.name || document.originalName,
            detail: [document.category, document.originalName].filter(Boolean).join(" · "),
            assetId: document.asset ? String(document.asset) : null,
        })),
    };
};

export default { searchForUser };
