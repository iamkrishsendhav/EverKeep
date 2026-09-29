import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    CreditCard,
    X,
    ShieldCheck,
} from "lucide-react";

import SubscriptionForm from "./SubscriptionForm";


// ============================================================================
// ADD SUBSCRIPTION MODAL
// ============================================================================
//
// Responsibilities:
// - Display subscription form inside a proper modal
// - Handle ESC key
// - Lock background scrolling
// - Close on backdrop click
// - Keep modal responsive
// - Keep form logic inside SubscriptionForm
//
// API calls are NOT made here.
// ============================================================================


const AddSubscriptionModal = ({
    open = false,
    isOpen,
    onClose,
    onSubmit,
    submitting = false,
    mode = "create",
    initialData = {},
}) => {

    // =========================================================================
    // SUPPORT BOTH `open` AND `isOpen`
    // =========================================================================

    const visible =
        typeof isOpen === "boolean"
            ? isOpen
            : open;


    // =========================================================================
    // ESC + BODY SCROLL LOCK
    // =========================================================================

    useEffect(() => {

        if (!visible) {
            return undefined;
        }


        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                !submitting
            ) {
                onClose?.();
            }
        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;
        };

    }, [
        visible,
        submitting,
        onClose,
    ]);


    // =========================================================================
    // BACKDROP CLICK
    // =========================================================================

    const handleBackdropClick = (
        event
    ) => {

        if (
            event.target === event.currentTarget &&
            !submitting
        ) {
            onClose?.();
        }
    };


    // =========================================================================
    // CLOSE
    // =========================================================================

    const handleClose = () => {

        if (submitting) {
            return;
        }

        onClose?.();
    };


    // =========================================================================
    // RENDER
    // =========================================================================

    if (
        typeof document === "undefined"
    ) {
        return null;
    }


    return createPortal(

        <AnimatePresence>

            {visible && (

                <motion.div
                    key="subscription-modal"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.18,
                        ease: "easeOut",
                    }}
                    onMouseDown={
                        handleBackdropClick
                    }
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-slate-950/35
                        p-3
                        backdrop-blur-[6px]
                        sm:p-5
                    "
                    role="presentation"
                >

                    {/* =========================================================
                        MODAL
                    ========================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 18,
                            scale: 0.985,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 12,
                            scale: 0.985,
                        }}
                        transition={{
                            duration: 0.22,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                        className="
                            flex
                            w-full
                            max-w-2xl
                            max-h-[92vh]
                            flex-col
                            overflow-hidden
                            rounded-[1.5rem]
                            border
                            border-slate-200/80
                            bg-white
                            shadow-[0_30px_100px_rgba(15,23,42,0.22)]
                        "
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="subscription-modal-title"
                    >

                        {/* =====================================================
                            HEADER
                        ===================================================== */}

                        <header
                            className="
                                shrink-0
                                border-b
                                border-slate-200/80
                                bg-white
                                px-5
                                py-4
                                sm:px-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                {/* LEFT */}

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
                                            rounded-xl
                                            border
                                            border-indigo-100
                                            bg-indigo-50
                                            text-indigo-600
                                        "
                                    >
                                        <CreditCard
                                            size={18}
                                            strokeWidth={1.9}
                                        />
                                    </div>


                                    <div className="min-w-0">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <h2
                                                id="subscription-modal-title"
                                                className="
                                                    truncate
                                                    text-base
                                                    font-semibold
                                                    tracking-tight
                                                    text-slate-950
                                                    sm:text-lg
                                                "
                                            >
                                                {mode === "edit"
                                                    ? "Edit subscription"
                                                    : "Add subscription"}
                                            </h2>

                                            <span
                                                className="
                                                    hidden
                                                    rounded-full
                                                    border
                                                    border-emerald-100
                                                    bg-emerald-50
                                                    px-2
                                                    py-0.5
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.12em]
                                                    text-emerald-700
                                                    sm:inline-flex
                                                "
                                            >
                                                Secure
                                            </span>

                                        </div>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                leading-4
                                                text-slate-400
                                            "
                                        >
                                            Keep your recurring payments
                                            organized in EverKeep.
                                        </p>

                                    </div>

                                </div>


                                {/* CLOSE */}

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    aria-label="Close subscription modal"
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
                                        text-slate-400
                                        transition-all
                                        duration-200
                                        hover:border-slate-300
                                        hover:bg-slate-50
                                        hover:text-slate-700
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-slate-500/10
                                        disabled:pointer-events-none
                                        disabled:opacity-40
                                    "
                                >
                                    <X
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                </button>

                            </div>


                            {/* SMALL TRUST ROW */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-2
                                    text-[10px]
                                    font-medium
                                    text-slate-400
                                "
                            >

                                <ShieldCheck
                                    size={13}
                                    className="text-emerald-500"
                                />

                                <span>
                                    Your subscription data stays
                                    organized in your EverKeep workspace.
                                </span>

                            </div>

                        </header>


                        {/* =====================================================
                            BODY
                        ===================================================== */}

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                overscroll-contain
                                bg-slate-50/40
                                px-3
                                py-3
                                sm:px-5
                                sm:py-4
                            "
                        >

                            <SubscriptionForm
                                mode={mode}
                                initialData={
                                    initialData
                                }
                                onSubmit={
                                    onSubmit
                                }
                                onCancel={
                                    handleClose
                                }
                                submitting={
                                    submitting
                                }
                            />

                        </div>

                    </motion.div>

                </motion.div>
            )}

        </AnimatePresence>,

        document.body
    );
};


export default AddSubscriptionModal;