import { useCallback, useEffect, useState } from "react";
import { getAssets } from "../services/asset.service";

const useAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAssets = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAssets();

            const data = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setAssets(data);
        } catch (err) {
            console.error("Failed to fetch assets:", err);

            setAssets([]);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load assets."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    return {
        assets,
        loading,
        error,
        refetch: fetchAssets,
        fetchAssets,
    };
};

export { useAssets };
export default useAssets;