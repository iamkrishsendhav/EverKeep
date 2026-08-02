import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "../widgets/dashboardMotion";
import { dashboardSummary, widgetState } from "./dashboardData";

const WelcomeSection = ({ status = widgetState.populated, data = dashboardSummary }) => {
  if (status === widgetState.loading) {
    return (
      <motion.section variants={fadeUp} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-80 max-w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-52 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </motion.section>
    );
  }

  if (status === widgetState.error) {
    return (
      <motion.section variants={fadeUp} className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6">
        <p className="text-[14px] font-medium text-rose-700">Could not load dashboard summary.</p>
      </motion.section>
    );
  }

  if (status === widgetState.empty) {
    return (
      <motion.section variants={fadeUp} className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-[14px] font-medium text-slate-600">No assets yet. Start by adding your first item.</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      variants={fadeUp}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-center"
    >
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-slate-500">{data.greeting}</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight text-slate-950">{data.title}</h1>
        <p className="mt-3 text-[14px] text-slate-600">{data.subtitle}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">{data.scoreLabel}</p>
            <p className="mt-2 text-[36px] font-semibold tracking-tight text-slate-950">{data.score}</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <CheckCircle2 size={22} />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(Math.max(data.score, 0), 100)}%` }} />
        </div>
      </div>
    </motion.section>
  );
};

export default WelcomeSection;
