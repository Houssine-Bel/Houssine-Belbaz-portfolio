import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiMapPin } from "react-icons/fi";
import type { ExperienceItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

export default function Experience() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const items = t("experience.items", {
    returnObjects: true,
  }) as ExperienceItem[];

  return (
    <AnimatedSection
      id="experience"
      labelledBy="experience-title"
      className="experience-section px-5 sm:px-6"
    >
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

          <div ref={timelineRef} className="relative ps-8 sm:ps-12">
            <span
              className="absolute bottom-0 start-[5px] top-2 w-px bg-white/10 sm:start-[7px]"
              aria-hidden="true"
            />
            <motion.span
              className="journey-progress absolute bottom-0 start-[5px] top-2 w-px origin-top bg-accent sm:start-[7px]"
              style={{ scaleY: shouldReduceMotion ? 1 : lineProgress }}
              aria-hidden="true"
            />

            {items.map((item, index) => (
              <article
                key={`experience-${index}`}
                className={`journey-timeline-item relative ${index < items.length - 1 ? "pb-14" : ""}`}
              >
                <span
                  className="timeline-node absolute -start-[2.15rem] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-ink ring-1 ring-accent sm:-start-[3.05rem] sm:h-4 sm:w-4"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(94,184,255,.9)]" />
                </span>

                <LiquidGlass className="journey-glass" delay={index * 0.08}>
                  <div className="timeline-card journey-entry">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                          {item.company}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                          {item.role}
                        </h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                          <FiMapPin /> {item.location}
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/70">
                        {item.date}
                      </span>
                    </div>

                    <p className="mt-6 leading-8 text-white/80">{item.summary}</p>
                    <ul className="mt-5 space-y-3">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-sm leading-7 text-muted"
                        >
                          <FiCheck className="mt-1.5 shrink-0 text-accent" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </LiquidGlass>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
