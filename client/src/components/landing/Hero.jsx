import { motion } from "framer-motion";
import { ArrowRight, Bell, Lock, Play, Sparkles } from "lucide-react";
// import DashboardPreview from "./DashboardPreview";

import heroDashboard from "../../assets/images/hero-dashboard.png";

const pills = [
  { icon: Lock, label: "Secure & Private" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: Bell, label: "Smart Reminders" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(37,99,235,0.14),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(124,58,237,0.14),transparent_28%),linear-gradient(180deg,#fff_0%,#f8fbff_74%,#fff_100%)]" />
      <div className="absolute right-0 top-20 -z-10 h-[460px] w-[38vw] bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:18px_18px] opacity-45" />

      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:px-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-w-0 max-w-[620px]"
        >
          <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 shadow-sm shadow-blue-100">
            <Sparkles size={15} />
            <span className="truncate">AI powered asset lifecycle platform</span>
          </div>

          <h1 className="text-[2.35rem] font-black leading-[1.08] tracking-tight text-slate-950 sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]">
            Keep What Matters.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 bg-clip-text text-transparent">
              Never Lose It Again.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            Organize all your important assets, documents, warranties, insurance, subscriptions,
            renewals and service history in one secure, intelligent place.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="/register"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 text-base font-bold text-white shadow-2xl shadow-blue-600/25 transition hover:-translate-y-1 hover:shadow-blue-600/35"
            >
              Get Started Free
              <ArrowRight size={19} />
            </a>
            <a
              href="#features"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 text-base font-bold text-slate-800 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:border-slate-300"
            >
              Live Demo
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
                <Play size={14} fill="currentColor" />
              </span>
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon size={16} />
                  </span>
                  {pill.label}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="relative flex min-w-0 justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[680px] overflow-hidden rounded-[32px]">
            <div className="absolute inset-0 -z-10 rounded-full bg-blue-500/10 blur-3xl" />

            <img
              src={heroDashboard}
              alt="EverKeep Dashboard Preview"
              className="h-auto w-full rounded-[32px] shadow-2xl"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
