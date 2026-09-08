import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import type { AboutCard } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

export default function About() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const cards = t("about.cards", { returnObjects: true }) as AboutCard[];

  return (
    <AnimatedSection id="about" labelledBy="about-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="about-title" label={t("about.label")} title={t("about.title")} />
          <div className="lg:pt-10">
            <p className="text-lg leading-9 text-white/85 sm:text-xl">{t("about.description")}</p>
            <p className="mt-5 leading-8 text-muted">{t("about.body")}</p>
          </div>
        </div>

        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
        >
          {cards.map((card) => (
            <motion.article
              key={card.number}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="glass premium-card group rounded-2xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-xs font-semibold tracking-widest text-accent">{card.number}</span>
                <FiArrowUpRight className="text-white/25 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </div>
              <h3 className="mt-10 font-display text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
