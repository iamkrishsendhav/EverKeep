import { motion } from "framer-motion";
import { fadeUp } from "./dashboardMotion";

const DashboardPanel = ({ children, className = "" }) => (
  <motion.section
    variants={fadeUp}
    className={`rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.055)] ${className}`}
  >
    {children}
  </motion.section>
);

export default DashboardPanel;
