import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiArrowUpRight,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

type ContactLink = {
  icon: IconType;
  labelKey: string;
  value: string;
  href?: string;
};

const contactLinks: ContactLink[] = [
  {
    icon: FiMail,
    labelKey: "emailLabel",
    value: "belbaz.houssine@gmail.com",
    href: "mailto:belbaz.houssine@gmail.com",
  },
  {
    icon: FiPhone,
    labelKey: "phoneLabel",
    value: "+212 654 84 04 55",
    href: "tel:+212654840455",
  },
  {
    icon: FiLinkedin,
    labelKey: "linkedinLabel",
    value: "Houssine Belbaz",
    href: "https://www.linkedin.com/in/houssine-belbaz-0244052b8/",
  },
  { icon: FiMapPin, labelKey: "locationLabel", value: "location" },
];

const inputClasses =
  "mt-2 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 text-sm text-white placeholder:text-white/25 transition-colors hover:border-white/15 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10";

export default function Contact() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatedSection
      id="contact"
      labelledBy="contact-title"
      className="px-5 pb-16 sm:px-6 md:pb-20"
    >
      <div className="mx-auto max-w-7xl">
        <LiquidGlass
          className="contact-stage studio-contact contact-liquid p-5 sm:p-8 lg:p-12"
          tilt={false}
        >
          <div className="relative grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
            <div>
              <SectionHeading
                id="contact-title"
                label={t("contact.label")}
                title={t("contact.title")}
                description={t("contact.description")}
              />

              <div className="mt-10">
                <p className="mb-4 font-display text-sm font-semibold text-white">
                  {t("contact.detailsTitle")}
                </p>
                <div className="contact-tiles">
                  {contactLinks.map(({ icon: Icon, labelKey, value, href }) => {
                    const content = (
                      <>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-accent transition-transform group-hover:rotate-3 group-hover:scale-105">
                          <Icon />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] uppercase tracking-[0.16em] text-muted">
                            {t(`contact.${labelKey}`)}
                          </span>
                          <span className="mt-1 block truncate text-sm text-white/80">
                            {value === "location"
                              ? t("contact.location")
                              : value}
                          </span>
                        </span>
                        {href && (
                          <FiArrowUpRight className="ms-auto shrink-0 text-white/25 transition-colors group-hover:text-accent rtl:-scale-x-100" />
                        )}
                      </>
                    );
                    return href ? (
                      <a
                        key={labelKey}
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                        className="contact-link contact-tile group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.035]"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={labelKey}
                        className="contact-tile flex items-center gap-3 rounded-xl p-2"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <LiquidGlass
              className="contact-form-glass"
              tilt={false}
              reveal={false}
            >
              <form
                action="https://formsubmit.co/belbaz.houssine@gmail.com"
                method="POST"
                className="contact-form rounded-2xl p-5 sm:p-7"
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="Nouveau message depuis le portfolio"
                />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="text"
                  name="_honey"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="contact-form-caption">
                  <FiMessageSquare aria-hidden="true" />
                  <span>{t("contact.label")}</span>
                  <span className="status-dot" aria-hidden="true" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs font-medium text-white/70">
                    {t("contact.form.name")}
                    <input
                      className={inputClasses}
                      type="text"
                      name="name"
                      placeholder={t("contact.form.namePlaceholder")}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="text-xs font-medium text-white/70">
                    {t("contact.form.email")}
                    <input
                      className={inputClasses}
                      type="email"
                      name="email"
                      placeholder={t("contact.form.emailPlaceholder")}
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>
                <label className="mt-5 block text-xs font-medium text-white/70">
                  {t("contact.form.subject")}
                  <input
                    className={inputClasses}
                    type="text"
                    name="subject"
                    placeholder={t("contact.form.subjectPlaceholder")}
                    required
                  />
                </label>
                <label className="mt-5 block text-xs font-medium text-white/70">
                  {t("contact.form.message")}
                  <textarea
                    className={`${inputClasses} min-h-36 resize-y`}
                    name="message"
                    placeholder={t("contact.form.messagePlaceholder")}
                    required
                  />
                </label>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-[10px] leading-5 text-muted">
                    {t("contact.form.privacy")}
                  </p>
                  <motion.button
                    type="submit"
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.03 }
                    }
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    className="send-button inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-ink shadow-[0_12px_35px_rgba(94,184,255,.16)] transition-[filter] hover:brightness-110"
                  >
                    {t("contact.form.submit")}{" "}
                    <FiSend className="rtl:-scale-x-100" />
                  </motion.button>
                </div>
              </form>
            </LiquidGlass>
          </div>
        </LiquidGlass>
      </div>
    </AnimatedSection>
  );
}
