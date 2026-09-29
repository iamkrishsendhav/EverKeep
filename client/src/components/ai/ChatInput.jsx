import {
    useEffect,
    useRef,
    useState,
} from "react";


// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_LENGTH = 4000;


// ============================================================================
// ICONS
// ============================================================================

const SendIcon = () => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4Z" />
    </svg>
);


const StopIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
        />
    </svg>
);


const PlusIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);


// ============================================================================
// CHAT INPUT
// ============================================================================
//
// Props:
//
// onSend(message)
// isLoading
// onStop()
// disabled
// placeholder
// maxLength
//
// ============================================================================

const ChatInput = ({
    onSend,
    isLoading = false,
    onStop,
    disabled = false,
    placeholder = "Message EverKeep AI...",
    maxLength = MAX_LENGTH,
}) => {

    const [value, setValue] =
        useState("");

    const textareaRef =
        useRef(null);


    // =========================================================================
    // AUTO RESIZE
    // =========================================================================

    const resizeTextarea = () => {

        const textarea =
            textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        const maxHeight = 180;

        textarea.style.height =
            `${Math.min(
                textarea.scrollHeight,
                maxHeight
            )}px`;
    };


    useEffect(() => {
        resizeTextarea();
    }, [value]);


    // =========================================================================
    // FOCUS
    // =========================================================================

    useEffect(() => {

        if (
            !disabled &&
            !isLoading
        ) {
            textareaRef.current?.focus();
        }

    }, [disabled, isLoading]);


    // =========================================================================
    // SEND MESSAGE
    // =========================================================================

    const handleSend = () => {

        const message =
            value.trim();

        if (
            !message ||
            disabled ||
            isLoading
        ) {
            return;
        }

        if (message.length > maxLength) {
            return;
        }

        onSend?.(message);

        setValue("");

        requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
    };


    // =========================================================================
    // KEYBOARD HANDLER
    // =========================================================================

    const handleKeyDown = (event) => {

        // ------------------------------------------------------------
        // Enter = send
        // Shift + Enter = new line
        // ------------------------------------------------------------

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSend();

        }

    };


    // =========================================================================
    // INPUT HANDLER
    // =========================================================================

    const handleChange = (event) => {

        const nextValue =
            event.target.value;

        if (
            nextValue.length <= maxLength
        ) {
            setValue(nextValue);
        }

    };


    // =========================================================================
    // STOP GENERATION
    // =========================================================================

    const handleStop = () => {

        onStop?.();

    };


    // =========================================================================
    // STATE
    // =========================================================================

    const hasMessage =
        value.trim().length > 0;

    const remaining =
        maxLength - value.length;

    const isNearLimit =
        remaining <= 300;


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            className="
                border-t
                border-slate-100
                bg-white
                px-3
                pb-4
                pt-3
                sm:px-6
                sm:pb-5
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-4xl
                "
            >

                {/* ============================================================
                    COMPOSER
                ============================================================ */}

                <div
                    className="
                        relative
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-[0_4px_20px_rgba(15,23,42,0.06)]
                        transition
                        focus-within:border-slate-300
                        focus-within:shadow-[0_6px_24px_rgba(15,23,42,0.08)]
                    "
                >

                    {/* ========================================================
                        TEXTAREA
                    ======================================================== */}

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={
                            disabled ||
                            isLoading
                        }
                        placeholder={
                            placeholder
                        }
                        rows={1}
                        maxLength={maxLength}
                        spellCheck="true"
                        autoComplete="off"
                        className="
                            block
                            max-h-[180px]
                            min-h-[56px]
                            w-full
                            resize-none
                            overflow-y-auto
                            bg-transparent
                            px-4
                            pb-14
                            pt-4
                            text-sm
                            leading-6
                            text-slate-800
                            outline-none
                            placeholder:text-slate-400
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        aria-label="Message EverKeep AI"
                    />


                    {/* ========================================================
                        BOTTOM TOOLBAR
                    ======================================================== */}

                    <div
                        className="
                            absolute
                            bottom-2
                            left-2
                            right-2
                            flex
                            items-center
                            justify-between
                        "
                    >

                        {/* ----------------------------------------------------
                            LEFT ACTIONS
                        ---------------------------------------------------- */}

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >

                            <button
                                type="button"
                                disabled={
                                    disabled ||
                                    isLoading
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                                aria-label="Add attachment"
                                title="Attachments coming soon"
                            >
                                <PlusIcon />
                            </button>

                        </div>


                        {/* ----------------------------------------------------
                            RIGHT ACTIONS
                        ---------------------------------------------------- */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            {/* Character count */}

                            {isNearLimit && (
                                <span
                                    className="
                                        text-[10px]
                                        font-medium
                                        tabular-nums
                                        text-slate-400
                                    "
                                >
                                    {remaining}
                                </span>
                            )}


                            {/* Send / Stop */}

                            {isLoading ? (

                                <button
                                    type="button"
                                    onClick={
                                        handleStop
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-slate-900
                                        text-white
                                        transition
                                        hover:bg-slate-800
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-slate-300
                                    "
                                    aria-label="Stop generating"
                                    title="Stop generating"
                                >
                                    <StopIcon />
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={
                                        handleSend
                                    }
                                    disabled={
                                        disabled ||
                                        !hasMessage
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-slate-900
                                        text-white
                                        transition
                                        hover:bg-slate-800
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-slate-300
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-200
                                        disabled:text-slate-400
                                    "
                                    aria-label="Send message"
                                    title="Send message"
                                >
                                    <SendIcon />
                                </button>

                            )}

                        </div>

                    </div>

                </div>


                {/* ============================================================
                    FOOTER HINT
                ============================================================ */}

                <div
                    className="
                        mt-2
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        px-2
                        text-[10px]
                        text-slate-400
                    "
                >

                    <span>
                        EverKeep AI can make mistakes.
                    </span>

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        •
                    </span>

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        Enter to send
                    </span>

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        •
                    </span>

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        Shift + Enter for new line
                    </span>

                </div>

            </div>

        </div>
    );
};


export default ChatInput;