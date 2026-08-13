import { FileText, Plus } from "lucide-react";

const EmptyDocuments = ({ onUpload, message = "No documents found" }) => {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF]">
                <FileText size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                {message}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Upload a document or adjust your search and folder filter.
            </p>
            <button
                type="button"
                onClick={onUpload}
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B4BFF] px-5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(91,75,255,0.22)] transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
                <Plus size={17} />
                Upload Document
            </button>
        </div>
    );
};

export default EmptyDocuments;
