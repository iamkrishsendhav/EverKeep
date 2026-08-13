import { FileUp } from "lucide-react";
import { useState } from "react";

const DocumentUploadZone = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <button
            type="button"
            onClick={onUpload}
            onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                onUpload(event.dataTransfer.files?.[0] || null);
            }}
            className={`group flex w-full flex-col items-center justify-center rounded-[2rem] border border-dashed px-6 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)] ${
                isDragging
                    ? "border-[#5B4BFF] bg-indigo-50"
                    : "border-slate-300 bg-white"
            }`}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF] transition group-hover:scale-105">
                <FileUp size={26} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-950">
                Drag and drop upload
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Supports PDF, images and DOCX files. Click to open the secure upload dialog.
            </p>
        </button>
    );
};

export default DocumentUploadZone;
