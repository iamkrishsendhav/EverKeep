import { AlertTriangle, Trash2, X } from "lucide-react";
import Button from "../ui/Button";

const DeleteAssetModal = ({
    isOpen,
    asset,
    onClose,
    onConfirm,
    loading = false,
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">

            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100">

                            <AlertTriangle
                                size={22}
                                className="text-red-600"
                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Delete Asset
                            </h2>

                            <p className="text-sm text-slate-500">
                                This action cannot be undone.
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="px-6 py-6">

                    <p className="text-slate-600 leading-7">

                        Are you sure you want to delete

                        <span className="font-semibold text-slate-900">
                            {" "} "{asset?.name}"
                        </span>

                        ?

                    </p>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        loading={loading}
                        onClick={onConfirm}
                    >
                        <Trash2 size={17} />
                        Delete Asset
                    </Button>

                </div>

            </div>

        </div>
    );
};

export default DeleteAssetModal;