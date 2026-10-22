import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;
const MAX_BCRYPT_BYTES = 72;

export const hashOneTimeToken = (token) => createHash("sha256").update(token).digest("hex");
export const createOneTimeToken = () => {
    const token = randomBytes(32).toString("base64url");
    return { token, hash: hashOneTimeToken(token) };
};

const emailDeliveryConfigured = () => Boolean(
    process.env.RESEND_API_KEY?.trim() &&
    process.env.NOTIFICATION_EMAIL_FROM?.trim() &&
    process.env.CLIENT_URL?.trim(),
);

const clientOrigin = () => process.env.CLIENT_URL.split(",")[0].trim().replace(/\/$/, "");

const sendAuthEmail = async ({ to, subject, text }) => {
    if (!emailDeliveryConfigured()) {
        const error = new Error("Email delivery is not configured. Set RESEND_API_KEY, NOTIFICATION_EMAIL_FROM, and CLIENT_URL.");
        error.statusCode = 503;
        throw error;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: process.env.NOTIFICATION_EMAIL_FROM, to: [to], subject, text }),
        signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
        const error = new Error("Email delivery could not be confirmed.");
        error.statusCode = 503;
        throw error;
    }
};

const saveSingleUseToken = async (user, { hashField, expiryField }) => {
    const { token, hash } = createOneTimeToken();
    user[hashField] = hash;
    user[expiryField] = new Date(Date.now() + TOKEN_TTL_MS);
    await user.save();
    return { token, hash };
};

export const requestEmailVerification = async (userId) => {
    if (!emailDeliveryConfigured()) {
        const error = new Error("Email verification is unavailable until RESEND_API_KEY, NOTIFICATION_EMAIL_FROM, and CLIENT_URL are configured.");
        error.statusCode = 503;
        throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    if (user.isEmailVerified) return { alreadyVerified: true };

    const { token, hash } = await saveSingleUseToken(user, {
        hashField: "emailVerificationTokenHash",
        expiryField: "emailVerificationExpiresAt",
    });
    const link = `${clientOrigin()}/verify-email?token=${encodeURIComponent(token)}`;
    try {
        await sendAuthEmail({
            to: user.email,
            subject: "Verify your EverKeep email",
            text: `Use this link within 30 minutes to verify your EverKeep email address: ${link}\n\nIf you did not request this, you can ignore this email.`,
        });
    } catch (error) {
        await User.updateOne({ _id: user._id, emailVerificationTokenHash: hash }, {
            $unset: { emailVerificationTokenHash: 1, emailVerificationExpiresAt: 1 },
        });
        throw error;
    }
    return { sent: true };
};

export const verifyEmailToken = async (token) => {
    if (typeof token !== "string" || token.length < 30 || token.length > 200) return false;
    const user = await User.findOneAndUpdate({
        emailVerificationTokenHash: hashOneTimeToken(token),
        emailVerificationExpiresAt: { $gt: new Date() },
        isEmailVerified: { $ne: true },
    }, {
        $set: { isEmailVerified: true },
        $unset: { emailVerificationTokenHash: 1, emailVerificationExpiresAt: 1 },
    }, { new: true });
    if (!user) return false;
    return true;
};

export const requestPasswordReset = async (email) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!emailDeliveryConfigured() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return;
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || user.isActive === false) return;

    const { token, hash } = await saveSingleUseToken(user, {
        hashField: "passwordResetTokenHash",
        expiryField: "passwordResetExpiresAt",
    });
    const link = `${clientOrigin()}/reset-password?token=${encodeURIComponent(token)}`;
    try {
        await sendAuthEmail({
            to: user.email,
            subject: "Reset your EverKeep password",
            text: `Use this link within 30 minutes to reset your EverKeep password: ${link}\n\nIf you did not request this, you can ignore this email.`,
        });
    } catch (error) {
        await User.updateOne({ _id: user._id, passwordResetTokenHash: hash }, {
            $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
        });
        throw error;
    }
};

export const resetPasswordWithToken = async (token, password) => {
    if (typeof token !== "string" || token.length < 30 || token.length > 200) {
        const error = new Error("This password reset link is invalid or expired.");
        error.statusCode = 400;
        throw error;
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH || Buffer.byteLength(password, "utf8") > MAX_BCRYPT_BYTES) {
        const error = new Error(`Password must contain at least ${MIN_PASSWORD_LENGTH} characters and no more than ${MAX_BCRYPT_BYTES} UTF-8 bytes.`);
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate({
        passwordResetTokenHash: hashOneTimeToken(token),
        passwordResetExpiresAt: { $gt: new Date() },
        isActive: { $ne: false },
    }, {
        $set: { password: passwordHash },
        $inc: { tokenVersion: 1 },
        $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
    }, { new: true, runValidators: true }).select("_id");
    if (!user) {
        const error = new Error("This password reset link is invalid or expired.");
        error.statusCode = 400;
        throw error;
    }
};

export default {
    requestEmailVerification,
    verifyEmailToken,
    requestPasswordReset,
    resetPasswordWithToken,
};
