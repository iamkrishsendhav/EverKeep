import { Calendar, FileText, HardDrive, Link2, X } from "lucide-react";

const formatSize = (size = 0) => {
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const formatDate = (date) => {
    if (!date) return "Recently";

    return new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

const DocumentPreviewModal = ({ document, onClose }) => {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF]">
                            <FileText size={24} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-2xl font-bold text-slate-950">
                                {document.name}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {document.category || "Other"} document
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                    <FileText className="mx-auto text-slate-400" size={56} />
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                        Preview metadata
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        File rendering can be connected when storage URLs are available.
                    </p>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                        <HardDrive size={17} className="text-slate-400" />
                        <span>{formatSize(document.size)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar size={17} className="text-slate-400" />
                        <span>{formatDate(document.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link2 size={17} className="text-slate-400" />
                        <span>{document.assetName || "Not linked to an asset"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;
