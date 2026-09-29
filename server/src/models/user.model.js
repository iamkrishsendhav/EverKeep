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
            minlength: 6,
            select: false,
        },


        // --------------------------------------------------------------------
        // PROFILE
        // --------------------------------------------------------------------

        avatar: {
            type: String,
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