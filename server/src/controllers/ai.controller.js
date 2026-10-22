import {
    generateAIResponse,
} from "../services/ai.service.js";


// ============================================================================
// AI CHAT CONTROLLER
// ============================================================================
//
// POST /api/ai/chat
//
// Responsibilities:
// - Validate incoming message
// - Read authenticated user
// - Call AI service
// - Return consistent API response
//
// Business logic remains inside ai.service.js.
// Authentication remains handled by authMiddleware.
// ============================================================================

export const chatWithAI = async (req, res) => {

    try {

        // ====================================================================
        // GET MESSAGE
        // ====================================================================

        const {
            message,
            history = [],
        } = req.body;


        // ====================================================================
        // VALIDATE MESSAGE
        // ====================================================================

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }

        if (!Array.isArray(history) || history.length > 12 || history.some((entry) =>
            !entry || !["user", "assistant"].includes(entry.role) ||
            typeof entry.content !== "string" || entry.content.length > 4000
        )) {
            return res.status(400).json({ success: false, message: "Conversation history is invalid or too long." });
        }


        // ====================================================================
        // GET AUTHENTICATED USER
        // ====================================================================

        const userId =
            req.user?._id ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }


        // ====================================================================
        // GENERATE AI RESPONSE
        // ====================================================================

        const aiResponse =
            await generateAIResponse(
                message.trim(),
                userId,
                history,
            );


        // ====================================================================
        // SUCCESS RESPONSE
        // ====================================================================

        return res.status(200).json({

            success: true,

            data: {
                message: aiResponse,
            },

        });

    } catch (error) {

        // ====================================================================
        // SERVER-SIDE LOGGING
        // ====================================================================

        console.error("AI chat request failed:", { code: error?.code, statusCode: error?.statusCode });


        // ====================================================================
        // ERROR RESPONSE
        // ====================================================================

        return res.status(
            error?.statusCode || 500
        ).json({

            success: false,

            message:
                error?.message ||
                "Failed to generate AI response.",

        });
    }
};
