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
                userId
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

        console.error(
            "AI chat error:",
            error?.message || error
        );


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