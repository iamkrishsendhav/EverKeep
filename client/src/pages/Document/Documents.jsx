import { useMemo, useState } from "react";

import DocumentsHeader from "../../components/document/DocumentsHeader";
import DocumentStats from "../../components/document/DocumentStats";
import DocumentSearch from "../../components/document/DocumentSearch";
import DocumentFilters from "../../components/document/DocumentFilters";
import DocumentGrid from "../../components/document/DocumentGrid";
import EmptyDocuments from "../../components/document/EmptyDocuments";
import DocumentUploadModal from "../../components/document/UploadDocumentModal";
import DocumentPreviewModal from "../../components/document/DocumentPreviewModal";

const initialDocuments = [
    {
        _id: "doc-1",
        name: "Bike Insurance Policy",
        category: "Insurance",
        type: "PDF",
        size: 2.4 * 1024 * 1024,
        assetName: "Royal Enfield Classic",
        assetId: "asset-bike",
        uploadedAt: "2026-08-02T10:30:00.000Z",
    },
    {
        _id: "doc-2",
        name: "Laptop Purchase Invoice",
        category: "Invoice",
        type: "PDF",
        size: 820 * 1024,
        assetName: "MacBook Pro",
        assetId: "asset-laptop",
        uploadedAt: "2026-07-28T13:45:00.000Z",
    },
    {
        _id: "doc-3",
        name: "Home Warranty Certificate",
        category: "Warranty",
        type: "Image",
        size: 1.1 * 1024 * 1024,
        assetName: "Air Conditioner",
        assetId: "asset-ac",
        uploadedAt: "2026-07-19T09:15:00.000Z",
    },
];

const Documents = () => {
    const [documents, setDocuments] = useState(initialDocuments);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("latest");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleView = (document) => {
        setSelectedDocument(document);
    };

    const handleUpload = (newDocument) => {
        setDocuments((prev) => [
            {
                ...newDocument,
                _id: `doc-${Date.now()}`,
                uploadedAt: new Date().toISOString(),
            },
            ...prev,
        ]);
        setShowUploadModal(false);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Delete this document?");

        if (!confirmDelete) return;

        setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    };

    const filteredDocuments = useMemo(() => {
        const filtered = documents.filter((doc) => {
            const matchesSearch = doc.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" || doc.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "oldest") {
                return new Date(a.uploadedAt) - new Date(b.uploadedAt);
            }

            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === "size") {
                return (b.size || 0) - (a.size || 0);
            }

            return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        });
    }, [documents, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="space-y-8">
            <DocumentsHeader
                total={documents.length}
                onUpload={() => setShowUploadModal(true)}
            />

            <DocumentStats documents={documents} />

            <DocumentSearch
                value={searchQuery}
                onChange={setSearchQuery}
                category={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                total={filteredDocuments.length}
            />

            <DocumentFilters
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {filteredDocuments.length === 0 ? (
                <EmptyDocuments onUpload={() => setShowUploadModal(true)} />
            ) : (
                <DocumentGrid
                    documents={filteredDocuments}
                    onView={handleView}
                    onDelete={handleDelete}
                />
            )}

            {showUploadModal && (
                <DocumentUploadModal
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUpload}
                />
            )}

            {selectedDocument && (
                <DocumentPreviewModal
                    document={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                />
            )}
        </div>
    );
};

export default Documents;
