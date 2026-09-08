import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiAward, FiCheckCircle } from "react-icons/fi";
import type { CertificationItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const items = t("certifications.items", { returnObjects: true }) as CertificationItem[];

  return (
    <AnimatedSection id="certifications" labelledBy="certifications-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="certifications-title" label={t("certifications.label")} title={t("certifications.title")} centered />
        <motion.div
          className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
        >
          {items.map((item) => (
            <motion.article
              key={item.name}
              variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              className="glass premium-card holo-card group relative overflow-hidden rounded-2xl p-6 transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow-glow"
            >
              <FiAward className="absolute -end-3 -top-5 text-[7rem] text-white/[0.025] transition-colors group-hover:text-accent/[0.045]" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/20 bg-accent/[0.08] text-accent"><FiAward /></span>
                <FiCheckCircle className="verified-pulse text-emerald-300" />
              </div>
              <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.issuer}</p>
              <h3 className="relative mt-2 font-display text-lg font-semibold leading-7 text-white">{item.name}</h3>
              <span className="relative mt-5 inline-block rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-muted">{item.tag}</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
