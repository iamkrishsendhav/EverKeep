import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("API KEY EXISTS:", Boolean(apiKey));

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
    apiKey,
});

try {
    console.log("Testing Gemini...");

    const response = await ai.models.generateContent({
         model: "gemini-3.6-flash",
        contents: "Say hello in one sentence.",
    });

    console.log("\nSUCCESS:");
    console.log(response.text);

} catch (error) {

    console.error("\nGEMINI FAILED");

    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Message:", error?.message);

}