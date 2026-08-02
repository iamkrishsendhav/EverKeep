import { memo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import DashboardHeader from "./DashboardHeader";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="flex h-screen min-h-0 w-full overflow-hidden bg-transparent text-[15px] text-slate-950 antialiased">
      <div className="hidden h-full w-[272px] shrink-0 border-r border-slate-200/80 bg-slate-50/80 backdrop-blur-xl lg:flex">
        <Sidebar />
      </div>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenu={() => setSidebarOpen(true)} />

        <main
          id="dashboard-content"
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 scroll-smooth sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          aria-label="Dashboard content"
          tabIndex={-1}
        >
          <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="flex min-h-full w-full flex-1 flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
