import { GoogleGenAI } from "@google/genai";

// ============================================================================
// GEMINI CONFIGURATION
// ============================================================================

let geminiClient = null;

// ============================================================================
// GET GEMINI CLIENT
// ============================================================================

export const getGeminiClient = () => {
    const apiKey =
        process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
        const error =
            new Error("GEMINI_API_KEY is not configured.");

        error.statusCode = 503;

        throw error;
    }

    if (!geminiClient) {
        geminiClient = new GoogleGenAI({
            apiKey,
        });
    }

    return geminiClient;
};

export default getGeminiClient;
