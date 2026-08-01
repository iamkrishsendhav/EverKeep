export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export const dashboardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};
