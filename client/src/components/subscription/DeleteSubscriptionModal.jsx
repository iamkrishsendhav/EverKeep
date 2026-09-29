import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const DeleteSubscriptionModal = ({
    subscription,
    open = false,
    onClose,
    onDeleted,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open || !subscription) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !submitting) {
                onClose?.();
            }
        };

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, subscription, onClose, submitting]);

    if (!open || !subscription) {
        return null;
    }

    const handleDelete = async () => {
        if (!subscription?._id || submitting) {
            return;
        }

        try {
            setError("");
            setSubmitting(true);

            await onDeleted?.(subscription._id);
        } catch (err) {
            console.error("Failed to delete subscription:", err);

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete subscription. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) {
                    onClose?.();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-subscription-title"
                className="w-full max-w-md overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                            <AlertTriangle size={18} strokeWidth={2} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-rose-500">
                                Delete
                            </p>

                            <h2
                                id="delete-subscription-title"
                                className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-950"
                            >
                                Delete subscription
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close delete subscription"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </header>

                <div className="px-5 py-5">
                    <p className="text-sm leading-6 text-slate-600">
                        This will permanently remove{" "}
                        <span className="font-semibold text-slate-950">
                            {subscription.name || "this subscription"}
                        </span>{" "}
                        from EverKeep.
                    </p>

                    {error && (
                        <div
                            role="alert"
                            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700"
                        >
                            {error}
                        </div>
                    )}
                </div>

                <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={submitting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:pointer-events-none disabled:opacity-60"
                    >
                        <Trash2 size={14} />
                        {submitting ? "Deleting..." : "Delete"}
                    </button>
                </footer>
            </section>
        </div>
    );
};

export default DeleteSubscriptionModal;
