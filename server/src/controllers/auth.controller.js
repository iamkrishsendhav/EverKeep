import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";


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

        console.error(
            "Register error:",
            error
        );


        return res.status(
            error.statusCode || 400
        ).json({
            success: false,

            message:
                error.message ||
                "Unable to create account.",
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

        console.error(
            "Login error:",
            error
        );


        return res.status(
            error.statusCode || 401
        ).json({
            success: false,

            message:
                error.message ||
                "Unable to login.",
        });
    }
};