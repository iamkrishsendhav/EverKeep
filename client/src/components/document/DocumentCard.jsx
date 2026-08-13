import { Download, Eye, FileText, Trash2 } from "lucide-react";
import {
    formatDate,
    formatFileSize,
    getAssetName,
    getFileKind,
} from "./documentUtils";

const DocumentCard = ({ document, onPreview, onDelete, deleting }) => {
    return (
        <tr className="group border-b border-slate-100 transition hover:bg-slate-50/80">
            <td className="min-w-64 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF]">
                        <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                            {document.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            {getFileKind(document.fileType)}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {document.category || "Other"}
                </span>
            </td>
            <td className="max-w-48 px-5 py-4 text-sm font-medium text-slate-600">
                <span className="block truncate">{getAssetName(document.asset)}</span>
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                {formatFileSize(document.fileSize)}
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                {formatDate(document.createdAt)}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onPreview(document)}
                        aria-label={`Preview ${document.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5B4BFF]"
                    >
                        <Eye size={16} />
                    </button>
                    <a
                        href={document.fileUrl}
                        download={document.originalName || document.name}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Download ${document.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#5B4BFF]"
                    >
                        <Download size={16} />
                    </a>
                    <button
                        type="button"
                        onClick={() => onDelete(document)}
                        disabled={deleting}
                        aria-label={`Delete ${document.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default DocumentCard;
