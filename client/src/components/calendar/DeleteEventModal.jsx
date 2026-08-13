import {
    AlertTriangle,
    Loader2,
    Trash2,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";


// ============================================================================
// DELETE EVENT MODAL
// ============================================================================
//
// Responsibilities:
// - Confirm destructive action
// - Display event information
// - Handle delete loading state
// - Handle API errors
// - Prevent accidental dismissal while deleting
// - Close on Escape when safe
//
// API call remains in parent/useCalendar.
// ============================================================================

const DeleteEventModal = ({
    open = true,
    event = null,
    onClose,
    onDeleted,
}) => {

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================================
    // ESCAPE KEY
    // =========================================================================

    useEffect(() => {

        if (!open) {
            return undefined;
        }


        const handleKeyDown = (keyboardEvent) => {

            if (
                keyboardEvent.key === "Escape" &&
                !deleting
            ) {
                onClose?.();
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

    }, [
        open,
        onClose,
        deleting,
    ]);


    // =========================================================================
    // BODY SCROLL LOCK
    // =========================================================================

    useEffect(() => {

        if (!open) {
            return undefined;
        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [open]);


    // =========================================================================
    // RESET ERROR WHEN EVENT CHANGES
    // =========================================================================

    useEffect(() => {

        setError("");

        setDeleting(false);

    }, [event]);


    // =========================================================================
    // SAFETY
    // =========================================================================

    if (
        !open ||
        !event
    ) {
        return null;
    }


    // =========================================================================
    // DELETE
    // =========================================================================

    const handleDelete = async () => {

        if (deleting) {
            return;
        }


        try {

            setError("");
            setDeleting(true);


            if (
                typeof onDeleted !==
                "function"
            ) {

                throw new Error(
                    "Delete event handler is not configured."
                );

            }


            await onDeleted();


            // ---------------------------------------------------------------
            // SUCCESS
            // ---------------------------------------------------------------

            onClose?.();

        } catch (err) {

            console.error(
                "Failed to delete calendar event:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to delete this event. Please try again."
            );


        } finally {

            setDeleting(false);

        }
    };


    // =========================================================================
    // CLOSE
    // =========================================================================

    const handleClose = () => {

        if (deleting) {
            return;
        }


        setError("");

        onClose?.();

    };


    // =========================================================================
    // EVENT TITLE
    // =========================================================================

    const eventTitle =
        event.title?.trim() ||
        "Untitled event";


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[80]
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
                backdrop-blur-sm
            "
            onMouseDown={(mouseEvent) => {

                if (
                    mouseEvent.target ===
                    mouseEvent.currentTarget &&
                    !deleting
                ) {
                    handleClose();
                }

            }}
        >

            {/* =================================================================
                MODAL
            ================================================================= */}

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-event-title"
                aria-describedby="delete-event-description"
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.28)]
                "
                onMouseDown={(mouseEvent) =>
                    mouseEvent.stopPropagation()
                }
            >

                {/* =============================================================
                    HEADER
                ============================================================= */}

                <div className="px-6 pt-6">

                    <div className="flex items-start justify-between gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-rose-50
                                text-rose-600
                            "
                        >

                            <Trash2
                                size={22}
                                strokeWidth={2}
                            />

                        </div>


                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={deleting}
                            aria-label="Close delete confirmation"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                text-slate-500
                                transition
                                hover:bg-slate-50
                                hover:text-slate-800
                                focus:outline-none
                                focus:ring-4
                                focus:ring-slate-100
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >

                            <X size={17} />

                        </button>

                    </div>


                    <div className="mt-5">

                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-rose-500
                            "
                        >
                            Calendar
                        </p>


                        <h2
                            id="delete-event-title"
                            className="
                                mt-1
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-950
                            "
                        >
                            Delete this event?
                        </h2>


                        <p
                            id="delete-event-description"
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            This action cannot be undone.
                            The event will be permanently
                            removed from your calendar.
                        </p>

                    </div>

                </div>


                {/* =============================================================
                    EVENT PREVIEW
                ============================================================= */}

                <div className="px-6 pt-5">

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        "
                    >

                        <div className="flex items-start gap-3">

                            <div
                                className="
                                    mt-0.5
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-slate-500
                                    shadow-sm
                                "
                            >

                                <AlertTriangle
                                    size={17}
                                />

                            </div>


                            <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {eventTitle}
                                </p>


                                {event.type && (

                                    <p className="mt-1 text-xs capitalize text-slate-500">
                                        {event.type}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =============================================================
                    ERROR
                ============================================================= */}

                {error && (

                    <div className="px-6 pt-4">

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
                                Delete failed
                            </p>


                            <p className="mt-1 text-xs leading-5">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* =============================================================
                    ACTIONS
                ============================================================= */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-slate-200
                        px-6
                        py-5
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={deleting}
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:border-slate-300
                            hover:bg-slate-50
                            focus:outline-none
                            focus:ring-4
                            focus:ring-slate-100
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >

                        <X size={16} />

                        Cancel

                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-rose-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-[0_12px_30px_rgba(225,29,72,0.20)]
                            transition
                            hover:-translate-y-0.5
                            hover:bg-rose-700
                            focus:outline-none
                            focus:ring-4
                            focus:ring-rose-100
                            disabled:pointer-events-none
                            disabled:opacity-60
                        "
                    >

                        {deleting ? (

                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                                Deleting...
                            </>

                        ) : (

                            <>
                                <Trash2
                                    size={17}
                                />

                                Delete event
                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default DeleteEventModal;