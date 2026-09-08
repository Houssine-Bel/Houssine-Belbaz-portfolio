import { motion, useReducedMotion } from "framer-motion";

type SectionHeadingProps = {
  id: string;
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export default function SectionHeading({
  id,
  label,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.65 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.09 } },
      }}
    >
      <div className={`mb-5 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <motion.span
          className="h-px w-8 origin-left bg-accent shadow-[0_0_10px_rgba(94,184,255,.75)] rtl:origin-right"
          variants={{ hidden: { scaleX: shouldReduceMotion ? 1 : 0 }, visible: { scaleX: 1, transition: { duration: .55 } } }}
          aria-hidden="true"
        />
        <motion.span
          className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent"
          variants={{ hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 }, visible: { opacity: 1, x: 0, transition: { duration: .45 } } }}
        >
          {label}
        </motion.span>
      </div>
      <motion.h2
        id={id}
        className="text-balance font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
        variants={{
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22, filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: .65, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg"
          variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 }, visible: { opacity: 1, y: 0, transition: { duration: .55 } } }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
