import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Sparkles,
    RotateCcw,
} from "lucide-react";

import {
    AI_ERROR_TYPES,
    sendAIMessage,
} from "../../services/ai.service.js";

import {
    useAuth,
} from "../../context/AuthContext.jsx";

import ChatWindow from "../../components/ai/ChatWindow.jsx";
import ChatInput from "../../components/ai/ChatInput.jsx";


// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_MESSAGE_LENGTH = 2000;

const INITIAL_MESSAGE = {
    id: "everkeep-ai-welcome",
    role: "assistant",
    content:
        "Hi! I'm EverKeep AI. I can help you understand your EverKeep data, or answer general questions.",
    timestamp: new Date(),
};

const QUICK_PROMPTS = [
    "What assets do I have?",
    "Which warranties expire soon?",
    "Show my active subscriptions",
    "What can you help me with?",
];


// ============================================================================
// MESSAGE ID
// ============================================================================

const createMessageId = (prefix = "message") => {
    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
};


// ============================================================================
// NORMALIZE MESSAGE
// ============================================================================

const createMessage = (
    role,
    content
) => {
    return {
        id: createMessageId(role),
        role,
        content,
        timestamp: new Date(),
    };
};


// ============================================================================
// AI PAGE
// ============================================================================

const AI = () => {

    // ------------------------------------------------------------------------
    // AUTHENTICATED USER
    // ------------------------------------------------------------------------

    const {
        user,
    } = useAuth();


    // ------------------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------------------

    const [
        messages,
        setMessages,
    ] = useState([
        INITIAL_MESSAGE,
    ]);


    const [
        isLoading,
        setIsLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    // ------------------------------------------------------------------------
    // REQUEST LOCK
    // ------------------------------------------------------------------------
    //
    // Prevents accidental double submission.
    //
    // This is particularly important because:
    //
    // Enter key
    // + button click
    // + rapid clicking
    //
    // should never create duplicate AI requests.
    //
    // ------------------------------------------------------------------------

    const requestInFlight =
        useRef(false);


    const abortControllerRef =
        useRef(null);


    // ------------------------------------------------------------------------
    // PAGE MOUNT
    // ------------------------------------------------------------------------

    useEffect(() => {

        document.title =
            "AI Assistant - EverKeep";

        return () => {

            document.title =
                "EverKeep";

        };

    }, []);


    // =========================================================================
    // SEND MESSAGE
    // =========================================================================

    const handleSendMessage = useCallback(
        async (rawMessage) => {

            // ----------------------------------------------------------------
            // VALIDATION
            // ----------------------------------------------------------------

            if (
                typeof rawMessage !== "string"
            ) {
                return;
            }


            const message =
                rawMessage.trim();


            if (!message) {
                return;
            }


            if (
                message.length >
                MAX_MESSAGE_LENGTH
            ) {

                setError(
                    `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
                );

                return;
            }


            // ----------------------------------------------------------------
            // DUPLICATE REQUEST PROTECTION
            // ----------------------------------------------------------------

            if (
                requestInFlight.current
            ) {
                return;
            }


            requestInFlight.current = true;

            const abortController =
                new AbortController();

            abortControllerRef.current =
                abortController;

            setError("");
            setIsLoading(true);


            // ----------------------------------------------------------------
            // ADD USER MESSAGE
            // ----------------------------------------------------------------

            const userMessage =
                createMessage(
                    "user",
                    message
                );


            setMessages(
                (previousMessages) => [
                    ...previousMessages,
                    userMessage,
                ]
            );


            try {

                // ------------------------------------------------------------
                // BACKEND REQUEST
                // ------------------------------------------------------------

                const response =
                    await sendAIMessage(
                        message,
                        {
                            signal:
                                abortController.signal,
                        }
                    );


                // ------------------------------------------------------------
                // VALIDATE RESPONSE
                // ------------------------------------------------------------

                if (
                    typeof response !==
                    "string" ||
                    !response.trim()
                ) {

                    throw new Error(
                        "EverKeep AI returned an empty response."
                    );

                }


                // ------------------------------------------------------------
                // ADD AI MESSAGE
                // ------------------------------------------------------------

                const assistantMessage =
                    createMessage(
                        "assistant",
                        response.trim()
                    );


                setMessages(
                    (previousMessages) => [
                        ...previousMessages,
                        assistantMessage,
                    ]
                );


            } catch (requestError) {

                if (
                    requestError?.type ===
                    AI_ERROR_TYPES.CANCELED
                ) {
                    return;
                }

                console.error(
                    "EverKeep AI request failed:",
                    requestError
                );


                const errorMessage =
                    requestError?.message ||
                    "Something went wrong while communicating with EverKeep AI.";


                setError(
                    errorMessage
                );


            } finally {

                requestInFlight.current =
                    false;

                if (
                    abortControllerRef.current ===
                    abortController
                ) {
                    abortControllerRef.current =
                        null;
                }

                setIsLoading(false);

            }

        },
        []
    );


    // =========================================================================
    // QUICK PROMPT
    // =========================================================================

    const handleQuickPrompt = useCallback(
        (prompt) => {

            if (
                isLoading ||
                requestInFlight.current
            ) {
                return;
            }


            handleSendMessage(
                prompt
            );

        },
        [
            handleSendMessage,
            isLoading,
        ]
    );


    // =========================================================================
    // RETRY
    // =========================================================================

    const handleRetry = useCallback(
        () => {

            setError("");

            const lastUserMessage =
                [...messages]
                    .reverse()
                    .find(
                        (message) =>
                            message?.role ===
                            "user"
                    );

            if (lastUserMessage?.content) {
                handleSendMessage(
                    lastUserMessage.content
                );
            }

        },
        [
            handleSendMessage,
            messages,
        ]
    );


    // =========================================================================
    // STOP
    // =========================================================================

    const handleStop = useCallback(
        () => {
            abortControllerRef.current?.abort();
        },
        []
    );


    // =========================================================================
    // NEW CHAT
    // =========================================================================

    const handleNewChat = useCallback(
        () => {

            if (isLoading) {
                return;
            }


            setMessages([
                {
                    ...INITIAL_MESSAGE,
                    id: createMessageId(
                        "welcome"
                    ),
                    timestamp: new Date(),
                },
            ]);


            setError("");

        },
        [
            isLoading,
        ]
    );


    // =========================================================================
    // USER DISPLAY DATA
    // =========================================================================

    const userName =
        user?.name?.trim() ||
        "You";


    const userAvatar =
        user?.avatar ||
        "";


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <main
            className="
                relative
                flex
                h-full
                min-h-0
                flex-1
                flex-col
                overflow-hidden
                bg-[#fbfcfe]
            "
        >

            {/* ================================================================
                SUBTLE AI AMBIENT BACKGROUND
            ================================================================ */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-[320px]
                    w-[620px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-100/20
                    blur-3xl
                "
            />


            {/* ================================================================
                AI HEADER
            ================================================================ */}

            <header
                className="
                    relative
                    z-10
                    flex
                    h-[68px]
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-200/70
                    bg-white/85
                    px-5
                    backdrop-blur-xl
                    sm:px-7
                "
            >

                {/* ------------------------------------------------------------
                    BRAND
                ------------------------------------------------------------ */}

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
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-950
                            text-white
                            shadow-sm
                        "
                    >
                        <Sparkles
                            size={17}
                            strokeWidth={2}
                        />
                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h1
                                className="
                                    truncate
                                    text-[14px]
                                    font-semibold
                                    tracking-[-0.01em]
                                    text-slate-950
                                "
                            >
                                EverKeep AI
                            </h1>


                            <span
                                className="
                                    hidden
                                    rounded-full
                                    border
                                    border-indigo-100
                                    bg-indigo-50
                                    px-2
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-indigo-600
                                    sm:inline-flex
                                "
                            >
                                Assistant
                            </span>

                        </div>


                        <p
                            className="
                                mt-0.5
                                hidden
                                text-[11px]
                                text-slate-500
                                sm:block
                            "
                        >
                            Your intelligent EverKeep workspace
                        </p>

                    </div>

                </div>


                {/* ------------------------------------------------------------
                    ACTIONS
                ------------------------------------------------------------ */}

                <button
                    type="button"
                    onClick={handleNewChat}
                    disabled={isLoading}
                    aria-label="Start a new conversation"
                    title="New conversation"
                    className="
                        inline-flex
                        h-9
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-xs
                        font-medium
                        text-slate-600
                        shadow-sm
                        transition
                        hover:border-slate-300
                        hover:bg-slate-50
                        hover:text-slate-900
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <RotateCcw
                        size={14}
                    />

                    <span
                        className="
                            hidden
                            sm:inline
                        "
                    >
                        New chat
                    </span>

                </button>

            </header>


            {/* ================================================================
                CONVERSATION AREA
            ================================================================ */}

            <section
                className="
                    relative
                    z-[1]
                    min-h-0
                    flex-1
                    overflow-hidden
                "
            >

                <ChatWindow
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    userName={userName}
                    userAvatar={userAvatar}
                    onRetry={handleRetry}
                    onSuggestion={handleQuickPrompt}
                    quickPrompts={QUICK_PROMPTS}
                />

            </section>


            {/* ================================================================
                COMPOSER
            ================================================================ */}

            <footer
                className="
                    relative
                    z-10
                    shrink-0
                    border-t
                    border-slate-200/60
                    bg-white/80
                    px-4
                    pb-3
                    pt-3
                    backdrop-blur-xl
                    sm:px-6
                    sm:pb-4
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[820px]
                    "
                >

                    <ChatInput
                        onSend={handleSendMessage}
                        isLoading={isLoading}
                        onStop={handleStop}
                        maxLength={MAX_MESSAGE_LENGTH}
                    />


                    <p
                        className="
                            mt-2
                            text-center
                            text-[10px]
                            leading-4
                            text-slate-400
                        "
                    >
                        EverKeep AI can make mistakes. Verify important information.
                    </p>

                </div>

            </footer>

        </main>

    );
};


export default AI;
