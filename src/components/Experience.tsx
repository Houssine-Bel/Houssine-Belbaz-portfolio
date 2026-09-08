import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiCheck, FiMapPin } from "react-icons/fi";
import type { ExperienceItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const items = t("experience.items", { returnObjects: true }) as ExperienceItem[];

  return (
    <AnimatedSection id="experience" labelledBy="experience-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="experience-title"
              label={t("experience.label")}
              title={t("experience.title")}
              description={t("experience.description")}
            />
          </div>

          <div className="relative ps-8 sm:ps-12">
            <motion.span
              className="timeline-line absolute bottom-0 start-[5px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent/25 to-transparent sm:start-[7px]"
              initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />

            {items.map((item, index) => (
              <motion.article
                key={`experience-${index}`}
                className={`relative ${index < items.length - 1 ? "pb-14" : ""}`}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : index * 0.1 }}
              >
                <span className="timeline-node absolute -start-[2.15rem] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-ink ring-1 ring-accent sm:-start-[3.05rem] sm:h-4 sm:w-4" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(94,184,255,.9)]" />
                </span>

                <div className="glass premium-card timeline-card rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">{item.company}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">{item.role}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><FiMapPin /> {item.location}</p>
                    </div>
                    <span className="w-fit rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/70">{item.date}</span>
                  </div>

                  <p className="mt-6 leading-8 text-white/80">{item.summary}</p>
                  <ul className="mt-5 space-y-3">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-7 text-muted">
                        <FiCheck className="mt-1.5 shrink-0 text-accent" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
