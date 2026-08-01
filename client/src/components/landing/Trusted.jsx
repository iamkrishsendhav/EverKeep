import { motion } from "framer-motion";

const revealContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const LogoGoogle = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <path
      d="M20.5 12.2c0 5-3.4 8.4-8.3 8.4-4.8 0-8.8-3.9-8.8-8.8S7.4 3 12.2 3c2.6 0 4.5 1 5.9 2.4L15.7 8c-.9-.9-2-1.5-3.5-1.5-2.9 0-5.2 2.4-5.2 5.3s2.3 5.3 5.2 5.3c3.3 0 4.5-2.3 4.7-3.6h-4.7v-3.3h8.1c.1.4.2 1.1.2 2Z"
      fill="currentColor"
    />
    <rect x="30" y="3.6" width="12.8" height="16.8" rx="2.2" stroke="currentColor" strokeWidth="2" />
    <path d="M33.2 16.8V7.2h2.2l4.2 5.8V7.2h2.2v9.6h-2.1l-4.3-5.9v5.9h-2.2Z" fill="currentColor" />
    <path d="M47.4 16.8V7.2h2.3v4.1h4.2V7.2h2.3v9.6h-2.3v-3.4h-4.2v3.4h-2.3Z" fill="currentColor" />
  </svg>
);

const LogoMicrosoft = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <rect x="4" y="3" width="7" height="7" rx="1.1" fill="currentColor" />
    <rect x="13.5" y="3" width="7" height="7" rx="1.1" fill="currentColor" opacity="0.82" />
    <rect x="4" y="12.5" width="7" height="7" rx="1.1" fill="currentColor" opacity="0.76" />
    <rect x="13.5" y="12.5" width="7" height="7" rx="1.1" fill="currentColor" opacity="0.68" />
    <path d="M28.4 17V7h2.2l3 4.8L36.7 7h2.1v10h-2.1v-6.3l-2.8 4.2h-.7l-2.8-4.2V17h-2Z" fill="currentColor" />
    <path d="M41.3 17V7h2.1v10h-2.1Z" fill="currentColor" />
    <path
      d="M45.5 17V7h2l4.8 6.4V7h2V17h-1.9l-4.9-6.5V17h-2Z"
      fill="currentColor"
    />
    <path d="M56.1 17V7h3.2c3.2 0 4.9 2.2 4.9 5s-1.7 5-4.9 5h-3.2Zm2.1-1.8h1.1c2 0 2.8-1.4 2.8-3.2s-.8-3.2-2.8-3.2h-1.1v6.4Z" fill="currentColor" />
  </svg>
);

const LogoNotion = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="2.8" stroke="currentColor" strokeWidth="2" />
    <path d="M7.6 17.2V7.6h2.1l5 6.2V7.6h2.1v9.6h-2L9.7 11v6.2H7.6Z" fill="currentColor" />
    <path d="M28.8 17V7h2.1v8.1h4.3V17h-6.4Z" fill="currentColor" />
    <path d="M36.8 17V7h2.1v4.1h4.2V7h2.1v10h-2.1v-3.9h-4.2V17h-2.1Z" fill="currentColor" />
    <path d="M47.7 17V7H54v1.8h-4.2v2.2h3.8v1.8h-3.8v2.4H54V17h-6.3Z" fill="currentColor" />
    <path d="M55.8 17V7h2.1v10h-2.1Z" fill="currentColor" />
  </svg>
);

const LogoLinear = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
    <path d="M7.4 16.6 16.7 7.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M29.2 17V7h2.1v8.1h4.4V17h-6.5Z" fill="currentColor" />
    <path d="M37.2 17V7h2.1v10h-2.1Z" fill="currentColor" />
    <path d="M41.6 17V7h2l4.8 6.4V7h2V17h-1.9l-4.9-6.5V17h-2Z" fill="currentColor" />
    <path d="M52.7 17V7H59v1.8h-4.2v2.2h3.8v1.8h-3.8v2.4H59V17h-6.3Z" fill="currentColor" />
  </svg>
);

const LogoFramer = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <path d="M4 3h12v6H10l6 6v6L4 9V3Z" fill="currentColor" />
    <path d="M10 9h12v6h-6v6h-6V9Z" fill="currentColor" opacity="0.82" />
    <path d="M28.8 17V7h2.1v3.9h3.9V7h2.1v10h-2.1v-4.2h-3.9V17h-2.1Z" fill="currentColor" />
    <path d="M39 17v-7.2h2v1.2c.5-.9 1.3-1.4 2.5-1.4 1.1 0 2 .5 2.4 1.5.6-1 1.6-1.5 2.8-1.5 1.8 0 3 1.2 3 3.3V17h-2v-3.5c0-1.2-.5-1.9-1.6-1.9-1 0-1.7.7-1.7 2V17h-2v-3.5c0-1.2-.5-1.9-1.6-1.9-1 0-1.7.7-1.7 2V17h-2.1Z" fill="currentColor" />
  </svg>
);

const LogoVercel = () => (
  <svg viewBox="0 0 64 24" className="h-6 w-16" fill="none" aria-hidden="true">
    <path d="M12 4 20 18H4L12 4Z" fill="currentColor" />
    <path d="M27.7 7h2.3l2.2 6.8L34.5 7h2.2L33.2 17h-2L27.7 7Z" fill="currentColor" />
    <path d="M37.8 17V7h2.1v10h-2.1Z" fill="currentColor" />
    <path d="M42.2 17V7h2l4.8 6.4V7h2V17h-1.9l-4.9-6.5V17h-2Z" fill="currentColor" />
    <path d="M53.2 17V7h6.3v1.8h-4.2v2.2h3.8v1.8h-3.8v2.4h4.2V17h-6.3Z" fill="currentColor" />
  </svg>
);

const brands = [
  { name: "Google", Logo: LogoGoogle },
  { name: "Microsoft", Logo: LogoMicrosoft },
  { name: "Notion", Logo: LogoNotion },
  { name: "Linear", Logo: LogoLinear },
  { name: "Framer", Logo: LogoFramer },
  { name: "Vercel", Logo: LogoVercel },
];

const Trusted = () => {
  return (
    <section className="landing-section-tight relative overflow-hidden border-y border-slate-200/80 bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(56%_100%_at_50%_0%,rgba(37,99,235,0.08),transparent_72%)]" />

      <div className="landing-container">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-4 sm:gap-6">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-200 sm:block" />
          <p className="max-w-2xl text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
            Trusted by operators, founders and families managing what matters
          </p>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-200 sm:block" />
        </div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.32 }}
          className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 xl:gap-6"
        >
          {brands.map(({ name, Logo }) => (
            <motion.div key={name} variants={revealItem}>
              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="landing-card landing-card-hover group relative flex h-24 items-center justify-center px-4 backdrop-blur-sm"
              >
                <div className="text-slate-400 transition-colors duration-300 group-hover:text-slate-700">
                  <Logo />
                </div>
                <span className="sr-only">{name}</span>
              </motion.article>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Trusted;
