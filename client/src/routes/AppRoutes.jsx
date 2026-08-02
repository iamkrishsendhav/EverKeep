import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../components/common/NotFound";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

const DashboardPagePlaceholder = ({ title, description }) => (
  <section className="space-y-4">
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_16px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Workspace</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  </section>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<DashboardPagePlaceholder title="Assets" description="Asset management workflows will render in-place inside the shared dashboard shell." />} />
          <Route path="documents" element={<DashboardPagePlaceholder title="Documents" description="Document review and storage workflows will appear here without reloading the sidebar or header." />} />
          <Route path="warranty" element={<DashboardPagePlaceholder title="Warranty" description="Warranty coverage and renewal tracking will appear here within the same app shell." />} />
          <Route path="calendar" element={<DashboardPagePlaceholder title="Calendar" description="Upcoming tasks and lifecycle milestones will render here without disrupting the layout." />} />
          <Route path="family" element={<DashboardPagePlaceholder title="Family" description="Family sharing and household visibility will appear here in the same fixed layout." />} />
          <Route path="ai" element={<DashboardPagePlaceholder title="AI Assistant" description="AI recommendations and automation actions will render here with the existing dashboard chrome." />} />
          <Route path="analytics" element={<DashboardPagePlaceholder title="Analytics" description="Performance and insight reporting will render here with the same spacing system and shell." />} />
          <Route path="notifications" element={<DashboardPagePlaceholder title="Notifications" description="Activity streams and system alerts will render here in the shared content region." />} />
          <Route path="settings" element={<DashboardPagePlaceholder title="Settings" description="Account and preference management will remain within the same fixed navigation and header structure." />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
