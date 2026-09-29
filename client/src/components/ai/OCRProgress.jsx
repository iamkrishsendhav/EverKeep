import { useEffect, useMemo, useState } from "react";


// ============================================================================
// OCR PROGRESS
// ============================================================================
//
// Clean, minimal progress component for EverKeep document OCR.
//
// Responsibilities:
// - Show OCR processing state
// - Display progress
// - Show current processing step
// - Support success / error states
// - Provide optional cancel / retry actions
//
// This component does NOT:
// - Upload files
// - Call APIs
// - Perform OCR
//
// The parent component controls the actual OCR process.
//
// ============================================================================


// ============================================================================
// ICONS
// ============================================================================

const ScanIcon = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M7 3H5.5A2.5 2.5 0 0 0 3 5.5V7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />

        <path
            d="M17 3h1.5A2.5 2.5 0 0 1 21 5.5V7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />

        <path
            d="M21 17v1.5a2.5 2.5 0 0 1-2.5 2.5H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />

        <path
            d="M7 21H5.5A2.5 2.5 0 0 1 3 18.5V17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />

        <path
            d="M5 12h14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
    </svg>
);


const CheckIcon = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M5 12.5L9.5 17L19 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const AlertIcon = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M12 4L21 19H3L12 4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />

        <path
            d="M12 9V13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />

        <circle
            cx="12"
            cy="16"
            r="0.8"
            fill="currentColor"
        />
    </svg>
);


const XIcon = ({ size = 15 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M6 6L18 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />

        <path
            d="M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
    </svg>
);


const RotateIcon = ({ size = 15 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M20 11A8 8 0 0 0 6.5 5.5L4 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <path
            d="M4 4V8H8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <path
            d="M4 13A8 8 0 0 0 17.5 18.5L20 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


// ============================================================================
// DEFAULT OCR STEPS
// ============================================================================

const DEFAULT_STEPS = [
    {
        key: "upload",
        label: "Preparing document",
    },
    {
        key: "scan",
        label: "Reading document",
    },
    {
        key: "extract",
        label: "Extracting information",
    },
    {
        key: "complete",
        label: "Finalizing results",
    },
];


// ============================================================================
// HELPERS
// ============================================================================

const clampProgress = (value) => {

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, Math.round(numericValue))
    );
};


const getStepIndex = (
    progress,
    steps
) => {

    if (!steps.length) {
        return 0;
    }

    if (progress >= 100) {
        return steps.length - 1;
    }

    const index =
        Math.floor(
            (progress / 100) *
            steps.length
        );

    return Math.min(
        index,
        steps.length - 1
    );
};


// ============================================================================
// STEP INDICATOR
// ============================================================================

const StepIndicator = ({
    steps,
    activeIndex,
    status,
}) => {

    return (
        <div className="space-y-2.5">

            {steps.map((step, index) => {

                const completed =
                    status === "success" ||
                    index < activeIndex;

                const active =
                    status === "processing" &&
                    index === activeIndex;

                return (
                    <div
                        key={step.key || index}
                        className="flex items-center gap-3"
                    >

                        {/* ----------------------------------------------------
                            ICON
                        ---------------------------------------------------- */}

                        <div
                            className={`
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                transition-colors
                                ${
                                    completed
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : active
                                            ? "border-slate-300 bg-slate-50 text-slate-700"
                                            : "border-slate-200 bg-white text-slate-300"
                                }
                            `}
                        >

                            {completed ? (
                                <CheckIcon size={12} />
                            ) : active ? (
                                <span
                                    className="
                                        h-2
                                        w-2
                                        animate-pulse
                                        rounded-full
                                        bg-slate-700
                                    "
                                />
                            ) : (
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-slate-200
                                    "
                                />
                            )}

                        </div>


                        {/* ----------------------------------------------------
                            LABEL
                        ---------------------------------------------------- */}

                        <span
                            className={`
                                text-xs
                                transition-colors
                                ${
                                    completed
                                        ? "font-medium text-slate-700"
                                        : active
                                            ? "font-medium text-slate-900"
                                            : "text-slate-400"
                                }
                            `}
                        >
                            {step.label}
                        </span>

                    </div>
                );

            })}

        </div>
    );
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const OCRProgress = ({
    progress = 0,
    status = "processing",
    fileName = "",
    fileSize = "",
    currentStep = "",
    steps = DEFAULT_STEPS,
    message = "",
    autoProgress = false,
    onCancel,
    onRetry,
    onComplete,
}) => {

    // ------------------------------------------------------------------------
    // NORMALIZE PROGRESS
    // ------------------------------------------------------------------------

    const normalizedProgress =
        clampProgress(progress);


    // ------------------------------------------------------------------------
    // INTERNAL DEMO / VISUAL PROGRESS
    // ------------------------------------------------------------------------

    const [visualProgress, setVisualProgress] =
        useState(normalizedProgress);


    useEffect(() => {

        setVisualProgress(
            normalizedProgress
        );

    }, [normalizedProgress]);


    useEffect(() => {

        if (
            !autoProgress ||
            status !== "processing"
        ) {
            return undefined;
        }


        const timer = setInterval(() => {

            setVisualProgress((current) => {

                if (current >= 94) {
                    return current;
                }

                return Math.min(
                    current + 1,
                    94
                );

            });

        }, 250);


        return () => {
            clearInterval(timer);
        };

    }, [
        autoProgress,
        status,
    ]);


    // ------------------------------------------------------------------------
    // CURRENT STEP
    // ------------------------------------------------------------------------

    const activeStepIndex =
        useMemo(() => {

            if (currentStep) {

                const index =
                    steps.findIndex(
                        (step) =>
                            step.key ===
                            currentStep
                    );

                if (index >= 0) {
                    return index;
                }

            }

            return getStepIndex(
                visualProgress,
                steps
            );

        }, [
            currentStep,
            steps,
            visualProgress,
        ]);


    // ------------------------------------------------------------------------
    // STATUS CONTENT
    // ------------------------------------------------------------------------

    const statusContent = {

        processing: {
            title: "Reading your document",
            description:
                message ||
                "EverKeep AI is extracting useful information from this file.",
            icon: (
                <ScanIcon size={18} />
            ),
        },

        success: {
            title: "Document processed",
            description:
                message ||
                "The document has been successfully analyzed.",
            icon: (
                <CheckIcon size={18} />
            ),
        },

        error: {
            title: "OCR couldn't be completed",
            description:
                message ||
                "Something went wrong while reading the document.",
            icon: (
                <AlertIcon size={18} />
            ),
        },

        cancelled: {
            title: "Processing cancelled",
            description:
                message ||
                "Document processing was stopped.",
            icon: (
                <XIcon size={18} />
            ),
        },

    };


    const content =
        statusContent[status] ||
        statusContent.processing;


    // ------------------------------------------------------------------------
    // DISPLAY PROGRESS
    // ------------------------------------------------------------------------

    const displayProgress =
        status === "success"
            ? 100
            : status === "error" ||
              status === "cancelled"
                ? visualProgress
                : visualProgress;


    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------

    return (
        <section
            className="
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
            "
            aria-live="polite"
        >

            {/* ================================================================
                HEADER
            ================================================================ */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >

                <div className="flex min-w-0 items-center gap-3">

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-900
                            text-white
                        "
                    >
                        {content.icon}
                    </div>


                    <div className="min-w-0">

                        <h2
                            className="
                                truncate
                                text-sm
                                font-semibold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {content.title}
                        </h2>


                        <p
                            className="
                                mt-0.5
                                line-clamp-2
                                text-[11px]
                                leading-5
                                text-slate-500
                            "
                        >
                            {content.description}
                        </p>

                    </div>

                </div>


                {status === "processing" &&
                onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-lg
                            px-2.5
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                            focus:outline-none
                            focus:ring-2
                            focus:ring-slate-200
                        "
                    >
                        <XIcon size={13} />
                        Cancel
                    </button>
                ) : null}

            </div>


            {/* ================================================================
                FILE
            ================================================================ */}

            {fileName ? (
                <div
                    className="
                        mx-5
                        mt-5
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/70
                        px-4
                        py-3
                    "
                >

                    <div className="min-w-0">

                        <p
                            className="
                                truncate
                                text-xs
                                font-medium
                                text-slate-800
                            "
                        >
                            {fileName}
                        </p>


                        {fileSize ? (
                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                {fileSize}
                            </p>
                        ) : null}

                    </div>


                    <span
                        className="
                            shrink-0
                            text-xs
                            font-medium
                            tabular-nums
                            text-slate-500
                        "
                    >
                        {displayProgress}%
                    </span>

                </div>
            ) : null}


            {/* ================================================================
                PROGRESS
            ================================================================ */}

            <div className="px-5 pt-5">

                <div
                    className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    "
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={displayProgress}
                    aria-label="OCR progress"
                >

                    <div
                        className={`
                            h-full
                            rounded-full
                            transition-[width]
                            duration-500
                            ease-out
                            ${
                                status === "error"
                                    ? "bg-slate-400"
                                    : "bg-slate-900"
                            }
                        `}
                        style={{
                            width: `${displayProgress}%`,
                        }}
                    />

                </div>

            </div>


            {/* ================================================================
                BODY
            ================================================================ */}

            <div
                className="
                    grid
                    gap-7
                    px-5
                    py-6
                    sm:grid-cols-[1fr_220px]
                "
            >

                {/* ------------------------------------------------------------
                    CURRENT STATUS
                ------------------------------------------------------------ */}

                <div>

                    <div
                        className="
                            flex
                            items-baseline
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-slate-400
                                "
                            >
                                Current progress
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                {displayProgress}%
                            </p>

                        </div>


                        {status === "processing" ? (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-[11px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        animate-pulse
                                        rounded-full
                                        bg-slate-500
                                    "
                                />
                                Processing
                            </span>
                        ) : null}

                    </div>


                    {/* --------------------------------------------------------
                        CURRENT STEP
                    -------------------------------------------------------- */}

                    {steps.length > 0 ? (
                        <div className="mt-5">

                            <StepIndicator
                                steps={steps}
                                activeIndex={
                                    activeStepIndex
                                }
                                status={status}
                            />

                        </div>
                    ) : null}

                </div>


                {/* ------------------------------------------------------------
                    SIDE INFO
                ------------------------------------------------------------ */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50/60
                        p-4
                    "
                >

                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                        "
                    >
                        Status
                    </p>


                    <p
                        className="
                            mt-2
                            text-xs
                            font-medium
                            text-slate-800
                        "
                    >
                        {status === "processing"
                            ? "Analyzing document"
                            : status === "success"
                                ? "Analysis complete"
                                : status === "error"
                                    ? "Needs attention"
                                    : "Stopped"}
                    </p>


                    <p
                        className="
                            mt-1.5
                            text-[11px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {status === "processing"
                            ? "Please keep this window open while EverKeep processes the file."
                            : status === "success"
                                ? "Extracted information is ready to review."
                                : status === "error"
                                    ? "Try processing the document again."
                                    : "You can restart the OCR process whenever you're ready."}
                    </p>

                </div>

            </div>


            {/* ================================================================
                ACTIONS
            ================================================================ */}

            {(status === "error" ||
                status === "cancelled" ||
                status === "success") &&
            (onRetry || onComplete) ? (

                <div
                    className="
                        flex
                        items-center
                        justify-end
                        gap-2
                        border-t
                        border-slate-100
                        px-5
                        py-4
                    "
                >

                    {onRetry &&
                    (status === "error" ||
                        status === "cancelled") ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3.5
                                py-2
                                text-xs
                                font-medium
                                text-slate-700
                                transition
                                hover:border-slate-300
                                hover:bg-slate-50
                                focus:outline-none
                                focus:ring-2
                                focus:ring-slate-200
                            "
                        >
                            <RotateIcon size={13} />
                            Try again
                        </button>
                    ) : null}


                    {onComplete &&
                    status === "success" ? (
                        <button
                            type="button"
                            onClick={onComplete}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-xl
                                bg-slate-900
                                px-3.5
                                py-2
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-slate-800
                                focus:outline-none
                                focus:ring-2
                                focus:ring-slate-300
                                focus:ring-offset-2
                            "
                        >
                            Continue
                            <CheckIcon size={13} />
                        </button>
                    ) : null}

                </div>

            ) : null}

        </section>
    );
};


export default OCRProgress;