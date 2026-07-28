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
    <section id="how-it-works" className="relative overflow-hidden bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="How it works" title="From scattered records to a living asset system." />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="mt-16 grid items-stretch gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="relative flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.07)]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-black text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden text-blue-300 md:block" size={26} />
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
