import searchService from "../services/search.service.js";

export const search = async (req, res) => {
    const query = req.query.q;
    if (typeof query !== "string") {
        return res.status(400).json({ success: false, message: "Search query is required." });
    }

    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
        const data = await searchService.searchForUser(userId, query);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        const status = error?.statusCode === 400 ? 400 : 500;
        if (status === 500) console.error("Search request failed:", { name: error?.name || "Error", code: error?.code || "SEARCH_FAILED" });
        return res.status(status).json({
            success: false,
            message: status === 400 ? error.message : "Unable to search your records.",
        });
    }
};

export default { search };
