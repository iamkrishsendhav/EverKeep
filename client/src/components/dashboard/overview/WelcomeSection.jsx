import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "../widgets/dashboardMotion";

const WelcomeSection = () => (
  <motion.section
    variants={fadeUp}
    className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:p-8"
  >
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[#5B4BFF]">Good morning, Avery</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
        Your household assets are organized, protected and ready for what is next.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
        EverKeep is monitoring renewals, document completeness and coverage gaps across your asset lifecycle.
      </p>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Asset health</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">94</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
          <CheckCircle2 size={26} />
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full w-[94%] rounded-full bg-emerald-500" />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">Excellent coverage. Three records need minor follow-up.</p>
    </div>
  </motion.section>
);

export default WelcomeSection;
