import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";


// ============================================================================
// PUBLIC PAGES
// ============================================================================

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";


// ============================================================================
// DASHBOARD
// ============================================================================

import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";


// ============================================================================
// DASHBOARD PAGES
// ============================================================================

import Assets from "../pages/Assets/Assets";
import Documents from "../pages/Document/Documents";
import Warranty from "../pages/Warranty/Warranty";
import Calendar from "../pages/Calendar/Calendar";
import Subscriptions from "../pages/Subscriptions/Subscriptions";
import Family from "../pages/Family/Family";
import AI from "../pages/AI/AI";
import Analytics from "../pages/Analytics/Analytics";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";


// ============================================================================
// COMMON
// ============================================================================

import NotFound from "../components/common/NotFound";
import ProtectedRoute from "../components/common/ProtectedRoute";


// ============================================================================
// APP ROUTES
// ============================================================================

const AppRoutes = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* ============================================================
                    PUBLIC ROUTES
                ============================================================ */}

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />


                {/* ============================================================
                    PROTECTED ROUTES
                ============================================================ */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        path="/dashboard/*"
                        element={<DashboardLayout />}
                    >

                        {/* ----------------------------------------------------
                            DASHBOARD
                        ---------------------------------------------------- */}

                        <Route
                            index
                            element={<Dashboard />}
                        />


                        {/* ----------------------------------------------------
                            ASSETS
                        ---------------------------------------------------- */}

                        <Route
                            path="assets"
                            element={<Assets />}
                        />


                        {/* ----------------------------------------------------
                            DOCUMENTS
                        ---------------------------------------------------- */}

                        <Route
                            path="documents"
                            element={<Documents />}
                        />


                        {/* ----------------------------------------------------
                            WARRANTY
                        ---------------------------------------------------- */}

                        <Route
                            path="warranty"
                            element={<Warranty />}
                        />


                        {/* ----------------------------------------------------
                            CALENDAR
                        ---------------------------------------------------- */}

                        <Route
                            path="calendar"
                            element={<Calendar />}
                        />


                        {/* ----------------------------------------------------
                            SUBSCRIPTIONS
                        ---------------------------------------------------- */}

                        <Route
                            path="subscriptions"
                            element={<Subscriptions />}
                        />


                        {/* ----------------------------------------------------
                            FAMILY
                        ---------------------------------------------------- */}

                        <Route
                            path="family"
                            element={<Family />}
                        />


                        {/* ----------------------------------------------------
                            AI ASSISTANT
                        ---------------------------------------------------- */}

                        <Route
                            path="ai"
                            element={<AI />}
                        />


                        {/* ----------------------------------------------------
                            ANALYTICS
                        ---------------------------------------------------- */}

                        <Route
                            path="analytics"
                            element={<Analytics />}
                        />


                        {/* ----------------------------------------------------
                            NOTIFICATIONS
                        ---------------------------------------------------- */}

                        <Route
                            path="notifications"
                            element={<Notifications />}
                        />


                        {/* ----------------------------------------------------
                            SETTINGS
                        ---------------------------------------------------- */}

                        <Route
                            path="settings"
                            element={<Settings />}
                        />


                        {/* ----------------------------------------------------
                            HELP
                        ---------------------------------------------------- */}

                        <Route
                            path="help"
                            element={
                                <section className="space-y-4">

                                    <div
                                        className="
                                            rounded-[1.75rem]
                                            border
                                            border-slate-200/80
                                            bg-white/80
                                            p-6
                                            shadow-[0_16px_48px_rgba(15,23,42,0.06)]
                                            backdrop-blur-xl
                                        "
                                    >

                                        <p
                                            className="
                                                text-[11px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.24em]
                                                text-slate-500
                                            "
                                        >
                                            Workspace
                                        </p>

                                        <h1
                                            className="
                                                mt-2
                                                text-3xl
                                                font-semibold
                                                tracking-tight
                                                text-slate-950
                                            "
                                        >
                                            Help & Support
                                        </h1>

                                        <p
                                            className="
                                                mt-3
                                                max-w-2xl
                                                text-sm
                                                leading-6
                                                text-slate-600
                                            "
                                        >
                                            Support resources, account help,
                                            and product guidance will appear
                                            here.
                                        </p>

                                    </div>

                                </section>
                            }
                        />

                    </Route>

                </Route>


                {/* ============================================================
                    404
                ============================================================ */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
};


export default AppRoutes;
