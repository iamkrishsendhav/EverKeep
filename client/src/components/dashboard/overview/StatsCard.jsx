import { motion } from "framer-motion";
import { fadeUp } from "../widgets/dashboardMotion";

const StatsCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_22px_54px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-2xl border ${stat.tone}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{stat.detail}</p>
    </motion.article>
  );
};

export default StatsCard;
