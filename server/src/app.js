import express from "express";
import cors from "cors";

import assetRoutes from "./routes/asset.routes.js";
import documentRoutes from "./routes/document.routes.js";
import warrantyRoutes from "./routes/warranty.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import authRoutes from "./routes/auth.routes.js";
import familyRoutes from "./routes/family.routes.js";
import aiRoutes from "./routes/ai.routes.js";


const app = express();


// ============================================================================
// GLOBAL MIDDLEWARE
// ============================================================================

// Frontend / API communication
app.use(
    cors({
        origin: process.env.CLIENT_URL || true,
        credentials: true,
    })
);

// JSON request body
app.use(
    express.json({
        limit: "10mb",
    })
);

// URL-encoded request body
app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);


// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "EverKeep Backend API is running successfully.",
    });
});


// ============================================================================
// API ROUTES
// ============================================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/assets",
    assetRoutes
);

app.use(
    "/api/documents",
    documentRoutes
);

app.use(
    "/api/warranties",
    warrantyRoutes
);

app.use(
    "/api/calendar",
    calendarRoutes
);

app.use(
    "/api/subscriptions",
    subscriptionRoutes
);

app.use(
    "/api/family",
    familyRoutes
);

app.use(
    "/api/ai",
    aiRoutes
);


// ============================================================================
// 404 — ROUTE NOT FOUND
// ============================================================================

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use((error, req, res, next) => {
    console.error(
        "Unhandled server error:",
        error
    );

    const statusCode =
        error.statusCode ||
        error.status ||
        500;

    return res.status(statusCode).json({
        success: false,
        message:
            error.message ||
            "Internal server error.",
    });
});


export default app;