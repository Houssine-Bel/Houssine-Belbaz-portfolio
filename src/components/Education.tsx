import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiBookOpen, FiMaximize2, FiMapPin, FiX } from "react-icons/fi";
import type { EducationItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const diplomaImages = [
  { src: "./images/diplomas/ensak-diploma.webp", width: 1484, height: 1060 },
  { src: "./images/diplomas/ofppt-diploma.webp", width: 1475, height: 1067 },
];

export default function Education() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const items = t("education.items", { returnObjects: true }) as EducationItem[];
  const [selectedDiploma, setSelectedDiploma] = useState<number | null>(null);

  useEffect(() => {
    if (selectedDiploma === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedDiploma(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDiploma]);

  const selectedImage = selectedDiploma === null ? null : diplomaImages[selectedDiploma];
  const selectedItem = selectedDiploma === null ? null : items[selectedDiploma];

  return (
    <AnimatedSection id="education" labelledBy="education-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <SectionHeading id="education-title" label={t("education.label")} title={t("education.title")} />
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
          >
            {items.map((item, index) => (
              <motion.article
                key={`education-${index}`}
                role="button"
                tabIndex={0}
                aria-label={`${t("education.viewDiploma")} — ${item.degree}`}
                onClick={() => setSelectedDiploma(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedDiploma(index);
                  }
                }}
                variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="glass premium-card education-card flex cursor-zoom-in flex-col gap-5 rounded-2xl p-6 transition-[border-color,box-shadow] hover:border-accent/35 hover:shadow-glow focus-visible:border-accent/50 sm:flex-row sm:items-start"
              >
                <span className="education-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/[0.08] text-accent"><FiBookOpen size={20} /></span>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <h3 className="max-w-lg font-display text-lg font-semibold leading-7 text-white">{item.degree}</h3>
                    <span className="shrink-0 text-xs text-accent">{item.date}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white/70">{item.school}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><FiMapPin /> {item.location}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent">
                    {t("education.viewDiploma")} <FiMaximize2 />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedImage && selectedItem && (
            <motion.div
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
                autoFocus
                onClick={() => setSelectedDiploma(null)}
                aria-label={t("education.closeDiploma")}
                className="absolute end-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-[#0b1320] text-white shadow-xl transition-colors hover:border-accent/60 hover:bg-accent hover:text-ink sm:end-6 sm:top-6"
              >
                <FiX size={22} />
              </button>

              <motion.div
                className="relative flex max-h-[92vh] w-full max-w-[94rem] flex-col overflow-hidden rounded-2xl border border-accent/25 bg-[#050a12] shadow-[0_0_90px_rgba(31,132,255,.22)]"
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
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
                  <p className="font-display text-sm font-semibold text-white sm:text-base">{selectedItem.degree}</p>
                  <p className="mt-1 text-xs text-muted">{selectedItem.school}</p>
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
