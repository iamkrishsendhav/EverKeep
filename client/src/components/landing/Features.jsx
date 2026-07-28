import { motion } from "framer-motion";
import { Bell, Boxes, FileLock2, Share2, Sparkles } from "lucide-react";
import SectionHeader from "./common/SectionHeader";
import { fadeUp, staggerContainer } from "./common/animation";

const supportingFeatures = [
  {
    icon: FileLock2,
    title: "Document Vault",
    description: "Store invoices, identity documents, insurance papers and certificates with secure categorization.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get proactive alerts for renewals, warranties, services and expiry dates without reminder-app clutter.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Spot missing documents, predict upcoming costs and surface smarter actions from your asset data.",
  },
  {
    icon: Share2,
    title: "Family Sharing",
    description: "Invite trusted family members, assign access and keep household records coordinated securely.",
  },
];

const Features = () => {
  return (
    <section id="features" className="overflow-hidden bg-slate-50 px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-5xl justify-center">
          <SectionHeader
            eyebrow="Everything you need"
            title="All your important things, organized beautifully."
            description="EverKeep brings assets, documents, renewals, subscriptions and family context into one premium workspace."
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-16 space-y-8"
        >
          {/* Featured hero feature */}
          <motion.article
            variants={fadeUp}
            className="group relative flex min-w-0 flex-col gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-10 lg:flex-row lg:items-center"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Boxes size={28} strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Core
              </span>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Asset Management</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-600">
                Track ownership, purchase details, service history and lifecycle status for every valuable item —
                the single source of truth behind everything else EverKeep does.
              </p>
            </div>
          </motion.article>

          {/* Supporting features — auto-scaling grid, adapts to any item count */}
          <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {supportingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  variants={fadeUp}
                  className="group flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
                >
                  <div className="mb-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
