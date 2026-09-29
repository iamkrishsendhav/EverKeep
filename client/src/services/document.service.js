import api from "../lib/axios";

export const getDocuments = async () => {
    const res = await api.get("/documents");
    return res.data;
};

export const getDocumentById = async (id) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
};

export const uploadDocument = async (formData, config = {}) => {
    const res = await api.post("/documents", formData, {
        ...config,
    });

    return res.data;
};

export const deleteDocument = async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
};
