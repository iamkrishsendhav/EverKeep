import { motion } from "framer-motion";
import { fadeUp } from "../widgets/dashboardMotion";
import { widgetState } from "./dashboardData";

const StatsCard = ({ stat, status = widgetState.populated }) => {
  const Icon = stat.icon;

  if (status === widgetState.loading) {
    return (
      <motion.article variants={fadeUp} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-9 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl border ${stat.tone}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <p className="text-[36px] leading-none font-semibold tracking-tight text-slate-950">{stat.value}</p>
        <p className="mt-3 text-[15px] font-medium text-slate-500">{stat.label}</p>
        <p className="mt-2 text-[14px] text-slate-500">{stat.detail}</p>
      </div>
    </motion.article>
  );
};

export default StatsCard;
