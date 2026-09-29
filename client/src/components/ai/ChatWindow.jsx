import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";


// ============================================================================
// HELPERS
// ============================================================================

const formatMessage = (content = "") => {
    if (!content) return null;

    const lines = String(content).split("\n");

    return lines.map((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            return (
                <div
                    key={index}
                    className="h-2"
                />
            );
        }

        // ------------------------------------------------------------
        // Bullet point
        // ------------------------------------------------------------

        if (
            trimmedLine.startsWith("- ") ||
            trimmedLine.startsWith("• ")
        ) {
            return (
                <div
                    key={index}
                    className="flex gap-2"
                >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />

                    <span>
                        {trimmedLine
                            .replace(/^[-•]\s*/, "")
                            .trim()}
                    </span>
                </div>
            );
        }

        // ------------------------------------------------------------
        // Numbered list
        // ------------------------------------------------------------

        const numberedMatch =
            trimmedLine.match(/^(\d+)\.\s+(.*)$/);

        if (numberedMatch) {
            return (
                <div
                    key={index}
                    className="flex gap-3"
                >
                    <span
                        className="
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-[11px]
                            font-semibold
                            text-slate-600
                        "
                    >
                        {numberedMatch[1]}
                    </span>

                    <span>
                        {numberedMatch[2]}
                    </span>
                </div>
            );
        }

        // ------------------------------------------------------------
        // Heading
        // ------------------------------------------------------------

        if (
            trimmedLine.startsWith("### ")
        ) {
            return (
                <h4
                    key={index}
                    className="
                        mt-3
                        text-sm
                        font-semibold
                        text-slate-900
                    "
                >
                    {trimmedLine.replace(
                        /^###\s*/,
                        ""
                    )}
                </h4>
            );
        }

        if (
            trimmedLine.startsWith("## ")
        ) {
            return (
                <h3
                    key={index}
                    className="
                        mt-3
                        text-base
                        font-semibold
                        text-slate-900
                    "
                >
                    {trimmedLine.replace(
                        /^##\s*/,
                        ""
                    )}
                </h3>
            );
        }

        // ------------------------------------------------------------
        // Normal paragraph
        // ------------------------------------------------------------

        return (
            <p
                key={index}
                className="min-h-[1.4rem]"
            >
                {formatInlineText(trimmedLine)}
            </p>
        );
    });
};


// ============================================================================
// INLINE TEXT FORMATTER
// ============================================================================

const formatInlineText = (text) => {
    const parts =
        text.split(
            /(\*\*[^*]+\*\*|`[^`]+`)/g
        );

    return parts.map(
        (part, index) => {

            if (
                part.startsWith("**") &&
                part.endsWith("**")
            ) {
                return (
                    <strong
                        key={index}
                        className="font-semibold text-slate-900"
                    >
                        {part.slice(2, -2)}
                    </strong>
                );
            }

            if (
                part.startsWith("`") &&
                part.endsWith("`")
            ) {
                return (
                    <code
                        key={index}
                        className="
                            rounded-md
                            bg-slate-100
                            px-1.5
                            py-0.5
                            font-mono
                            text-[12px]
                            text-slate-700
                        "
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }

            return (
                <span key={index}>
                    {part}
                </span>
            );
        }
    );
};


// ============================================================================
// AI ICON
// ============================================================================

const AIIcon = () => (
    <div
        className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            shadow-sm
        "
        aria-hidden="true"
    >
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="4"
                y="6"
                width="16"
                height="13"
                rx="3"
            />

            <path d="M9 10h.01" />
            <path d="M15 10h.01" />

            <path d="M9 15h6" />

            <path d="M12 3v3" />
        </svg>
    </div>
);


// ============================================================================
// USER ICON
// ============================================================================

const UserIcon = ({
    name = "You",
}) => {

    const initial =
        name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "Y";

    return (
        <div
            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-slate-900
                text-[11px]
                font-semibold
                text-white
            "
            aria-hidden="true"
        >
            {initial}
        </div>
    );
};


// ============================================================================
// COPY ICON
// ============================================================================

const CopyIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="2"
        />

        <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        />
    </svg>
);


// ============================================================================
// REFRESH ICON
// ============================================================================

const RefreshIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 11a8.1 8.1 0 0 0-15.5-3" />

        <path d="M4 4v4h4" />

        <path d="M4 13a8.1 8.1 0 0 0 15.5 3" />

        <path d="M20 20v-4h-4" />
    </svg>
);


// ============================================================================
// MORE ICON
// ============================================================================

const MoreIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle
            cx="5"
            cy="12"
            r="1"
        />

        <circle
            cx="12"
            cy="12"
            r="1"
        />

        <circle
            cx="19"
            cy="12"
            r="1"
        />
    </svg>
);


// ============================================================================
// LOADING DOTS
// ============================================================================

const ThinkingIndicator = () => (
    <div
        className="
            flex
            items-center
            gap-2
            py-1
        "
        aria-label="EverKeep AI is thinking"
    >
        <span
            className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-slate-400
            "
        />

        <span
            className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-slate-400
                [animation-delay:150ms]
            "
        />

        <span
            className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-slate-400
                [animation-delay:300ms]
            "
        />
    </div>
);


// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyConversation = ({
    onSuggestion,
    suggestions = [
        "What assets do I have?",
        "Which warranties expire soon?",
        "Give me an overview of my EverKeep data.",
    ],
}) => {

    return (
        <div
            className="
                flex
                min-h-full
                flex-col
                items-center
                justify-center
                px-6
                py-16
            "
        >

            {/* ------------------------------------------------------------
                AI MARK
            ------------------------------------------------------------ */}

            <AIIcon />


            {/* ------------------------------------------------------------
                TITLE
            ------------------------------------------------------------ */}

            <h2
                className="
                    mt-5
                    text-xl
                    font-semibold
                    tracking-tight
                    text-slate-900
                "
            >
                How can I help?
            </h2>


            {/* ------------------------------------------------------------
                DESCRIPTION
            ------------------------------------------------------------ */}

            <p
                className="
                    mt-2
                    max-w-md
                    text-center
                    text-sm
                    leading-6
                    text-slate-500
                "
            >
                Ask EverKeep AI about your assets,
                warranties, subscriptions, documents,
                or other information in your account.
            </p>


            {/* ------------------------------------------------------------
                SUGGESTIONS
            ------------------------------------------------------------ */}

            <div
                className="
                    mt-7
                    flex
                    max-w-2xl
                    flex-wrap
                    justify-center
                    gap-2
                "
            >
                {suggestions.map(
                    (suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() =>
                                onSuggestion?.(
                                    suggestion
                                )
                            }
                            className="
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2
                                text-xs
                                font-medium
                                text-slate-600
                                transition
                                hover:border-slate-300
                                hover:bg-slate-50
                                hover:text-slate-900
                                focus:outline-none
                                focus:ring-2
                                focus:ring-slate-200
                            "
                        >
                            {suggestion}
                        </button>
                    )
                )}
            </div>

        </div>
    );
};


// ============================================================================
// AI MESSAGE ACTIONS
// ============================================================================

const MessageActions = ({
    content,
    onRegenerate,
}) => {

    const [copied, setCopied] =
        useState(false);


    const handleCopy = async () => {

        try {

            await navigator.clipboard.writeText(
                content || ""
            );

            setCopied(true);

            window.setTimeout(
                () => setCopied(false),
                1600
            );

        } catch (error) {

            console.error(
                "Unable to copy AI response:",
                error
            );

        }
    };


    return (
        <div
            className="
                mt-3
                flex
                items-center
                gap-1
                opacity-0
                transition-opacity
                duration-150
                group-hover:opacity-100
                group-focus-within:opacity-100
            "
        >

            <button
                type="button"
                onClick={handleCopy}
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2
                    py-1.5
                    text-[11px]
                    font-medium
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                "
                aria-label="Copy response"
            >
                <CopyIcon />

                {copied
                    ? "Copied"
                    : "Copy"}
            </button>


            {onRegenerate && (
                <button
                    type="button"
                    onClick={onRegenerate}
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2
                        py-1.5
                        text-[11px]
                        font-medium
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                    "
                >
                    <RefreshIcon />

                    Regenerate
                </button>
            )}

        </div>
    );
};


// ============================================================================
// AI MESSAGE
// ============================================================================

const AIMessage = ({
    message,
    onRegenerate,
}) => {

    const content =
        message?.content ||
        message?.message ||
        "";


    return (
        <article
            className="
                group
                flex
                gap-3
                px-4
                py-5
                sm:px-6
            "
        >

            <AIIcon />


            <div
                className="
                    min-w-0
                    flex-1
                    pt-0.5
                "
            >

                <div
                    className="
                        mb-1
                        flex
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            text-xs
                            font-semibold
                            text-slate-800
                        "
                    >
                        EverKeep AI
                    </span>

                    <span
                        className="
                            text-[10px]
                            text-slate-400
                        "
                    >
                        AI
                    </span>
                </div>


                <div
                    className="
                        max-w-3xl
                        text-sm
                        leading-7
                        text-slate-600
                    "
                >
                    {formatMessage(content)}
                </div>


                <MessageActions
                    content={content}
                    onRegenerate={
                        onRegenerate
                            ? () =>
                                  onRegenerate(
                                      message
                                  )
                            : undefined
                    }
                />

            </div>

        </article>
    );
};


// ============================================================================
// USER MESSAGE
// ============================================================================

const UserMessage = ({
    message,
    userName,
}) => {

    const content =
        message?.content ||
        message?.message ||
        "";


    return (
        <article
            className="
                flex
                justify-end
                px-4
                py-3
                sm:px-6
            "
        >

            <div
                className="
                    flex
                    max-w-3xl
                    items-start
                    gap-3
                "
            >

                <div
                    className="
                        min-w-0
                        rounded-2xl
                        bg-slate-100
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-slate-800
                    "
                >
                    {content}
                </div>


                <UserIcon
                    name={userName}
                />

            </div>

        </article>
    );
};


// ============================================================================
// ERROR MESSAGE
// ============================================================================

const ErrorMessage = ({
    message,
    onRetry,
}) => (

    <div
        className="
            flex
            gap-3
            px-4
            py-5
            sm:px-6
        "
    >

        <AIIcon />

        <div className="min-w-0 flex-1">

            <p
                className="
                    text-xs
                    font-semibold
                    text-slate-800
                "
            >
                EverKeep AI
            </p>


            <div
                className="
                    mt-2
                    max-w-2xl
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50/60
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-red-700
                "
            >
                {message ||
                    "Something went wrong. Please try again."}
            </div>


            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        mt-2
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2
                        py-1.5
                        text-xs
                        font-medium
                        text-slate-500
                        transition
                        hover:bg-slate-100
                        hover:text-slate-800
                    "
                >
                    <RefreshIcon />

                    Try again
                </button>
            )}

        </div>

    </div>
);


// ============================================================================
// CHAT WINDOW
// ============================================================================
//
// Expected message shape:
//
// {
//     id: "1",
//     role: "user",
//     content: "What assets do I have?"
// }
//
// OR:
//
// {
//     id: "2",
//     role: "assistant",
//     content: "You currently have 3 assets."
// }
//
// Props:
//
// messages
// isLoading
// error
// userName
// onSuggestion
// onRegenerate
// onRetry
//
// ============================================================================

const ChatWindow = ({
    messages = [],
    isLoading = false,
    error = null,
    userName = "You",
    onSuggestion,
    quickPrompts = [],
    onRegenerate,
    onRetry,
}) => {

    const bottomRef =
        useRef(null);


    const scrollContainerRef =
        useRef(null);


    const [showScrollButton, setShowScrollButton] =
        useState(false);


    // =========================================================================
    // NORMALIZE MESSAGES
    // =========================================================================

    const normalizedMessages =
        useMemo(
            () =>
                Array.isArray(messages)
                    ? messages.filter(Boolean)
                    : [],
            [messages]
        );


    // =========================================================================
    // AUTO SCROLL
    // =========================================================================

    useEffect(() => {

        const container =
            scrollContainerRef.current;

        if (!container) return;


        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;


        const isNearBottom =
            distanceFromBottom < 180;


        if (
            isNearBottom ||
            normalizedMessages.length <= 1
        ) {

            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });

        }

    }, [
        normalizedMessages,
        isLoading,
    ]);


    // =========================================================================
    // SCROLL POSITION
    // =========================================================================

    const handleScroll = () => {

        const container =
            scrollContainerRef.current;

        if (!container) return;


        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;


        setShowScrollButton(
            distanceFromBottom > 300
        );

    };


    // =========================================================================
    // SCROLL TO BOTTOM
    // =========================================================================

    const scrollToBottom = () => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });

    };


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section
            className="
                relative
                flex
                min-h-0
                flex-1
                overflow-hidden
                bg-white
            "
            aria-label="EverKeep AI conversation"
        >

            {/* ================================================================
                CONVERSATION
            ================================================================ */}

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="
                    h-full
                    w-full
                    min-w-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    scroll-smooth
                "
            >

                {normalizedMessages.length === 0 ? (

                    <EmptyConversation
                        onSuggestion={
                            onSuggestion
                        }
                        suggestions={
                            quickPrompts.length > 0
                                ? quickPrompts
                                : undefined
                        }
                    />

                ) : (

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-4xl
                            pb-8
                        "
                    >

                        {normalizedMessages.map(
                            (message, index) => {

                                const role =
                                    message?.role ||
                                    message?.sender ||
                                    "assistant";


                                const key =
                                    message?.id ||
                                    `${role}-${index}`;


                                if (
                                    role === "user"
                                ) {
                                    return (
                                        <UserMessage
                                            key={key}
                                            message={message}
                                            userName={
                                                userName
                                            }
                                        />
                                    );
                                }


                                if (
                                    role === "error"
                                ) {
                                    return (
                                        <ErrorMessage
                                            key={key}
                                            message={
                                                message?.content
                                            }
                                            onRetry={
                                                onRetry
                                            }
                                        />
                                    );
                                }


                                return (
                                    <AIMessage
                                        key={key}
                                        message={message}
                                        onRegenerate={
                                            onRegenerate
                                        }
                                    />
                                );
                            }
                        )}


                        {/* ----------------------------------------------------
                            LOADING / THINKING
                        ---------------------------------------------------- */}

                        {isLoading && (
                            <div
                                className="
                                    flex
                                    gap-3
                                    px-4
                                    py-5
                                    sm:px-6
                                "
                            >

                                <AIIcon />

                                <div
                                    className="
                                        flex
                                        min-h-8
                                        items-center
                                    "
                                >
                                    <ThinkingIndicator />
                                </div>

                            </div>
                        )}


                        {/* ----------------------------------------------------
                            API ERROR
                        ---------------------------------------------------- */}

                        {error && !isLoading && (
                            <ErrorMessage
                                message={error}
                                onRetry={onRetry}
                            />
                        )}


                        <div
                            ref={bottomRef}
                            className="h-2"
                            aria-hidden="true"
                        />

                    </div>

                )}

            </div>


            {/* ================================================================
                SCROLL TO BOTTOM
            ================================================================ */}

            {showScrollButton && (
                <button
                    type="button"
                    onClick={scrollToBottom}
                    className="
                        absolute
                        bottom-5
                        left-1/2
                        flex
                        h-9
                        w-9
                        -translate-x-1/2
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        text-slate-500
                        shadow-lg
                        transition
                        hover:bg-slate-50
                        hover:text-slate-900
                    "
                    aria-label="Scroll to latest message"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                    </svg>
                </button>
            )}

        </section>
    );
};


export default ChatWindow;
