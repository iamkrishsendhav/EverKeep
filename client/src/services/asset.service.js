import api from "../lib/axios";

export const getAssets = async () => {
    const res = await api.get("/assets");
    return res.data;
};

export const createAsset = async (asset) => {
    const res = await api.post("/assets", asset);
    return res.data;
};

export const updateAsset = async (id, asset) => {
    const res = await api.put(`/assets/${id}`, asset);
    return res.data;
};

export const deleteAsset = async (id) => {
    const res = await api.delete(`/assets/${id}`);
    return res.data;
};