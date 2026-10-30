import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiCode, FiCompass } from "react-icons/fi";
import type { AboutCard } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

const processIcons = [FiCompass, FiCode, FiCheckCircle];

export default function About() {
  const { t } = useTranslation();
  const cards = t("about.cards", { returnObjects: true }) as AboutCard[];

  return (
    <AnimatedSection
      id="about"
      labelledBy="about-title"
      className="about-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            id="about-title"
            label={t("about.label")}
            title={t("about.title")}
          />
          <LiquidGlass className="about-story-glass" tilt={false}>
            <div className="about-story-copy">
              <p className="text-lg leading-9 text-white/85 sm:text-xl">
                {t("about.description")}
              </p>
              <p className="mt-5 leading-8 text-muted">{t("about.body")}</p>
            </div>
          </LiquidGlass>
        </div>

        <div className="process-grid about-glass-grid mt-16 grid md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = processIcons[index % processIcons.length];
            return (
              <LiquidGlass
                key={card.number}
                className="process-glass"
                delay={index * 0.08}
              >
                <article className="process-step group">
                  <div className="process-glass-top">
                    <span className="process-number">{card.number}</span>
                    <span className="process-glass-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  </div>
                  <h3 className="mt-9 font-display text-2xl font-medium text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {card.description}
                  </p>
                  <span className="process-glass-line" aria-hidden="true" />
                </article>
              </LiquidGlass>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
