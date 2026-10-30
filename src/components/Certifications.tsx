import { useTranslation } from "react-i18next";
import { FiAward, FiCheckCircle } from "react-icons/fi";
import type { CertificationItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

export default function Certifications() {
  const { t } = useTranslation();
  const items = t("certifications.items", {
    returnObjects: true,
  }) as CertificationItem[];

  return (
    <AnimatedSection
      id="certifications"
      labelledBy="certifications-title"
      className="certifications-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="certifications-title"
          label={t("certifications.label")}
          title={t("certifications.title")}
          centered
        />
        <div className="credentials-grid mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <LiquidGlass
              key={`credential-${index}`}
              className={`credential-glass credential-glass-${index + 1}`}
              delay={index * 0.1}
            >
              <article className="credential-card">
                <FiAward className="credential-watermark" aria-hidden="true" />
                <div className="credential-topline">
                  <span className="credential-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </span>
                  <FiCheckCircle
                    className="credential-seal"
                    aria-hidden="true"
                  />
                </div>
                <span className="credential-mark">
                  <FiAward size={34} aria-hidden="true" />
                </span>
                <p className="credential-issuer">{item.issuer}</p>
                <h3 className="credential-title">{item.name}</h3>
                <div className="credential-bottom">
                  <span className="credential-tag">{item.tag}</span>
                  <span className="credential-signature" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </article>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
