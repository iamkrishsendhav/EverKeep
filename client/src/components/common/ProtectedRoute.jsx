import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


// ============================================================================
// PROTECTED ROUTE
// ============================================================================
//
// Protects all authenticated application routes.
//
// Authentication state comes from AuthContext instead of reading
// localStorage directly.
//
// Flow:
//
//     AuthContext
//          ↓
//     isAuthenticated
//          ↓
//     ┌───────────────┐
//     │               │
//    true           false
//     │               │
//     ↓               ↓
//  Outlet          /login
//
// Loading state is also handled so the application does not redirect
// incorrectly while the authentication session is being restored.
// ============================================================================

const ProtectedRoute = () => {

    const location = useLocation();


    const {
        isAuthenticated,
        loading,
    } = useAuth();


    // =========================================================================
    // CHECKING AUTHENTICATION
    // =========================================================================
    //
    // AuthContext checks localStorage when the application starts.
    //
    // While that check is running, don't render the protected page
    // and don't redirect to login.
    // =========================================================================

    if (loading) {

        return (

            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-slate-200/80
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-slate-600
                        shadow-[0_12px_32px_rgba(15,23,42,0.06)]
                    "
                >

                    <span
                        className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-200
                            border-t-slate-900
                        "
                    />

                    Checking your session...

                </div>

            </main>

        );

    }


    // =========================================================================
    // NOT AUTHENTICATED
    // =========================================================================

    if (!isAuthenticated) {

        return (

            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />

        );

    }


    // =========================================================================
    // AUTHENTICATED
    // =========================================================================

    return <Outlet />;

};


export default ProtectedRoute;