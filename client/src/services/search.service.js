import api from "../lib/axios.js";

export const searchRecords = async (query, { signal } = {}) => {
    const response = await api.get("/search", { params: { q: query }, signal });
    return response.data?.data;
};

export default { searchRecords };
