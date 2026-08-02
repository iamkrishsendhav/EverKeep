import { motion } from "framer-motion";
import { fadeUp } from "./dashboardMotion";

const DashboardPanel = ({ children, className = "" }) => (
  <motion.section
    variants={fadeUp}
    className={`rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] ${className}`}
  >
    {children}
  </motion.section>
);

export default DashboardPanel;
