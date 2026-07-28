import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./common/SectionHeader";

const faqs = [
  {
    question: "Is EverKeep just a reminder app?",
    answer: "No. Reminders are only one small output. EverKeep manages the full lifecycle of assets, documents, warranties, insurance, subscriptions, service history and family access.",
  },
  {
    question: "Can I store sensitive documents?",
    answer: "Yes. EverKeep is designed around a secure document vault with privacy-first organization for invoices, identity records, policies and ownership documents.",
  },
  {
    question: "How does AI help?",
    answer: "AI reviews your asset graph to identify missing documents, forecast renewals, detect unusual subscription costs and suggest next best actions.",
  },
  {
    question: "Can my family use the same workspace?",
    answer: "Family plans include shared spaces, member access and household asset timelines so everyone can find what they are allowed to see.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="overflow-hidden bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="FAQ" title="Questions before you bring order to the chaos." />
        <div className="mx-auto mt-16 w-full max-w-5xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8 sm:py-6"
                >
                  <span className="min-w-0 text-base font-black text-slate-950 sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-7 text-slate-600 sm:px-8 sm:pb-8 sm:text-base">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
