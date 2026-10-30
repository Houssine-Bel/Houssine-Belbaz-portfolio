import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import type { LanguageItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import LiquidGlass from "./LiquidGlass";
import SectionHeading from "./SectionHeading";

const languageCodes = ["AR", "EN", "DE", "FR"];

export default function Languages() {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const rtl = i18n.resolvedLanguage === "ar";
  const items = t("languages.items", { returnObjects: true }) as LanguageItem[];

  return (
    <AnimatedSection
      id="languages"
      labelledBy="languages-title"
      className="languages-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <LiquidGlass className="language-glass" tilt={false}>
          <div className="language-composition">
            <div className="language-intro">
              <SectionHeading
                id="languages-title"
                label={t("languages.label")}
                title={t("languages.title")}
                description={t("languages.description")}
              />
              <div className="language-world" aria-hidden="true">
                <FiGlobe />
                <span>AR / EN / DE / FR</span>
              </div>
            </div>
            <div className="language-mosaic">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className="language-row"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: reducedMotion ? 0 : 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    duration: 0.65,
                    delay: reducedMotion ? 0 : index * 0.09,
                  }}
                >
                  <div className="language-row-top">
                    <span className="language-code">
                      {languageCodes[index]}
                    </span>
                    <span className="language-row-index" aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="language-level">{item.level}</p>
                  <div
                    className="language-meter"
                    role="progressbar"
                    aria-label={`${item.name}: ${item.level}`}
                    aria-valuenow={item.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <motion.span
                      variants={{
                        hidden: {
                          scaleX: reducedMotion ? item.value / 100 : 0,
                        },
                        visible: {
                          scaleX: item.value / 100,
                          transition: {
                            duration: reducedMotion ? 0.15 : 1.2,
                            delay: reducedMotion ? 0 : index * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      style={{ originX: rtl ? 1 : 0 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </LiquidGlass>
      </div>
    </AnimatedSection>
  );
}
