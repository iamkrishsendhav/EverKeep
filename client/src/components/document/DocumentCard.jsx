import { Calendar, Eye, FileText, HardDrive, Link2, Trash2 } from "lucide-react";

const formatSize = (size = 0) => {
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const formatDate = (date) => {
    if (!date) return "Recently";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

const DocumentCard = ({ document, onView, onDelete }) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF]">
                        <FileText size={24} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-950">
                            {document.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {document.category || "Other"} - {document.type || "File"}
                        </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {document.category || "Other"}
                </span>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-slate-400" />
                    <span>{formatSize(document.size)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{formatDate(document.uploadedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-slate-400" />
                    <span className="truncate">
                        {document.assetName || "Not linked to an asset"}
                    </span>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onView(document)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5B4BFF]"
                >
                    <Eye size={16} />
                    View
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(document._id)}
                    aria-label={`Delete ${document.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </article>
    );
};

export default DocumentCard;
