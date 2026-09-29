import axios from "axios";

// ============================================================================
// EVERKEEP API CLIENT
// ============================================================================
//
// Shared HTTP client for all EverKeep API requests.
//
// Responsibilities:
// - Centralized API base URL
// - JWT authentication
// - Authentication invalidation
// - Consistent request configuration
//
// AI-specific timeout / cancellation should be handled by the AI service,
// not by this shared client.
//
// ============================================================================

// ============================================================================
// API CLIENT
// ============================================================================

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",

    // Normal application API timeout.
    // AI requests can override this when required.
    timeout: 120000,
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================
//
// Automatically attaches the authenticated user's JWT.
//
// Authorization:
// Bearer <token>
// ============================================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            "everkeep:token"
        );

        if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================
//
// Handles expired / invalid authentication.
//
// Authentication state remains the responsibility of AuthContext and
// ProtectedRoute. This interceptor only synchronizes the invalidation event.
// ============================================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (
            error?.response?.status === 401
        ) {
            localStorage.removeItem(
                "everkeep:token"
            );

            localStorage.removeItem(
                "everkeep:user"
            );

            window.dispatchEvent(
                new Event(
                    "everkeep:auth:logout"
                )
            );
        }

        return Promise.reject(error);
    }
);

// ============================================================================
// EXPORT
// ============================================================================

export default api;