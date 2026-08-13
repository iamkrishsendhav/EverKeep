import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

import WarrantyForm from "./WarrantyForm";


const EditWarrantyModal = ({
    warranty,
    onClose,
    onUpdated,
}) => {

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    // ============================================================
    // CLOSE ON ESCAPE
    // ============================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                !submitting
            ) {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [onClose, submitting]);


    // ============================================================
    // SAFETY CHECK
    // ============================================================

    if (!warranty) {
        return null;
    }


    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (formData) => {

        try {

            setError("");
            setSubmitting(true);

            await onUpdated(formData);

        } catch (err) {

            console.error(
                "Failed to update warranty:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update warranty. Please try again."
            );

        } finally {

            setSubmitting(false);

        }
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-[60]
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-sm
            "
            onMouseDown={() => {

                if (!submitting) {
                    onClose();
                }

            }}
        >

            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-warranty-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className="
                    flex
                    w-full
                    max-w-xl
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.28)]
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-200/80
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        {/* ICON */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-indigo-50
                                text-[#5B4BFF]
                            "
                        >

                            <Pencil
                                size={20}
                                strokeWidth={2}
                            />

                        </div>


                        {/* TITLE */}

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-500
                                "
                            >
                                Warranty
                            </p>

                            <h2
                                id="edit-warranty-title"
                                className="
                                    mt-0.5
                                    truncate
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Edit warranty
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Update coverage and warranty
                                information.
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close edit warranty"
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


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="px-6 pt-5">

                        <div
                            role="alert"
                            className="
                                rounded-2xl
                                border
                                border-rose-200
                                bg-rose-50
                                px-4
                                py-3
                                text-sm
                                text-rose-700
                            "
                        >

                            <p className="font-semibold">
                                Unable to update warranty
                            </p>

                            <p className="mt-1 text-xs">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    FORM
                ================================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        px-6
                        py-6
                    "
                >

                    <WarrantyForm
                        mode="edit"
                        initialData={warranty}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitting={submitting}
                    />

                </div>

            </div>

        </div>
    );
};


export default EditWarrantyModal;