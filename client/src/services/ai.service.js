import api from "../lib/axios.js";

// ============================================================================
// EVERKEEP AI SERVICE
// ============================================================================
//
// Responsibilities:
// - Send authenticated messages to EverKeep AI
// - Validate AI responses
// - Normalize API / network / timeout errors
// - Keep UI independent from Axios/backend implementation details
//
// IMPORTANT:
// sendAIMessage() returns a STRING on success.
// This keeps compatibility with the existing AI chat components.
//
// Backend:
// POST /api/ai/chat
//
// Request:
// {
//     message: "What assets do I have?"
// }
//
// Expected response:
// {
//     success: true,
//     data: {
//         message: "You currently have..."
//     }
// }
//
// ============================================================================


// ============================================================================
// CONFIGURATION
// ============================================================================

const AI_ENDPOINT = "/ai/chat";


// ============================================================================
// ERROR TYPES
// ============================================================================

export const AI_ERROR_TYPES = Object.freeze({

    VALIDATION: "VALIDATION",

    NETWORK: "NETWORK",

    TIMEOUT: "TIMEOUT",

    AUTHENTICATION: "AUTHENTICATION",

    RATE_LIMIT: "RATE_LIMIT",

    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

    CANCELED: "CANCELED",

    INVALID_RESPONSE: "INVALID_RESPONSE",

    UNKNOWN: "UNKNOWN",

});


// ============================================================================
// CREATE AI ERROR
// ============================================================================
//
// Creates a predictable application-level error.
//
// The UI can use:
// error.type
// error.status
// error.retryable
//
// without knowing anything about Axios.
//
// ============================================================================

const createAIError = ({
    message,
    type = AI_ERROR_TYPES.UNKNOWN,
    status = null,
    retryable = false,
    originalError = null,
}) => {

    const error = new Error(message);

    error.name = "EverKeepAIError";

    error.type = type;

    error.status = status;

    error.retryable = retryable;

    error.originalError = originalError;

    return error;

};


// ============================================================================
// NORMALIZE API ERROR
// ============================================================================

const normalizeAIError = (error) => {

    const status =
        error?.response?.status;

    const backendMessage =
        error?.response?.data?.message;


    // ========================================================================
    // CANCELED REQUEST
    // ========================================================================

    if (
        error?.code === "ERR_CANCELED" ||
        error?.name === "CanceledError" ||
        error?.name === "AbortError"
    ) {

        return createAIError({

            type: AI_ERROR_TYPES.CANCELED,

            message: "Request canceled.",

            retryable: false,

            originalError: error,

        });

    }


    // ========================================================================
    // TIMEOUT
    // ========================================================================

    if (
        error?.code === "ECONNABORTED" ||
        error?.code === "ETIMEDOUT"
    ) {

        return createAIError({

            type: AI_ERROR_TYPES.TIMEOUT,

            message:
                "I'm taking a little longer than expected. Please try again.",

            retryable: true,

            originalError: error,

        });

    }


    // ========================================================================
    // NETWORK ERROR
    // ========================================================================

    if (
        error?.code === "ERR_NETWORK" ||
        (
            !error?.response &&
            !error?.request
        )
    ) {

        return createAIError({

            type: AI_ERROR_TYPES.NETWORK,

            message:
                "I'm having trouble connecting right now. Please try again.",

            retryable: true,

            originalError: error,

        });

    }


    // ========================================================================
    // AUTHENTICATION
    // ========================================================================

    if (status === 401) {

        return createAIError({

            type: AI_ERROR_TYPES.AUTHENTICATION,

            message:
                "Your session has expired. Please sign in again.",

            status,

            retryable: false,

            originalError: error,

        });

    }


    // ========================================================================
    // RATE LIMIT / QUOTA
    // ========================================================================

    if (status === 429) {

        return createAIError({

            type: AI_ERROR_TYPES.RATE_LIMIT,

            message:
                "I'm temporarily unable to respond. Please try again shortly.",

            status,

            retryable: true,

            originalError: error,

        });

    }


    // ========================================================================
    // AI SERVICE UNAVAILABLE
    // ========================================================================

    if (
        status === 502 ||
        status === 503 ||
        status === 504
    ) {

        return createAIError({

            type: AI_ERROR_TYPES.SERVICE_UNAVAILABLE,

            message:
                "I'm temporarily unavailable. Please try again in a moment.",

            status,

            retryable: true,

            originalError: error,

        });

    }


    // ========================================================================
    // BACKEND VALIDATION ERROR
    // ========================================================================

    if (
        status >= 400 &&
        status < 500 &&
        backendMessage
    ) {

        return createAIError({

            type: AI_ERROR_TYPES.UNKNOWN,

            message: backendMessage,

            status,

            retryable: false,

            originalError: error,

        });

    }


    // ========================================================================
    // GENERIC FALLBACK
    // ========================================================================

    return createAIError({

        type: AI_ERROR_TYPES.UNKNOWN,

        message:
            "I wasn't able to complete that request. Please try again.",

        status,

        retryable: true,

        originalError: error,

    });

};


// ============================================================================
// SEND AI MESSAGE
// ============================================================================
//
// @param {string} message
// @returns {Promise<string>}
//
// IMPORTANT:
// SUCCESS VALUE IS A STRING.
//
// ============================================================================

export const sendAIMessage = async (
    message,
    options = {},
) => {

    // ========================================================================
    // CLIENT VALIDATION
    // ========================================================================

    if (
        typeof message !== "string" ||
        !message.trim()
    ) {

        throw createAIError({

            type: AI_ERROR_TYPES.VALIDATION,

            message:
                "Message cannot be empty.",

            retryable: false,

        });

    }


    const normalizedMessage =
        message.trim();


    // ========================================================================
    // API REQUEST
    // ========================================================================

    try {

        const response =
            await api.post(

                AI_ENDPOINT,

                {
                    message: normalizedMessage,
                },

                {
                    signal: options?.signal,
                },

            );


        // ====================================================================
        // RESPONSE
        // ====================================================================

        const responseData =
            response?.data;


        const aiMessage =
            responseData?.data?.message ??
            responseData?.message;


        // ====================================================================
        // VALIDATE SUCCESS RESPONSE
        // ====================================================================

        if (
            responseData?.success !== true ||
            typeof aiMessage !== "string" ||
            !aiMessage.trim()
        ) {

            throw createAIError({

                type:
                    AI_ERROR_TYPES.INVALID_RESPONSE,

                message:
                    "I couldn't generate a response this time. Please try again.",

                retryable: true,

            });

        }


        // ====================================================================
        // RETURN STRING
        // ====================================================================
        //
        // DO NOT CHANGE THIS TO AN OBJECT.
        //
        // Existing ChatWindow / AI hooks expect:
        //
        // const reply = await sendAIMessage(message);
        //
        // setMessages(...content: reply)
        //
        // ====================================================================

        return aiMessage.trim();

    } catch (error) {

        // ====================================================================
        // KEEP OUR NORMALIZED ERRORS
        // ====================================================================

        if (
            error?.name === "EverKeepAIError"
        ) {

            throw error;

        }


        // ====================================================================
        // NORMALIZE AXIOS / BACKEND ERRORS
        // ====================================================================

        throw normalizeAIError(error);

    }

};


// ============================================================================
// AI SERVICE
// ============================================================================

const aiService = {

    sendMessage: sendAIMessage,

};


export default aiService;
