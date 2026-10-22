import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";
import authTokenService from "../services/authToken.service.js";


// ============================================================================
// REGISTER
// ============================================================================
// POST /api/auth/register
// ============================================================================

export const register = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
        } = req.body || {};


        const result = await registerUser({
            name,
            email,
            password,
        });


        return res.status(201).json({
            success: true,

            message:
                "Account created successfully.",

            data: result,
        });

    } catch (error) {

        console.error("Register error:", {
            name: error?.name || "Error",
            code: error?.code || error?.statusCode || "REGISTER_FAILED",
        });

        const statusCode = Number(error?.statusCode) || 400;
        return res.status(statusCode >= 400 && statusCode < 500 ? statusCode : 500).json({
            success: false,
            message: statusCode >= 400 && statusCode < 500
                ? error.message || "Unable to create account."
                : "Unable to create account.",
        });
    }
};


// ============================================================================
// LOGIN
// ============================================================================
// POST /api/auth/login
// ============================================================================

export const login = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body || {};


        const result = await loginUser({
            email,
            password,
        });


        return res.status(200).json({
            success: true,

            message:
                "Login successful.",

            data: result,
        });

    } catch (error) {

        console.error("Login error:", {
            name: error?.name || "Error",
            code: error?.code || error?.statusCode || "LOGIN_FAILED",
        });

        const statusCode = Number(error?.statusCode) || 401;
        return res.status(statusCode >= 400 && statusCode < 500 ? statusCode : 500).json({
            success: false,
            message: statusCode >= 400 && statusCode < 500
                ? error.message || "Unable to login."
                : "Unable to login.",
        });
    }
};

export const requestEmailVerification = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const result = await authTokenService.requestEmailVerification(userId);
        return res.status(200).json({
            success: true,
            message: result.alreadyVerified ? "Your email is already verified." : "Verification email sent.",
            data: result,
        });
    } catch (error) {
        const status = error?.statusCode === 404 ? 404 : error?.statusCode === 503 ? 503 : 500;
        console.error("Email verification request failed:", { name: error?.name || "Error", code: error?.code || status });
        return res.status(status).json({
            success: false,
            message: status === 503
                ? error.message
                : status === 404 ? "User not found." : "Unable to send a verification email.",
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const verified = await authTokenService.verifyEmailToken(req.body?.token);
        if (!verified) return res.status(400).json({ success: false, message: "This verification link is invalid or expired." });
        return res.status(200).json({ success: true, message: "Your email is verified." });
    } catch (error) {
        console.error("Email verification failed:", { name: error?.name || "Error", code: error?.code || "EMAIL_VERIFY_FAILED" });
        return res.status(500).json({ success: false, message: "Unable to verify this email." });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        await authTokenService.requestPasswordReset(req.body?.email);
    } catch (error) {
        // Keep this response identical for known and unknown accounts.
        console.error("Password reset request failed:", { name: error?.name || "Error", code: error?.code || "PASSWORD_RESET_REQUEST_FAILED" });
    }
    return res.status(202).json({
        success: true,
        message: "If an account matches that address and email delivery is configured, a password reset link will be sent.",
    });
};

export const resetPassword = async (req, res) => {
    try {
        await authTokenService.resetPasswordWithToken(req.body?.token, req.body?.password);
        return res.status(200).json({ success: true, message: "Password reset. Please sign in with your new password." });
    } catch (error) {
        const status = error?.statusCode === 400 ? 400 : 500;
        if (status === 500) console.error("Password reset failed:", { name: error?.name || "Error", code: error?.code || "PASSWORD_RESET_FAILED" });
        return res.status(status).json({
            success: false,
            message: status === 400 ? error.message : "Unable to reset your password.",
        });
    }
};

export const getCurrentUser = (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
    return res.status(200).json({
        success: true,
        data: {
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                avatar: user.avatar || "",
                phoneNumber: user.phoneNumber || "",
                role: user.role,
                plan: user.plan,
                isEmailVerified: Boolean(user.isEmailVerified),
            },
        },
    });
};
