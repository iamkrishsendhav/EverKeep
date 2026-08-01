import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
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
    <section id="pricing" className="landing-section overflow-hidden bg-gray-50">
      <div className="landing-container">
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
          className="mt-14 grid items-stretch gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={fadeUp}
              className={`landing-card landing-card-hover relative flex h-full min-w-0 flex-col p-7 ${
                plan.featured ? "border-primary-200 ring-4 ring-primary-100" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles size={13} />
                  Popular
                </div>
              )}
              <h3 className={`text-2xl font-bold text-gray-900 ${plan.featured ? "pr-28" : ""}`}>{plan.name}</h3>
              <p className="mt-3 min-h-14 text-sm leading-7 text-gray-600">{plan.description}</p>
              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
                <span className="pb-2 text-sm font-semibold text-gray-500">/month</span>
              </div>

              <a
                href="/register"
                className={`landing-button mt-8 w-full ${
                  plan.featured ? "landing-button-primary" : "landing-button-secondary"
                }`}
              >
                Get Started
              </a>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm font-medium leading-6 text-gray-700">
                    <Check size={18} className="mt-1 shrink-0 text-success-500" />
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
