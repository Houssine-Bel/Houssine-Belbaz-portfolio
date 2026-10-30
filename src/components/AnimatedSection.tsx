import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type PropsWithChildren } from "react";

type AnimatedSectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  labelledBy?: string;
}>;

export default function AnimatedSection({
  id,
  className = "",
  labelledBy,
  children,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const sectionIsActive = useInView(sectionRef, { margin: "220px 0px" });

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      data-active={sectionIsActive}
      className={`content-auto-section relative py-20 md:py-28 lg:py-32 ${className}`}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.02, margin: "100px 0px" }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
