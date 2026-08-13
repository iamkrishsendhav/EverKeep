import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../components/common/NotFound";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import Assets from "../pages/Assets/Assets";
import Documents from "../pages/Document/Documents";
import Warranty from "../pages/Warranty/Warranty";
import Calendar from "../pages/Calendar/Calendar";


const DashboardPagePlaceholder = ({
    title,
    description,
}) => (
    <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_16px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl">

            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Workspace
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
            </p>

        </div>
    </section>
);


const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* ------------------------------------------------
                    Public Routes
                ------------------------------------------------ */}

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


                {/* ------------------------------------------------
                    Dashboard Routes
                ------------------------------------------------ */}

                <Route
                    path="/dashboard/*"
                    element={<DashboardLayout />}
                >

                    {/* Dashboard */}

                    <Route
                        index
                        element={<Dashboard />}
                    />


                    {/* Assets */}

                    <Route
                        path="assets"
                        element={<Assets />}
                    />


                    {/* Documents */}

                    <Route
                        path="documents"
                        element={<Documents />}
                    />


                    {/* Warranty */}

                    <Route
                        path="warranty"
                        element={<Warranty />}
                    />


                    {/* ------------------------------------------------
                        Upcoming Modules
                    ------------------------------------------------ */}

                    <Route
                        path="calendar"
                        element={<Calendar />}
                    />

                    <Route
                        path="family"
                        element={
                            <DashboardPagePlaceholder
                                title="Family"
                                description="Family sharing and household visibility will appear here in the same fixed layout."
                            />
                        }
                    />

                    <Route
                        path="ai"
                        element={
                            <DashboardPagePlaceholder
                                title="AI Assistant"
                                description="AI recommendations and automation actions will render here with the existing dashboard chrome."
                            />
                        }
                    />

                    <Route
                        path="analytics"
                        element={
                            <DashboardPagePlaceholder
                                title="Analytics"
                                description="Performance and insight reporting will render here with the same spacing system and shell."
                            />
                        }
                    />

                    <Route
                        path="notifications"
                        element={
                            <DashboardPagePlaceholder
                                title="Notifications"
                                description="Activity streams and system alerts will render here in the shared content region."
                            />
                        }
                    />

                    <Route
                        path="settings"
                        element={
                            <DashboardPagePlaceholder
                                title="Settings"
                                description="Account and preference management will remain within the same fixed navigation and header structure."
                            />
                        }
                    />

                </Route>


                {/* ------------------------------------------------
                    404
                ------------------------------------------------ */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
};


export default AppRoutes;