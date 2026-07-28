import { motion } from "framer-motion";

const companies = [
  { name: "Google", weight: "font-semibold" },
  { name: "Microsoft", weight: "font-semibold" },
  { name: "Notion", weight: "font-semibold" },
  { name: "Linear", weight: "font-semibold" },
  { name: "Framer", weight: "font-semibold" },
  { name: "Vercel", weight: "font-semibold" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Trusted = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4">
          <span className="h-px w-8 bg-slate-300" />
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Trusted by operators, founders and families managing what matters
          </p>
          <span className="h-px w-8 bg-slate-300" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6"
        >
          {companies.map((company) => (
            <motion.div
              key={company.name}
              variants={item}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              className="group flex h-16 items-center justify-center rounded-3xl border border-slate-100 bg-white px-4 shadow-sm"
            >
              <span
                className={`select-none text-lg tracking-tight text-slate-300 grayscale transition-all duration-300 group-hover:text-slate-800 group-hover:grayscale-0 ${company.weight}`}
              >
                {company.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Trusted;
