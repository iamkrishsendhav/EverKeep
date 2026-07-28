import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "./common/SectionHeader";
import { fadeUp, staggerContainer } from "./common/animation";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For getting your most important records into one place.",
    features: ["25 assets", "50 documents", "Basic renewal alerts", "Single user"],
  },
  {
    name: "Pro",
    price: "$12",
    description: "For people who want full lifecycle intelligence.",
    features: ["Unlimited assets", "AI insights", "Warranty and policy tracking", "Priority document indexing"],
    featured: true,
  },
  {
    name: "Family",
    price: "$24",
    description: "For households managing shared assets and access.",
    features: ["5 family members", "Shared vaults", "Role-based access", "Family asset timeline"],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="overflow-hidden bg-slate-50 px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Pricing"
          title="Start small. Scale into a complete asset command center."
          description="Simple plans for personal, professional and family asset management."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.14 }}
          className="mt-16 grid items-stretch gap-8 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={fadeUp}
              className={`relative flex h-full min-w-0 flex-col rounded-3xl border p-7 shadow-[0_18px_60px_rgba(15,23,42,0.07)] ${
                plan.featured
                  ? "border-blue-200 bg-white ring-4 ring-blue-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.featured && (
                <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
                  <Sparkles size={13} />
                  Popular
                </div>
              )}
              <h3 className={`text-2xl font-black text-slate-950 ${plan.featured ? "pr-28" : ""}`}>{plan.name}</h3>
              <p className="mt-3 min-h-14 text-sm leading-7 text-slate-600">{plan.description}</p>
              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-slate-950">{plan.price}</span>
                <span className="pb-2 text-sm font-bold text-slate-500">/month</span>
              </div>
              <a
                href="/register"
                className={`mt-8 inline-flex h-14 w-full items-center justify-center rounded-2xl text-sm font-black transition hover:-translate-y-0.5 ${
                  plan.featured ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "border border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
              >
                Get Started
              </a>
              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-700">
                    <Check size={18} className="mt-1 shrink-0 text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
