import dotenv from "dotenv";

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

dotenv.config();


// ============================================================================
// APPLICATION IMPORTS
// ============================================================================

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";


// ============================================================================
// SERVER CONFIGURATION
// ============================================================================

const PORT = Number(process.env.PORT) || 5000;


// ============================================================================
// CLOUDINARY CONFIGURATION CHECK
// ============================================================================

console.log("Cloudinary configuration:", {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key
        ? "configured"
        : "missing",
});


// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {
    try {

        // Connect to MongoDB before starting the HTTP server
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `EverKeep API running on http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Server startup error:",
            error
        );

        process.exit(1);
    }
};


// ============================================================================
// BOOTSTRAP APPLICATION
// ============================================================================

startServer();