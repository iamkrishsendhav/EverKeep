
import api from "../lib/axios.js";

export const getAnalyticsOverview = async () => {
    const response = await api.get("/analytics/overview");

    const data = response.data?.data;
    if (
        !response.data?.success ||
        !Array.isArray(data?.assets) ||
        !Array.isArray(data?.warranties) ||
        !Array.isArray(data?.subscriptions)
    ) {
        throw new Error("Invalid analytics response from server.");
    }

    return data;
};

export default { getAnalyticsOverview };
