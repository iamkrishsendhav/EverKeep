import { memo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import DashboardHeader from "./DashboardHeader";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-slate-100 text-base text-slate-950 antialiased dark:bg-slate-950 dark:text-white">
      {/* Desktop navigation */}
      <div className="hidden h-full w-72 shrink-0 lg:flex" aria-hidden={false}>
        <Sidebar />
      </div>

      {/* Drawer navigation for tablet and mobile */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Application shell */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Persistent header */}
        <DashboardHeader onMenu={() => setSidebarOpen(true)} />

        {/* Scrollable content region */}
        <main
          id="dashboard-content"
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          aria-label="Dashboard content"
          tabIndex={-1}
        >
          <div className="mx-auto min-h-full w-full max-w-7xl rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="flex min-h-full min-w-0 flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
