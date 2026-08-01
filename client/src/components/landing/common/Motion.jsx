import { motion } from "framer-motion";
import { fadeUp } from "./animation";

const ViewReveal = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ViewReveal;
