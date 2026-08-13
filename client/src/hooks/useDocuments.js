import { useCallback, useEffect, useState } from "react";
import {
    deleteDocument,
    getDocuments,
    uploadDocument,
} from "../services/document.service";

const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [deletingId, setDeletingId] = useState("");

    const loadDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getDocuments();
            setDocuments(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load documents."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const createDocument = async (formData) => {
        try {
            setUploading(true);
            setUploadProgress(0);

            await uploadDocument(formData, {
                onUploadProgress: (event) => {
                    if (!event.total) return;
                    setUploadProgress(Math.round((event.loaded * 100) / event.total));
                },
            });

            await loadDocuments();
            setUploadProgress(100);
        } catch (err) {
            throw new Error(getErrorMessage(err, "Document upload failed."));
        } finally {
            setUploading(false);
        }
    };

    const removeDocument = async (id) => {
        try {
            setDeletingId(id);
            await deleteDocument(id);
            await loadDocuments();
        } catch (err) {
            throw new Error(getErrorMessage(err, "Could not delete document."));
        } finally {
            setDeletingId("");
        }
    };

    return {
        documents,
        loading,
        error,
        uploading,
        uploadProgress,
        deletingId,
        reload: loadDocuments,
        createDocument,
        removeDocument,
    };
};
