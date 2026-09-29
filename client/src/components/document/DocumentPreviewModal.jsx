import { Download, FileText, Trash2, X } from "lucide-react";
import { useEffect } from "react";

import {
    formatDate,
    formatFileSize,
    getAssetName,
    getFileKind,
    isImageFile,
    isPdfFile,
} from "./documentUtils";

const Detail = ({ label, value }) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-800 truncate">
            {value}
        </p>
    </div>
);

const DocumentPreviewModal = ({
    document,
    onClose,
    onDelete,
    deleting,
}) => {
    useEffect(() => {

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);

    }, [onClose]);

    const canPreview =
        isImageFile(document.fileType) ||
        isPdfFile(document.fileType);

    return (

        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">

                            <FileText
                                size={24}
                                className="text-indigo-600"
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">

                                {document.name}

                            </h2>

                            <p className="text-slate-500">

                                {getFileKind(document.fileType)}

                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border p-2 hover:bg-slate-100"
                    >
                        <X />
                    </button>

                </div>

                {/* Body */}

                <div className="grid lg:grid-cols-[1.6fr_0.7fr]">

                    {/* Preview */}

                    <div className="bg-slate-100 p-5">

                        <div className="flex h-[75vh] items-center justify-center overflow-auto rounded-3xl bg-white">

                            {isImageFile(document.fileType) && (

                                <img
                                    src={document.fileUrl}
                                    alt={document.name}
                                    className="max-h-full object-contain"
                                />

                            )}

                            {/* {isPdfFile(document.fileType) && (

                                <Document
                                    file={document.fileUrl}
                                    onLoadSuccess={onLoadSuccess}
                                    loading="Loading PDF..."
                                    error="Unable to load PDF."
                                >

                                    {Array.from(
                                        new Array(numPages),
                                        (_, index) => (

                                            <Page
                                                key={index}
                                                pageNumber={index + 1}
                                                width={700}
                                            />

                                        )
                                    )}

                                </Document>

                            )} */}

                            {isPdfFile(document.fileType) && (

    <iframe
        src={document.fileUrl}
        title={document.name}
        className="h-[75vh] w-full rounded-2xl"
    />

)}

                            {!canPreview && (

                                <div className="text-center">

                                    <FileText
                                        size={70}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-4 text-slate-600">

                                        Preview unavailable.

                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* Sidebar */}

                    <div className="space-y-4 border-l p-6">

                        <Detail
                            label="File Name"
                            value={document.originalName}
                        />

                        <Detail
                            label="Category"
                            value={document.category || "Other"}
                        />

                        <Detail
                            label="Upload Date"
                            value={formatDate(document.createdAt)}
                        />

                        <Detail
                            label="Size"
                            value={formatFileSize(document.fileSize)}
                        />

                        <Detail
                            label="Linked Asset"
                            value={getAssetName(document.asset)}
                        />

                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B4BFF] font-semibold text-white"
                        >

                            <Download size={18} />

                            Download

                        </a>

                        <button
                            onClick={() => onDelete(document)}
                            disabled={deleting}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 font-semibold text-red-600"
                        >

                            <Trash2 size={18} />

                            {deleting
                                ? "Deleting..."
                                : "Delete"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default DocumentPreviewModal;
