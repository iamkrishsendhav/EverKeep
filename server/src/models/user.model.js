import mongoose from "mongoose";


// ============================================================================
// USER SCHEMA
// ============================================================================

const userSchema = new mongoose.Schema(
    {

        // --------------------------------------------------------------------
        // BASIC INFORMATION
        // --------------------------------------------------------------------

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
        },


        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },


        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },


        // --------------------------------------------------------------------
        // PROFILE
        // --------------------------------------------------------------------

        avatar: {
            type: String,
            default: "",
        },

        phoneNumber: {
            type: String,
            trim: true,
            validate: {
                validator: (value) => !value || /^\+[1-9]\d{7,14}$/.test(value),
                message: "Phone number must use international format.",
            },
            default: "",
        },


        // --------------------------------------------------------------------
        // ACCOUNT
        // --------------------------------------------------------------------

        plan: {
            type: String,
            enum: [
                "free",
                "premium",
            ],
            default: "free",
        },


        role: {
            type: String,
            enum: [
                "user",
                "admin",
            ],
            default: "user",
        },


        // --------------------------------------------------------------------
        // ACCOUNT STATUS
        // --------------------------------------------------------------------

        isActive: {
            type: Boolean,
            default: true,
        },


        // --------------------------------------------------------------------
        // EMAIL VERIFICATION
        // --------------------------------------------------------------------

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        emailVerificationTokenHash: { type: String, select: false, default: undefined },
        emailVerificationExpiresAt: { type: Date, select: false, default: undefined },
        passwordResetTokenHash: { type: String, select: false, default: undefined },
        passwordResetExpiresAt: { type: Date, select: false, default: undefined },
        tokenVersion: { type: Number, default: 0, min: 0 },

        notificationPreferences: {
            emailEnabled: { type: Boolean, default: false },
            emailCategories: {
                type: [{ type: String, enum: ["warranty", "subscription", "asset", "document", "family", "calendar", "system"] }],
                default: ["warranty", "subscription", "asset", "family", "calendar"],
            },
            whatsappEnabled: { type: Boolean, default: false },
            whatsappCategories: {
                type: [{ type: String, enum: ["warranty", "subscription", "asset", "document", "family", "calendar", "system"] }],
                default: ["warranty", "subscription", "asset", "family", "calendar"],
            },
            whatsappConsentAt: { type: Date, default: null },
        },

    },

    {
        timestamps: true,
    }
);


// ============================================================================
// EXPORT
// ============================================================================

const User = mongoose.model(
    "User",
    userSchema
);

export default User;
