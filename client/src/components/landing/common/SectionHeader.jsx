import { motion } from "framer-motion";
import { fadeUp } from "./animation";

const SectionHeader = ({ eyebrow, title, description, align = "center", inverse = false }) => {
  const isLeft = align === "left";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full"
    >
      <div
        className={`mx-auto flex max-w-4xl flex-col ${
          isLeft ? "items-start text-left" : "items-center text-center"
        }`}
      >
        {eyebrow && (
          <span
            className={`inline-flex max-w-full items-center rounded-full border px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.18em] ${
              inverse
                ? "border-white/10 bg-white/10 text-primary-100"
                : "border-primary-100 bg-primary-50 text-primary-600"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={`mt-5 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl ${
            inverse ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${inverse ? "text-slate-300" : "text-gray-600"}`}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SectionHeader;
