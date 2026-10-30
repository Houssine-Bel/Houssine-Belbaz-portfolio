import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiMaximize2,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import type { EducationItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

const diplomaImages = [
  { src: "/images/diplomas/ensak-diploma.webp", width: 1484, height: 1060 },
  { src: "/images/diplomas/ofppt-diploma.webp", width: 1475, height: 1067 },
];

export default function Education() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const items = t("education.items", {
    returnObjects: true,
  }) as EducationItem[];
  const [selectedDiploma, setSelectedDiploma] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedDiploma === null) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedDiploma(null);
      }
      if (event.key === "Tab") {
        const buttons =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [selectedDiploma]);

  const selectedImage =
    selectedDiploma === null ? null : diplomaImages[selectedDiploma];
  const selectedItem = selectedDiploma === null ? null : items[selectedDiploma];

  return (
    <AnimatedSection
      id="education"
      labelledBy="education-title"
      className="education-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="education-layout grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div className="education-intro lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="education-title"
              label={t("education.label")}
              title={t("education.title")}
            />
            <FiBookOpen className="education-section-mark" aria-hidden="true" />
          </div>
          <div className="education-list space-y-5">
            {items.map((item, index) => (
              <LiquidGlass
                key={`education-${index}`}
                className="education-glass"
                delay={index * 0.08}
              >
                <article className="education-card">
                  <button
                    type="button"
                    className="education-glass-button block w-full cursor-zoom-in text-start"
                    aria-label={`${t("education.viewDiploma")} — ${item.degree}`}
                    aria-haspopup="dialog"
                    aria-controls={
                      selectedDiploma === index
                        ? "education-diploma-dialog"
                        : undefined
                    }
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedDiploma(index);
                    }}
                  >
                    <span className="education-card-top">
                      <span className="education-chapter" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(items.length).padStart(2, "0")}
                      </span>
                      <span className="education-date">{item.date}</span>
                    </span>
                    <span className="education-card-content">
                      <span className="education-icon">
                        <FiBookOpen size={24} aria-hidden="true" />
                      </span>
                      <span className="education-main">
                        <span className="education-school">{item.school}</span>
                        <span
                          role="heading"
                          aria-level={3}
                          className="education-degree"
                        >
                          {item.degree}
                        </span>
                        <span className="education-location">
                          <FiMapPin aria-hidden="true" />
                          {item.location}
                        </span>
                      </span>
                    </span>
                    <span className="education-card-footer">
                      <span className="education-preview-label">
                        <FiMaximize2 aria-hidden="true" />
                        {t("education.viewDiploma")}
                      </span>
                      <span className="education-preview-arrow">
                        <FiArrowUpRight
                          className="rtl:-scale-x-100"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </button>
                </article>
              </LiquidGlass>
            ))}
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedImage && selectedItem && (
            <motion.div
              id="education-diploma-dialog"
              ref={dialogRef}
              className="fixed inset-0 z-[200] grid place-items-center bg-[#02060d]/95 p-3 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`${t("education.diplomaPreview")} — ${selectedItem.degree}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedDiploma(null)}
            >
              <button
                type="button"
                onClick={() => setSelectedDiploma(null)}
                aria-label={t("education.closeDiploma")}
                className="absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-[#0b1320] text-white shadow-xl transition-colors hover:border-accent/60 hover:bg-accent hover:text-ink sm:end-6 sm:top-6"
              >
                <FiX size={22} />
              </button>

              <motion.div
                className="relative flex max-h-[92vh] w-full max-w-[94rem] flex-col overflow-hidden rounded-2xl border border-accent/25 bg-[#050a12] shadow-[0_0_90px_rgba(31,132,255,.22)]"
                initial={{
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.96,
                  y: shouldReduceMotion ? 0 : 18,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.97,
                  y: shouldReduceMotion ? 0 : 10,
                }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid min-h-0 flex-1 place-items-center overflow-auto p-2 sm:p-4">
                  <img
                    src={selectedImage.src}
                    alt={`${t("education.diplomaPreview")} — ${selectedItem.degree}`}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    decoding="async"
                    draggable={false}
                    className="max-h-[80vh] w-full select-none object-contain"
                  />
                </div>
                <div className="border-t border-white/10 bg-[#0b1320] px-4 py-3 sm:px-6">
                  <p className="font-display text-sm font-semibold text-white sm:text-base">
                    {selectedItem.degree}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {selectedItem.school}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </AnimatedSection>
  );
}
