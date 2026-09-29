import { useMemo, useState } from "react";

import ErrorState from "../../components/common/ErrorState";
import Loading from "../../components/common/Loading";
import DocumentFilters from "../../components/document/DocumentFilters";
import DocumentGrid from "../../components/document/DocumentGrid";
import DocumentPreviewModal from "../../components/document/DocumentPreviewModal";
import DocumentSearch from "../../components/document/DocumentSearch";
import DocumentUploadModal from "../../components/document/UploadDocumentModal";
import DocumentUploadZone from "../../components/document/DocumentUploadZone";
import DocumentsHeader from "../../components/document/DocumentsHeader";
import EmptyDocuments from "../../components/document/EmptyDocuments";
import { getAssetName } from "../../components/document/documentUtils";
import { useDocuments } from "../../hooks/useDocuments";
import { getAssets } from "../../services/asset.service";
import { useEffect } from "react";

const Documents = () => {
    const {
        documents,
        loading,
        error,
        uploading,
        uploadProgress,
        deletingId,
        reload,
        createDocument,
        removeDocument,
    } = useDocuments();

    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [initialUploadFile, setInitialUploadFile] = useState(null);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadAssets = async () => {
            try {
                const response = await getAssets();
                const nextAssets = Array.isArray(response?.data)
                    ? response.data
                    : [];
                if (isMounted) setAssets(nextAssets);
            } catch {
                if (isMounted) setAssets([]);
            }
        };

        loadAssets();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredDocuments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return documents.filter((document) => {
            const matchesCategory =
                selectedCategory === "All" || document.category === selectedCategory;

            const searchable = [
                document.name,
                document.originalName,
                document.category,
                getAssetName(document.asset),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesCategory && (!query || searchable.includes(query));
        });
    }, [documents, searchQuery, selectedCategory]);

    const handleUpload = async (formData) => {
        setActionError("");
        try {
            await createDocument(formData);
        } catch (err) {
            setActionError(err.message);
            throw err;
        }
    };

    const handleDelete = async (document) => {
        const confirmed = window.confirm(`Delete "${document.name}"?`);
        if (!confirmed) return;

        setActionError("");
        try {
            await removeDocument(document._id);
            if (selectedDocument?._id === document._id) {
                setSelectedDocument(null);
            }
        } catch (err) {
            setActionError(err.message);
        }
    };

    return (
        <div className="-m-4 min-h-screen bg-[#F8FAFC] p-4 sm:-m-6 sm:p-6 lg:-m-8 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <DocumentsHeader
                    total={documents.length}
                    onUpload={() => setShowUploadModal(true)}
                />

                {actionError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                        {actionError}
                    </div>
                )}

                <DocumentUploadZone
                    onUpload={(file) => {
                        setInitialUploadFile(file);
                        setShowUploadModal(true);
                    }}
                />

                {loading && <Loading label="Loading documents" />}

                {!loading && error && (
                    <ErrorState
                        title="Documents could not load"
                        description={error}
                        actionLabel="Try Again"
                        onAction={reload}
                    />
                )}

                {!loading && !error && (
                    <>
                        <DocumentFilters
                            documents={documents}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                        />

                        <DocumentSearch
                            value={searchQuery}
                            onChange={setSearchQuery}
                            total={filteredDocuments.length}
                        />

                        {filteredDocuments.length === 0 ? (
                            <EmptyDocuments
                                onUpload={() => setShowUploadModal(true)}
                                message={
                                    documents.length === 0
                                        ? "No documents uploaded yet"
                                        : "No documents match your view"
                                }
                            />
                        ) : (
                            <DocumentGrid
                                documents={filteredDocuments}
                                onPreview={setSelectedDocument}
                                onDelete={handleDelete}
                                deletingId={deletingId}
                            />
                        )}
                    </>
                )}

                {showUploadModal && (
                    <DocumentUploadModal
                        onClose={() => {
                            setShowUploadModal(false);
                            setInitialUploadFile(null);
                        }}
                        onUpload={handleUpload}
                        assets={assets}
                        uploading={uploading}
                        progress={uploadProgress}
                        initialFile={initialUploadFile}
                    />
                )}

                {selectedDocument && (
                    <DocumentPreviewModal
                        document={selectedDocument}
                        onClose={() => setSelectedDocument(null)}
                        onDelete={handleDelete}
                        deleting={deletingId === selectedDocument._id}
                    />
                )}
            </div>
        </div>
    );
};

export default Documents;
