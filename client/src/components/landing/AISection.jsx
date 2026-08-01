import { motion } from "framer-motion";
import { Activity, BrainCircuit, CalendarCheck2, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import SectionHeader from "./common/SectionHeader";
import ViewReveal from "./common/Motion";

const insightRows = [
  { icon: Activity, title: "Health Score", value: "94%", text: "Excellent coverage across core documents." },
  { icon: CalendarCheck2, title: "Renewal Prediction", value: "3 upcoming", text: "Insurance and warranty dates need review." },
  { icon: TrendingUp, title: "Smart Suggestions", value: "$420 saved", text: "Duplicate subscription detected this month." },
];

const AISection = () => {
  return (
    <section className="landing-section overflow-hidden bg-slate-950 text-white">
      <div className="landing-container">
        <SectionHeader
          eyebrow="AI insights"
          title="A calmer way to stay ahead of every lifecycle event."
          description="EverKeep turns documents, policies and service records into practical intelligence."
          inverse
        />

        <ViewReveal className="mt-14 grid min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(79,70,229,0.22)] backdrop-blur-xl lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 border-b border-white/10 p-7 lg:border-b-0 lg:border-r lg:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 shadow-2xl shadow-primary-600/30">
              <BrainCircuit size={26} />
            </div>
            <h3 className="max-w-md text-3xl font-bold leading-tight tracking-tight">EverKeep AI reviews your asset graph continuously.</h3>
            <p className="mt-5 max-w-md leading-8 text-slate-300">
              It highlights missing warranties, predicts renewal pressure, suggests consolidation and keeps shared family records complete.
            </p>
            <div className="mt-8 grid gap-3">
              {["No reminder noise", "Document-aware recommendations", "Private by design"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden p-5 sm:p-7 lg:p-10">
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="relative min-w-0 rounded-3xl border border-white/10 bg-white text-slate-950 shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">AI briefing</p>
                  <h4 className="mt-1 text-xl font-bold">Asset health cockpit</h4>
                </div>
                <Sparkles size={22} className="text-primary-600" />
              </div>
              <div className="space-y-4 p-5">
                {insightRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <motion.div
                      key={row.title}
                      whileHover={{ x: 4 }}
                      className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <p className="min-w-0 font-semibold">{row.title}</p>
                            <span className="shrink-0 text-sm font-bold text-primary-600">{row.value}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{row.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </ViewReveal>
      </div>
    </section>
  );
};

export default AISection;
