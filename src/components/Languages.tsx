import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import type { LanguageItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

export default function Languages() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const items = t("languages.items", { returnObjects: true }) as LanguageItem[];

  return (
    <AnimatedSection id="languages" labelledBy="languages-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass premium-panel grid overflow-hidden rounded-[1.75rem] lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative border-b border-white/[0.07] p-7 sm:p-10 lg:border-b-0 lg:border-e">
            <FiGlobe className="orbit-globe absolute -bottom-10 -end-8 text-[11rem] text-accent/[0.055]" aria-hidden="true" />
            <div className="relative">
              <SectionHeading
                id="languages-title"
                label={t("languages.label")}
                title={t("languages.title")}
                description={t("languages.description")}
              />
            </div>
          </div>
          <motion.div
            className="grid content-center gap-7 p-7 sm:p-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
          >
            {items.map((item, index) => (
              <motion.div
                key={`language-${index}`}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
              >
                <div className="mb-2.5 flex items-end justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs text-muted">{item.level}</span>
                </div>
                <div className="language-track h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="language-progress h-full rounded-full bg-gradient-to-r from-accent/60 to-accent shadow-[0_0_14px_rgba(94,184,255,.35)] rtl:bg-gradient-to-l"
                    initial={{ width: shouldReduceMotion ? `${item.value}%` : 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: shouldReduceMotion ? 0.2 : 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
