import { X } from "lucide-react";

const AssetModal = ({
    isOpen,
    onClose,
    children,
    title = "Add New Asset",
    description = "Store warranties, invoices and lifecycle information.",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-6">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {description}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 transition hover:bg-slate-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}

                <div className="max-h-[75vh] overflow-y-auto px-8 py-8">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default AssetModal;