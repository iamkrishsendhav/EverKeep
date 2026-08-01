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

const cardTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

const Features = () => {
  return (
    <section id="features" className="landing-section overflow-hidden bg-gray-50">
      <div className="landing-container">
        <SectionHeader
          eyebrow="Everything you need"
          title="All your important things, organized beautifully."
          description="EverKeep brings assets, documents, renewals, subscriptions and family context into one premium workspace."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 space-y-7 lg:mt-16 lg:space-y-8"
        >
          <motion.article
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={cardTransition}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.02] transition-colors duration-300 hover:border-primary-100 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:flex-row lg:items-center lg:gap-9 lg:p-10 xl:p-12"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_14px_30px_rgba(79,70,229,0.26)] ring-1 ring-primary-500/20 transition-transform duration-300 group-hover:scale-[1.03] sm:h-[4.5rem] sm:w-[4.5rem]">
              <Boxes size={30} strokeWidth={1.75} />
            </div>

            <div className="mt-7 min-w-0 flex-1 lg:mt-0">
              <span className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                Core
              </span>
              <h3 className="mt-5 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl lg:text-[2rem]">
                Asset Management
              </h3>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8">
                Track ownership, purchase details, service history and lifecycle status for every valuable item - the single
                source of truth behind everything else EverKeep does.
              </p>
            </div>
          </motion.article>

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {supportingFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  transition={cardTransition}
                  className="group flex h-full min-w-0 flex-col rounded-[1.5rem] border border-gray-200 bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.055)] ring-1 ring-slate-900/[0.02] transition-colors duration-300 hover:border-primary-100 hover:shadow-[0_22px_56px_rgba(15,23,42,0.09)] sm:p-8"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600 shadow-[0_8px_22px_rgba(79,70,229,0.10)] transition-all duration-300 group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_14px_30px_rgba(79,70,229,0.22)]">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <div className="mt-7 min-w-0">
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-gray-950">{feature.title}</h3>
                    <p className="mt-3.5 text-[15px] leading-7 text-gray-600">{feature.description}</p>
                  </div>
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
