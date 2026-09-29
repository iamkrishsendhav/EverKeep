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
                                            Analytics
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
                                            Performance and insight
                                            reporting will appear here.
                                        </p>

                                    </div>

                                </section>
                            }
                        />


                        {/* ----------------------------------------------------
                            NOTIFICATIONS
                        ---------------------------------------------------- */}

                        <Route
                            path="notifications"
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
                                            Notifications
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
                                            Activity streams and system
                                            alerts will appear here.
                                        </p>

                                    </div>

                                </section>
                            }
                        />


                        {/* ----------------------------------------------------
                            SETTINGS
                        ---------------------------------------------------- */}

                        <Route
                            path="settings"
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
                                            Settings
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
                                            Account and preference
                                            management will appear here.
                                        </p>

                                    </div>

                                </section>
                            }
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