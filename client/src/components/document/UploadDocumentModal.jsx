import { CheckCircle2, FileUp, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const categories = [
    "Invoice",
    "Warranty",
    "Insurance",
    "Identity",
    "Medical",
    "Property",
    "Education",
    "Other",
];

const UploadDocumentModal = ({
    onClose,
    onUpload,
    assets,
    uploading,
    progress,
    initialFile = null,
}) => {
    const [file, setFile] = useState(initialFile);
    const [category, setCategory] = useState("Other");
    const [asset, setAsset] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !uploading) onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, uploading]);

    const submit = async (event) => {
        event.preventDefault();
        if (!file || uploading || done) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
        formData.append("category", category);
        if (asset) formData.append("asset", asset);

        try {
            setError("");
            await onUpload(formData);
            setDone(true);
            window.setTimeout(onClose, 650);
        } catch (err) {
            setError(err.message || "Upload failed. Please try again.");
        }
    };

    const handleFiles = (files) => {
        const selectedFile = files?.[0];
        if (selectedFile) setFile(selectedFile);
    };

    return (
        <div
            onClick={() => !uploading && onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                            Upload Document
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Upload PDF, images or DOCX files directly to your secure document vault.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={uploading}
                        aria-label="Close upload modal"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-5">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            handleFiles(event.dataTransfer.files);
                        }}
                        className={`flex w-full flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center transition ${
                            isDragging
                                ? "border-[#5B4BFF] bg-indigo-50"
                                : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/60"
                        }`}
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5B4BFF] shadow-sm">
                            <FileUp size={26} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">
                            {file ? file.name : "Drop your file here or browse"}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            PDF, Images, DOCX up to 10 MB
                        </p>
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                        className="sr-only"
                        onChange={(event) => handleFiles(event.target.files)}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-semibold text-slate-700">
                                Category
                            </span>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#5B4BFF] focus:ring-4 focus:ring-indigo-100"
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-slate-700">
                                Linked Asset
                            </span>
                            <select
                                value={asset}
                                onChange={(event) => setAsset(event.target.value)}
                                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#5B4BFF] focus:ring-4 focus:ring-indigo-100"
                            >
                                <option value="">No asset</option>
                                {assets.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {(uploading || done) && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                <span>{done ? "Upload complete" : "Uploading..."}</span>
                                <span>{done ? "100%" : `${progress}%`}</span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-[#5B4BFF] transition-all"
                                    style={{ width: `${done ? 100 : progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!file || uploading || done}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B4BFF] px-5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(91,75,255,0.22)] transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:pointer-events-none disabled:opacity-60"
                        >
                            {done && <CheckCircle2 size={17} />}
                            {uploading && <Loader2 className="animate-spin" size={17} />}
                            {done ? "Uploaded" : uploading ? "Uploading" : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
