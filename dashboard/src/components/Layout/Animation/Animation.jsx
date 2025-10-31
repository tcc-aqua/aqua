// src/components/Animation.js
"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

/**
 * AnimationWrapper
 * @param {React.ReactNode} children - componente(s) que receberão a animação
 * @param {number} delay - delay da animação
 */
export default function AnimationWrapper({ children, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
