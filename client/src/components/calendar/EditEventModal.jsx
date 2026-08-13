import {
    CalendarClock,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import EventForm from "./EventForm";


// ============================================================================
// EDIT EVENT MODAL
// ============================================================================
//
// Responsibilities:
// - Display edit modal
// - Pass existing event data to EventForm
// - Handle update submission
// - Handle loading/error state
// - Close on Escape
// - Lock background scrolling
//
// API calls are handled by the parent/useCalendar layer.
// ============================================================================

const EditEventModal = ({
    open = true,
    event = null,
    onClose,
    onUpdated,
    assets = [],
}) => {

    const [submitting, setSubmitting] =
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


        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                !submitting
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
        submitting,
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

    }, [event]);


    // =========================================================================
    // SAFETY CHECK
    // =========================================================================

    if (
        !open ||
        !event
    ) {
        return null;
    }


    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (
        formData
    ) => {

        try {

            setError("");
            setSubmitting(true);


            if (
                typeof onUpdated !==
                "function"
            ) {

                throw new Error(
                    "Update event handler is not configured."
                );

            }


            await onUpdated(
                formData
            );


            // ---------------------------------------------------------------
            // SUCCESS
            // ---------------------------------------------------------------

            onClose?.();


        } catch (err) {

            console.error(
                "Failed to update calendar event:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update event. Please try again."
            );


        } finally {

            setSubmitting(false);

        }
    };


    // =========================================================================
    // CLOSE
    // =========================================================================

    const handleClose = () => {

        if (submitting) {
            return;
        }


        setError("");

        onClose?.();

    };


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
            onMouseDown={(mouseEvent) => {

                if (
                    mouseEvent.target ===
                    mouseEvent.currentTarget
                ) {
                    handleClose();
                }

            }}
        >

            {/* =================================================================
                MODAL
            ================================================================= */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-event-title"
                className="
                    flex
                    w-full
                    max-w-2xl
                    max-h-[94vh]
                    flex-col
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

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-200/80
                        bg-white
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

                            <CalendarClock
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
                                Calendar
                            </p>


                            <h2
                                id="edit-event-title"
                                className="
                                    mt-0.5
                                    truncate
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                            >
                                Edit event
                            </h2>


                            <p
                                className="
                                    mt-0.5
                                    max-w-md
                                    truncate
                                    text-xs
                                    text-slate-500
                                "
                                title={event.title}
                            >
                                Update{" "}
                                {event.title ||
                                    "this event"}{" "}
                                details.
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        aria-label="Close edit event"
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
                            transition
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

                    <div className="shrink-0 px-6 pt-5">

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
                                Unable to update event
                            </p>


                            <p className="mt-1 text-xs leading-5">
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
                        px-6
                        py-6
                    "
                >

                    <EventForm
                        mode="edit"
                        initialData={event}
                        assets={assets}
                        onSubmit={
                            handleSubmit
                        }
                        onCancel={
                            handleClose
                        }
                        submitting={
                            submitting
                        }
                    />

                </div>

            </div>

        </div>
    );
};


export default EditEventModal;