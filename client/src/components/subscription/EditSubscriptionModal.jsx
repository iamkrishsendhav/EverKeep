import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

import SubscriptionForm from "./SubscriptionForm";

// ============================================================================
// EDIT SUBSCRIPTION MODAL
// ============================================================================
//
// Responsible for:
// - Editing an existing subscription
// - Passing existing data into SubscriptionForm
// - Handling submit/loading/error state
// - Closing on Escape
// - Closing when clicking outside
//
// API calls are handled by the parent through onUpdated.
// ============================================================================

const EditSubscriptionModal = ({
    subscription,
    open = false,
    onClose,
    onUpdated,
}) => {
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // =========================================================================
    // CLOSE ON ESCAPE
    // =========================================================================

    useEffect(() => {
        if (!open || !subscription) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !submitting) {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, subscription, onClose, submitting]);

    // =========================================================================
    // BODY SCROLL LOCK
    // =========================================================================

    useEffect(() => {
        if (!open || !subscription) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open, subscription]);

    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (formData) => {
        try {
            setError("");
            setSubmitting(true);

            await onUpdated?.(formData);

            onClose?.();
        } catch (err) {
            console.error("Failed to update subscription:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update subscription. Please try again.",
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // =========================================================================
    // SAFETY
    // =========================================================================

    if (!open || !subscription) {
        return null;
    }

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[70]
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-sm
            "
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) {
                    onClose?.();
                }
            }}
        >
            {/* =================================================================
                MODAL
            ================================================================= */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="
                    edit-subscription-title
                "
                className="
                    flex
                    w-full
                    max-w-2xl
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.28)]
                "
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* =============================================================
                    HEADER
                ============================================================= */}

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-200/80
                        px-5
                        py-4

                        sm:px-6
                        sm:py-5
                    "
                >
                    {/* ---------------------------------------------------------
                        TITLE
                    --------------------------------------------------------- */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-indigo-50
                                text-indigo-600
                                ring-1
                                ring-indigo-100
                            "
                        >
                            <Pencil size={18} strokeWidth={2} />
                        </div>

                        <div
                            className="
                                min-w-0
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-500
                                "
                            >
                                Subscription
                            </p>

                            <h2
                                id="
                                    edit-subscription-title
                                "
                                className="
                                    mt-0.5
                                    truncate
                                    text-lg
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Edit subscription
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    hidden
                                    max-w-md
                                    truncate
                                    text-[11px]
                                    text-slate-500

                                    sm:block
                                "
                            >
                                Update {subscription.name || "subscription"} details and billing
                                information.
                            </p>
                        </div>
                    </div>

                    {/* ---------------------------------------------------------
                        CLOSE
                    --------------------------------------------------------- */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="
                            Close edit subscription
                        "
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition-all
                            duration-200

                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-800

                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50

                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        <X size={17} />
                    </button>
                </header>

                {/* =============================================================
                    ERROR
                ============================================================= */}

                {error && (
                    <div
                        className="
                            shrink-0
                            px-5
                            pt-4

                            sm:px-6
                        "
                    >
                        <div
                            role="alert"
                            className="
                                rounded-xl
                                border
                                border-rose-200
                                bg-rose-50
                                px-3.5
                                py-3
                                text-xs
                                text-rose-700
                            "
                        >
                            <p
                                className="
                                    font-bold
                                "
                            >
                                Unable to update subscription
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                "
                            >
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =============================================================
                    FORM
                ============================================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-5
                        py-5

                        sm:px-6
                        sm:py-6
                    "
                >
                    <SubscriptionForm
                        mode="edit"
                        initialData={subscription}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitting={submitting}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditSubscriptionModal;
