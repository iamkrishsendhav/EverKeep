import { motion } from "framer-motion";
import { ArrowRight, Boxes, ScanLine, Sparkles } from "lucide-react";
import SectionHeader from "./common/SectionHeader";
import { fadeUp, staggerContainer } from "./common/animation";

const steps = [
  {
    icon: ScanLine,
    title: "Import Assets",
    description: "Upload invoices, scan QR labels, forward receipts or add records manually in minutes.",
  },
  {
    icon: Boxes,
    title: "Track Everything",
    description: "EverKeep connects each asset to documents, warranties, policies, costs and service history.",
  },
  {
    icon: Sparkles,
    title: "Receive AI Insights",
    description: "Get health scoring, renewal predictions and practical suggestions before anything becomes urgent.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="landing-section relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
      <div className="landing-container">
        <SectionHeader eyebrow="How it works" title="From scattered records to a living asset system." />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="mt-14 grid items-stretch gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="landing-card landing-card-hover relative flex h-full min-w-0 flex-col p-7"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden text-primary-300 md:block" size={26} />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
