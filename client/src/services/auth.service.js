import api from "../lib/axios";
//import { loginUser } from "../../services/auth.service";


// ============================================================================
// AUTH SERVICE
// ============================================================================


// ============================================================================
// REGISTER
// ============================================================================

export const registerUser = async (
    userData
) => {

    const response =
        await api.post(
            "/auth/register",
            userData
        );

    return response.data;
};


// ============================================================================
// LOGIN
// ============================================================================

export const loginUser = async (
    credentials
) => {

    const response =
        await api.post(
            "/auth/login",
            credentials
        );

    return response.data;
};

export const requestPasswordReset = async (email) => {
    const response = await api.post("/auth/password/forgot", { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post("/auth/password/reset", { token, password });
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.post("/auth/email/verify", { token });
    return response.data;
};

export const requestEmailVerification = async () => {
    const response = await api.post("/auth/email/verification/request");
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data?.data?.user;
};


// ============================================================================
// LOGOUT
// ============================================================================

export const logoutUser = () => {

    localStorage.removeItem(
        "everkeep:token"
    );

    localStorage.removeItem(
        "everkeep:user"
    );

    sessionStorage.removeItem(
        "everkeep:auth"
    );

};


// ============================================================================
// GET CURRENT USER
// ============================================================================

export const getStoredUser = () => {

    try {

        const user =
            localStorage.getItem(
                "everkeep:user"
            );

        return user
            ? JSON.parse(user)
            : null;

    } catch (error) {

        console.error(
            "Unable to read stored user:",
            error
        );

        return null;
    }
};
