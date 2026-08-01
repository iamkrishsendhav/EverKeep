import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import SectionHeader from "./common/SectionHeader";
import { fadeUp, staggerContainer } from "./common/animation";

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
    <section id="faq" className="landing-section overflow-hidden bg-white">
      <div className="landing-container">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions before you bring order to the chaos."
          description="Clear answers about security, AI, reminders and family access before you move your important records into EverKeep."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          className="faq-list mx-auto mt-14 w-full max-w-5xl lg:mt-16"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <motion.article
                key={faq.question}
                variants={fadeUp}
                className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
              >
                <button
                  id={buttonId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="faq-trigger"
                >
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <ChevronDown size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="faq-answer">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="faq-trust-note mx-auto mt-8 max-w-5xl"
        >
          <ShieldCheck size={18} className="shrink-0 text-primary-600" />
          <span>EverKeep is built for private, secure organization of sensitive household and asset records.</span>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
