import React, {
    useCallback,
    useRef,
    useState,
} from "react";

import {
    FileText,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";


// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const DEFAULT_ACCEPTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];


// ============================================================================
// HELPERS
// ============================================================================

const formatFileSize = (bytes) => {

    if (!bytes || bytes <= 0) {
        return "0 KB";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.min(
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        ),
        units.length - 1
    );

    const value =
        bytes /
        Math.pow(1024, index);

    return `${value.toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
};


// ============================================================================
// FILE VALIDATION
// ============================================================================

const validateFile = (
    file,
    acceptedTypes,
    maxSize
) => {

    if (!file) {
        return "Please select a file.";
    }


    if (
        !acceptedTypes.includes(
            file.type
        )
    ) {
        return (
            "Unsupported file type. " +
            "Please upload a PDF or supported image."
        );
    }


    if (file.size > maxSize) {
        return (
            `File is too large. ` +
            `Maximum size is ${formatFileSize(maxSize)}.`
        );
    }


    return "";
};


// ============================================================================
// INVOICE UPLOADER
// ============================================================================
//
// Props:
//
// onFileSelect(file)
// onUpload(file)
// onRemove()
// uploading
// disabled
// maxSize
// acceptedTypes
// title
// description
//
// ============================================================================

const InvoiceUploader = ({
    onFileSelect,
    onUpload,

    onRemove,

    uploading = false,

    disabled = false,

    maxSize = DEFAULT_MAX_SIZE,

    acceptedTypes = DEFAULT_ACCEPTED_TYPES,

    title = "Upload an invoice",

    description =
        "PDF, JPG, PNG or WebP up to 10 MB.",

    className = "",
}) => {

    const inputRef = useRef(null);

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [dragging, setDragging] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================================
    // PROCESS FILE
    // =========================================================================

    const processFile = useCallback(
        (file) => {

            if (disabled || uploading) {
                return;
            }


            const validationError =
                validateFile(
                    file,
                    acceptedTypes,
                    maxSize
                );


            if (validationError) {

                setError(
                    validationError
                );

                setSelectedFile(null);

                return;
            }


            setError("");

            setSelectedFile(file);


            if (
                typeof onFileSelect ===
                "function"
            ) {
                onFileSelect(file);
            }

        },
        [
            acceptedTypes,
            disabled,
            maxSize,
            onFileSelect,
            uploading,
        ]
    );


    // =========================================================================
    // FILE INPUT
    // =========================================================================

    const handleInputChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];

        processFile(file);

        // Allows selecting the same file again.
        event.target.value = "";

    };


    // =========================================================================
    // OPEN FILE PICKER
    // =========================================================================

    const openFilePicker = () => {

        if (
            disabled ||
            uploading
        ) {
            return;
        }

        inputRef.current?.click();

    };


    // =========================================================================
    // DRAG EVENTS
    // =========================================================================

    const handleDragOver = (
        event
    ) => {

        event.preventDefault();

        if (
            disabled ||
            uploading
        ) {
            return;
        }

        setDragging(true);

    };


    const handleDragLeave = (
        event
    ) => {

        event.preventDefault();

        setDragging(false);

    };


    const handleDrop = (
        event
    ) => {

        event.preventDefault();

        setDragging(false);

        if (
            disabled ||
            uploading
        ) {
            return;
        }


        const file =
            event.dataTransfer
                ?.files?.[0];

        processFile(file);

    };


    // =========================================================================
    // REMOVE FILE
    // =========================================================================

    const handleRemove = () => {

        if (uploading) {
            return;
        }


        setSelectedFile(null);

        setError("");


        if (
            typeof onRemove ===
            "function"
        ) {
            onRemove();
        }

    };


    // =========================================================================
    // UPLOAD
    // =========================================================================

    const handleUpload = async () => {

        if (
            !selectedFile ||
            uploading ||
            disabled
        ) {
            return;
        }


        if (
            typeof onUpload ===
            "function"
        ) {
            await onUpload(
                selectedFile
            );
        }

    };


    // =========================================================================
    // ACCEPT ATTRIBUTE
    // =========================================================================

    const acceptAttribute =
        acceptedTypes.join(",");


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <section
            className={`
                w-full
                ${className}
            `}
        >

            {/* =================================================================
                HIDDEN INPUT
            ================================================================= */}

            <input
                ref={inputRef}
                type="file"
                accept={acceptAttribute}
                onChange={
                    handleInputChange
                }
                disabled={
                    disabled ||
                    uploading
                }
                className="hidden"
            />


            {/* =================================================================
                HEADER
            ================================================================= */}

            <div
                className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        {title}
                    </h2>


                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {/* =================================================================
                SELECTED FILE
            ================================================================= */}

            {selectedFile ? (

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            p-4
                        "
                    >

                        {/* -----------------------------------------------------
                            FILE ICON
                        ----------------------------------------------------- */}

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-slate-100
                            "
                        >

                            <FileText
                                size={18}
                                strokeWidth={1.8}
                                className="
                                    text-slate-600
                                "
                            />

                        </div>


                        {/* -----------------------------------------------------
                            FILE DETAILS
                        ----------------------------------------------------- */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >

                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-slate-900
                                "
                                title={
                                    selectedFile.name
                                }
                            >
                                {selectedFile.name}
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {formatFileSize(
                                    selectedFile.size
                                )}
                            </p>

                        </div>


                        {/* -----------------------------------------------------
                            VALID STATUS
                        ----------------------------------------------------- */}

                        <CheckCircle2
                            size={17}
                            strokeWidth={1.8}
                            className="
                                shrink-0
                                text-emerald-600
                            "
                        />


                        {/* -----------------------------------------------------
                            REMOVE
                        ----------------------------------------------------- */}

                        <button
                            type="button"
                            onClick={
                                handleRemove
                            }
                            disabled={
                                uploading
                            }
                            aria-label="Remove selected file"
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition-colors
                                hover:bg-slate-100
                                hover:text-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-slate-300
                            "
                        >

                            <X
                                size={16}
                                strokeWidth={1.8}
                            />

                        </button>

                    </div>


                    {/* ---------------------------------------------------------
                        UPLOAD ACTION
                    --------------------------------------------------------- */}

                    {typeof onUpload ===
                        "function" && (

                        <div
                            className="
                                border-t
                                border-slate-100
                                px-4
                                py-3
                            "
                        >

                            <button
                                type="button"
                                onClick={
                                    handleUpload
                                }
                                disabled={
                                    uploading ||
                                    disabled
                                }
                                className="
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-slate-900
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    hover:bg-slate-800
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-slate-400
                                    focus-visible:ring-offset-2
                                "
                            >

                                {uploading ? (

                                    <>
                                        <Loader2
                                            size={16}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        Processing...
                                    </>

                                ) : (

                                    <>
                                        <Upload
                                            size={16}
                                            strokeWidth={1.8}
                                        />

                                        Analyze invoice
                                    </>

                                )}

                            </button>

                        </div>

                    )}

                </div>

            ) : (

                /* =============================================================
                    DROPZONE
                ============================================================= */

                <button
                    type="button"
                    onClick={
                        openFilePicker
                    }
                    onDragOver={
                        handleDragOver
                    }
                    onDragLeave={
                        handleDragLeave
                    }
                    onDrop={
                        handleDrop
                    }
                    disabled={
                        disabled ||
                        uploading
                    }
                    className={`
                        group
                        flex
                        min-h-[190px]
                        w-full
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        px-6
                        py-8
                        text-center
                        transition-all
                        duration-200
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-slate-300
                        focus-visible:ring-offset-2

                        ${
                            dragging
                                ? `
                                    border-slate-400
                                    bg-slate-50
                                `
                                : `
                                    border-slate-200
                                    bg-white
                                    hover:border-slate-300
                                    hover:bg-slate-50/60
                                `
                        }

                        ${
                            disabled ||
                            uploading
                                ? `
                                    cursor-not-allowed
                                    opacity-60
                                `
                                : `
                                    cursor-pointer
                                `
                        }
                    `}
                >

                    {/* ---------------------------------------------------------
                        UPLOAD ICON
                    --------------------------------------------------------- */}

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            transition-transform
                            duration-200
                            group-hover:-translate-y-0.5
                        "
                    >

                        <Upload
                            size={19}
                            strokeWidth={1.8}
                            className="
                                text-slate-600
                            "
                        />

                    </div>


                    {/* ---------------------------------------------------------
                        TEXT
                    --------------------------------------------------------- */}

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-900
                        "
                    >
                        Drop your invoice here
                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        or click to browse
                    </p>

                </button>

            )}


            {/* =================================================================
                ERROR
            ================================================================= */}

            {error && (

                <div
                    className="
                        mt-3
                        flex
                        items-start
                        gap-2.5
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50/60
                        px-3.5
                        py-3
                    "
                    role="alert"
                >

                    <AlertCircle
                        size={15}
                        strokeWidth={1.8}
                        className="
                            mt-0.5
                            shrink-0
                            text-red-600
                        "
                    />


                    <p
                        className="
                            text-xs
                            leading-5
                            text-red-700
                        "
                    >
                        {error}
                    </p>

                </div>

            )}

        </section>

    );
};


// ============================================================================
// EXPORT
// ============================================================================

export default React.memo(
    InvoiceUploader
);