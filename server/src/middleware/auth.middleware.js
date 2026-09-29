import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model.js";


// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
//
// Responsibilities:
// - Read JWT from Authorization header
// - Verify JWT
// - Validate authenticated user
// - Attach safe user data to req.user
// - Allow protected routes to continue
//
// Expected header:
//
// Authorization: Bearer <token>
//
// ============================================================================

const authMiddleware = async (req, res, next) => {
    try {

        // =====================================================================
        // 1. READ AUTHORIZATION HEADER
        // =====================================================================

        const authorization =
            req.headers.authorization?.trim();


        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }


        // =====================================================================
        // 2. VALIDATE BEARER TOKEN FORMAT
        // =====================================================================

        const [scheme, token] =
            authorization.split(/\s+/);


        if (
            scheme?.toLowerCase() !== "bearer" ||
            !token
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authentication format. Use Bearer <token>.",
            });
        }


        // =====================================================================
        // 3. CHECK JWT SECRET CONFIGURATION
        // =====================================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is not configured."
            );

            return res.status(500).json({
                success: false,
                message:
                    "Authentication service is not configured.",
            });
        }


        // =====================================================================
        // 4. VERIFY JWT
        // =====================================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =====================================================================
        // 5. VALIDATE JWT PAYLOAD
        // =====================================================================

        const userId =
            decoded?.id ||
            decoded?._id ||
            decoded?.userId;


        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authentication token.",
            });
        }


        // =====================================================================
        // 6. FIND AUTHENTICATED USER
        // =====================================================================

        const user =
            await User
                .findById(userId)
                .select("-password");


        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "User associated with this token no longer exists.",
            });
        }


        // =====================================================================
        // 7. CHECK ACCOUNT STATUS
        // =====================================================================

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is inactive.",
            });
        }


        // =====================================================================
        // 8. ATTACH AUTHENTICATED USER
        // =====================================================================

        req.user = user;


        // =====================================================================
        // 9. CONTINUE REQUEST
        // =====================================================================

        return next();

    } catch (error) {

        // =====================================================================
        // JWT EXPIRED
        // =====================================================================

        if (
            error?.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication token has expired.",
            });
        }


        // =====================================================================
        // JWT INVALID
        // =====================================================================

        if (
            error?.name === "JsonWebTokenError"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authentication token.",
            });
        }


        // =====================================================================
        // JWT NOT ACTIVE
        // =====================================================================

        if (
            error?.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication token is not active yet.",
            });
        }


        // =====================================================================
        // DATABASE / UNEXPECTED ERROR
        // =====================================================================

        console.error(
            "Authentication middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to authenticate request.",
        });
    }
};


export default authMiddleware;