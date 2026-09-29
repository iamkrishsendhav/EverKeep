import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

// ============================================================================
// AUTH SERVICE
// ============================================================================
//
// Responsible for:
// - Registering users
// - Validating login credentials
// - Hashing passwords
// - Comparing passwords
// - Generating JWT tokens
// - Returning safe user data
//
// Controllers handle HTTP.
// Services handle authentication and business logic.
//
// ============================================================================

// ============================================================================
// AUTH ERROR
// ============================================================================

const createAuthError = (message, statusCode = 400) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
};

// ============================================================================
// JWT CONFIGURATION
// ============================================================================

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET?.trim();

    if (!secret) {
        throw createAuthError("JWT_SECRET is not configured.", 500);
    }

    return secret;
};

const getJwtExpiration = () => {
    return process.env.JWT_EXPIRES_IN || "7d";
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ============================================================================
// SAFE USER
// ============================================================================
//
// Password must never be returned to the frontend.
//
// ============================================================================

const sanitizeUser = (user) => {
    const userObject = user?.toObject ? user.toObject() : { ...user };

    delete userObject.password;

    return userObject;
};

// ============================================================================
// GENERATE JWT
// ============================================================================

const generateToken = (user) => {
    if (!user?._id) {
        throw createAuthError("Unable to generate authentication token.", 500);
    }

    return jwt.sign(
        {
            id: user._id.toString(),
        },

        getJwtSecret(),

        {
            expiresIn: getJwtExpiration(),
        },
    );
};

// ============================================================================
// REGISTER USER
// ============================================================================

export const registerUser = async ({ name, email, password }) => {
    // ------------------------------------------------------------------------
    // NORMALIZE INPUT
    // ------------------------------------------------------------------------

    const normalizedName = typeof name === "string" ? name.trim() : "";

    const normalizedEmail =
        typeof email === "string" ? email.trim().toLowerCase() : "";

    // ------------------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------------------

    if (!normalizedName) {
        throw createAuthError("Name is required.");
    }

    if (!normalizedEmail) {
        throw createAuthError("Email is required.");
    }

    if (!isValidEmail(normalizedEmail)) {
        throw createAuthError("Please provide a valid email address.");
    }

    if (typeof password !== "string" || !password) {
        throw createAuthError("Password is required.");
    }

    if (normalizedName.length < 2) {
        throw createAuthError("Name must contain at least 2 characters.");
    }

    if (password.length < 6) {
        throw createAuthError("Password must contain at least 6 characters.");
    }

    // ------------------------------------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------------------------------------

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw createAuthError("An account with this email already exists.", 409);
    }

    // ------------------------------------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    // ------------------------------------------------------------------------
    // CREATE USER
    // ------------------------------------------------------------------------

    const user = await User.create({
        name: normalizedName,

        email: normalizedEmail,

        password: hashedPassword,
    });

    // ------------------------------------------------------------------------
    // GENERATE JWT
    // ------------------------------------------------------------------------

    const token = generateToken(user);

    // ------------------------------------------------------------------------
    // RETURN SAFE AUTH DATA
    // ------------------------------------------------------------------------

    return {
        user: sanitizeUser(user),

        token,
    };
};

// ============================================================================
// LOGIN USER
// ============================================================================

export const loginUser = async ({ email, password }) => {
    // ------------------------------------------------------------------------
    // NORMALIZE INPUT
    // ------------------------------------------------------------------------

    const normalizedEmail =
        typeof email === "string" ? email.trim().toLowerCase() : "";

    // ------------------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------------------

    if (!normalizedEmail) {
        throw createAuthError("Email is required.");
    }

    if (!isValidEmail(normalizedEmail)) {
        throw createAuthError("Please provide a valid email address.");
    }

    if (typeof password !== "string" || !password) {
        throw createAuthError("Password is required.");
    }

    // ------------------------------------------------------------------------
    // FIND USER
    // ------------------------------------------------------------------------
    //
    // Password uses select:false in the User model.
    // Explicitly include it for authentication.
    //
    // ------------------------------------------------------------------------

    const user = await User.findOne({
        email: normalizedEmail,
    }).select("+password");

    if (!user) {
        throw createAuthError("Invalid email or password.", 401);
    }

    // ------------------------------------------------------------------------
    // ACCOUNT STATUS
    // ------------------------------------------------------------------------

    if (user.isActive === false) {
        throw createAuthError("Your account is currently inactive.", 403);
    }

    // ------------------------------------------------------------------------
    // COMPARE PASSWORD
    // ------------------------------------------------------------------------

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw createAuthError("Invalid email or password.", 401);
    }

    // ------------------------------------------------------------------------
    // GENERATE JWT
    // ------------------------------------------------------------------------

    const token = generateToken(user);

    // ------------------------------------------------------------------------
    // RETURN SAFE AUTH DATA
    // ------------------------------------------------------------------------

    return {
        user: sanitizeUser(user),

        token,
    };
};

// ============================================================================
// GET USER BY ID
// ============================================================================
//
// Used by authentication middleware and future authenticated services.
//
// ============================================================================

export const getUserById = async (userId) => {
    if (!userId) {
        return null;
    }

    return User.findById(userId).select("-password");
};

// ============================================================================
// EXPORT HELPERS
// ============================================================================

export { generateToken, sanitizeUser };
