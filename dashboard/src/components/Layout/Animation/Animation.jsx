"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

/**
 * AnimationWrapper
 * @param {React.ReactNode} children - componente(s) que receberão a animação
 * @param {number} delay - delay da animação
 */
export default function AnimationWrapper({ children, delay = 0 }) {
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [mounted, setMounted] = useState(false); // evita flash inicial

  useEffect(() => {
    // Lê do localStorage se animação está habilitada
    const stored = localStorage.getItem("enableAnimations");
    setEnableAnimations(stored === null ? true : JSON.parse(stored));

    // Garante que só aplicaremos animação após o componente montar
    setMounted(true);

    const handler = (e) => setEnableAnimations(!!e.detail);
    window.addEventListener("toggle-animations", handler);

    return () => window.removeEventListener("toggle-animations", handler);
  }, []);

  // Se ainda não montou, renderiza vazio para evitar flash
  if (!mounted) return <>{children}</>;

  // Se animação desativada, renderiza diretamente sem motion
  if (!enableAnimations) return <>{children}</>;

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
