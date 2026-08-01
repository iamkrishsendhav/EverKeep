import { motion } from "framer-motion";
import { ArrowRight, Bell, Lock, Play, Sparkles } from "lucide-react";
import heroDashboard from "../../assets/images/hero-dashboard.png";

const pills = [
  { icon: Lock, label: "Secure & Private" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: Bell, label: "Smart Reminders" },
];

const Hero = () => {
  return (
    <section className="landing-hero relative overflow-hidden border-b border-gray-200 bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(79,70,229,0.10),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(124,58,237,0.08),transparent_30%),linear-gradient(180deg,#fff_0%,#f9fafb_74%,#fff_100%)]" />

      <div className="landing-container grid grid-cols-1 items-start gap-12 pb-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-w-0 max-w-[600px] lg:pr-6"
        >
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
            <Sparkles size={14} />
            <span className="truncate">AI Powered Asset Lifecycle Platform</span>
          </div>

          <h1 className="max-w-[13ch] text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
            Keep What Matters.
            <br />
            <span className="text-primary-600">Never Lose It Again.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-7 text-gray-600">
            Organize all your important assets, documents, warranties, insurance,
            subscriptions, renewals and service history in one secure, intelligent place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/register"
              className="landing-button landing-button-primary"
            >
              Get Started Free
              <ArrowRight size={17} />
            </a>
            <a
              href="#features"
              className="landing-button landing-button-secondary"
            >
              Live Demo
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                <Play size={12} fill="currentColor" />
              </span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-card"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Icon size={14} />
                  </span>
                  {pill.label}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative min-w-0 self-center justify-self-center lg:justify-self-end"
        >
          <div className="relative w-full max-w-[720px] rounded-3xl bg-white/70 p-3 shadow-card ring-1 ring-gray-200 backdrop-blur-sm sm:p-4">
            <div className="absolute -inset-8 -z-10 rounded-full bg-primary-500/10 blur-3xl" />
            <img
              src={heroDashboard}
              alt="EverKeep Dashboard Preview"
              className="h-auto w-full rounded-2xl object-cover object-top"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
