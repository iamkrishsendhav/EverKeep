import { useState } from "react";
import { FileUp, X } from "lucide-react";

const categories = [
    "Invoice",
    "Warranty",
    "Insurance",
    "Medical",
    "Property",
    "Identity",
    "Other",
];

const UploadDocumentModal = ({ onClose, onUpload }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Invoice");
    const [assetName, setAssetName] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const fallbackName = file?.name?.replace(/\.[^/.]+$/, "") || "Untitled Document";

        onUpload({
            name: name.trim() || fallbackName,
            category,
            assetName: assetName.trim(),
            type: file?.type?.split("/").pop()?.toUpperCase() || "File",
            size: file?.size || 0,
        });
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-950">
                            Upload Document
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Add invoices, warranties, policies and identity records.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close upload modal"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Document name
                        </label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Laptop purchase invoice"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5B4BFF]"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5B4BFF]"
                            >
                                {categories.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Linked asset
                            </label>
                            <input
                                value={assetName}
                                onChange={(event) => setAssetName(event.target.value)}
                                placeholder="Optional"
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5B4BFF]"
                            />
                        </div>
                    </div>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50">
                        <FileUp className="text-[#5B4BFF]" size={30} />
                        <span className="mt-3 text-sm font-semibold text-slate-800">
                            {file ? file.name : "Choose a file"}
                        </span>
                        <span className="mt-1 text-xs text-slate-500">
                            PDF, image or document file
                        </span>
                        <input
                            type="file"
                            className="sr-only"
                            onChange={(event) => setFile(event.target.files?.[0] || null)}
                        />
                    </label>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-2xl bg-[#5B4BFF] px-5 py-3 font-semibold text-white transition hover:bg-indigo-600"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
