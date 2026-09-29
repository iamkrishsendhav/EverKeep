import { FileText, Plus } from "lucide-react";

const DocumentsHeader = ({ total, onUpload }) => {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#5B4BFF]">
                    <FileText size={14} />
                    {total} stored
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                    Documents
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                    Manage all your important documents securely in one place.
                </p>
            </div>

            <button
                type="button"
                onClick={onUpload}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B4BFF] px-5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(91,75,255,0.22)] transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
                <Plus size={18} />
                Upload Krish
            </button>
        </div>
    );
};

export default DocumentsHeader;
