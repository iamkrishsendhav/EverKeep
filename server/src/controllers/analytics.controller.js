
import analyticsService from "../services/analytics.service.js";

export const getAnalyticsOverview = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const data = await analyticsService.getAnalyticsOverview(userId);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Analytics overview failed.");
        const status = error?.statusCode === 401 ? 401 : 500;
        return res.status(status).json({
            success: false,
            message: status === 401 ? "Authentication required." : "Unable to load analytics.",
        });
    }
};

export default { getAnalyticsOverview };
