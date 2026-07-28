import { motion } from "framer-motion";
import { fadeUp } from "./animation";

const ViewReveal = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

export default ViewReveal;