import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";

import assetRoutes from "./routes/asset.routes.js";
import documentRoutes from "./routes/document.routes.js";
import warrantyRoutes from "./routes/warranty.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import authRoutes from "./routes/auth.routes.js";
import familyRoutes from "./routes/family.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { handleTwilioMessageStatus } from "./controllers/twilioWebhook.controller.js";

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
        try {
            return new URL(origin).origin;
        } catch {
            return origin;
        }
    });

const makeRateLimiter = (windowMs, limit, message) => rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { success: false, message },
});

const authRateLimit = makeRateLimiter(15 * 60 * 1000, 20, "Too many authentication attempts. Please try again later.");
const aiRateLimit = makeRateLimiter(15 * 60 * 1000, 30, "Too many AI requests. Please try again later.");
const notificationTestRateLimit = makeRateLimiter(60 * 60 * 1000, 5, "Too many notification test requests. Please try again later.");
const searchRateLimit = makeRateLimiter(60 * 1000, 60, "Too many search requests. Please try again later.");
const passwordResetRateLimit = makeRateLimiter(60 * 60 * 1000, 5, "Too many password reset requests. Please try again later.");
const verificationRateLimit = makeRateLimiter(60 * 60 * 1000, 5, "Too many verification email requests. Please try again later.");


// ============================================================================
// GLOBAL MIDDLEWARE
// ============================================================================

// Security headers for API responses.
app.use(helmet());

app.use((req, res, next) => {
    const requestId = randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    next();
});

const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (Number.isInteger(trustProxyHops) && trustProxyHops > 0 && trustProxyHops <= 10) {
    app.set("trust proxy", trustProxyHops);
}

// Frontend / API communication. Development may omit CLIENT_URL; production
// startup validation requires an explicit origin allowlist.
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || (process.env.NODE_ENV !== "production" && configuredOrigins.length === 0) || configuredOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Origin is not allowed by CORS."));
        },
        credentials: true,
    })
);

// JSON request body
app.use(
    express.json({
        limit: "1mb",
    })
);

// URL-encoded request body
app.use(
    express.urlencoded({
        extended: false,
        limit: "16kb",
        parameterLimit: 100,
    })
);

// Public callback secured by Twilio's request signature; not a message-sending API.
app.post("/api/webhooks/twilio/status", handleTwilioMessageStatus);


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

app.use("/api/auth", authRateLimit);
app.use("/api/auth/password/forgot", passwordResetRateLimit);
app.use("/api/auth/email/verification/request", verificationRateLimit);
app.use("/api/ai", aiRateLimit);
app.use("/api/notifications/test", notificationTestRateLimit);
app.use("/api/search", searchRateLimit);

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


app.use("/api/analytics", analyticsRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);


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
    const knownClientError = ["CastError", "ValidationError", "SyntaxError"].includes(error?.name);
    const statusCode = Number(error?.statusCode || error?.status) || (knownClientError ? 400 : 500);
    const safeStatus = statusCode >= 400 && statusCode < 500 ? statusCode : 500;
    console.error("Unhandled server error:", {
        requestId: req.requestId,
        name: error?.name || "Error",
        code: error?.code || error?.type || "UNHANDLED_ERROR",
    });

    return res.status(safeStatus).json({
        success: false,
        message: safeStatus === 500
            ? "Internal server error."
            : error?.type === "entity.too.large"
                ? "Request payload is too large."
                : error?.type === "entity.parse.failed"
                    ? "Invalid request payload."
                    : error?.message || "Request could not be processed.",
        requestId: req.requestId,
    });
});


export default app;
