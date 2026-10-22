import "./config/loadEnv.js";

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

// ============================================================================
// APPLICATION IMPORTS
// ============================================================================

import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import { startReminderScheduler } from "./services/reminderScheduler.js";
import { getNotificationDeliveryStatus } from "./services/notification.service.js";
import Notification from "./models/Notification.js";
import { validateEnvironment } from "./config/validateEnv.js";


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

const deliveryStatus = getNotificationDeliveryStatus();
console.info("Notification delivery configuration:", deliveryStatus);
if (!deliveryStatus.whatsappCredentialsConfigured) {
    console.warn("WhatsApp delivery needs TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN or TWILIO_API_KEY plus TWILIO_API_SECRET, and a valid TWILIO_WHATSAPP_FROM.");
} else if (!deliveryStatus.whatsappConfigured) {
    console.warn("WhatsApp delivery needs TWILIO_WHATSAPP_SANDBOX=true for Sandbox or TWILIO_WHATSAPP_CONTENT_SID for production templates.");
}
if (deliveryStatus.whatsappConfigured && !deliveryStatus.whatsappStatusCallbackConfigured) {
    console.warn("WhatsApp handset delivery status callbacks need TWILIO_AUTH_TOKEN and TWILIO_STATUS_CALLBACK_URL.");
}


// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {
    try {

        validateEnvironment();

        // Connect to MongoDB before starting the HTTP server
        await connectDB();
        await Notification.createIndexes();
        startReminderScheduler();

        app.listen(PORT, () => {
            console.log(
                `EverKeep API running on http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.error("Server startup error:", {
            name: error?.name || "Error",
            code: error?.code || "STARTUP_FAILED",
        });

        process.exit(1);
    }
};


// ============================================================================
// BOOTSTRAP APPLICATION
// ============================================================================

startServer();
