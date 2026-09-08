import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight, FiCheck, FiChevronLeft, FiChevronRight, FiCpu, FiLock, FiMaximize2, FiX } from "react-icons/fi";
import type { ProjectItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const projectImages = [
  [
    { src: "./images/projects/arz-crm.webp", width: 1914, height: 822 },
    { src: "./images/projects/arz-messaging-safe.jpg", width: 1600, height: 677 },
  ],
  [{ src: "./images/projects/think-os.webp", width: 1932, height: 814 }],
  [
    { src: "./images/projects/ai-content-agent-flow.svg", width: 1600, height: 700 },
    { src: "./images/projects/ai-content-agent-workflows.webp", width: 1278, height: 490 },
  ],
  [
    { src: "./images/projects/dental-center-home.webp", width: 1798, height: 920 },
    { src: "./images/projects/dental-center-services.webp", width: 1596, height: 906 },
  ],
];

function ProjectPreview({ project, index }: { project: ProjectItem; index: number }) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const draggedRef = useRef(false);
  const images = projectImages[index] ?? projectImages[0];
  const image = images[activeImage] ?? images[0];

  const showPreviousImage = () => {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") {
        setActiveImage((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % images.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, images.length]);

  return (
    <>
      <div className="project-preview group/preview relative aspect-[2.28/1] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050a12]">
      <motion.button
        type="button"
        drag={images.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.16}
        dragMomentum={false}
        onPointerDown={() => { draggedRef.current = false; }}
        onDragEnd={(_, info) => {
          draggedRef.current = Math.abs(info.offset.x) > 8;
          if (info.offset.x < -50) {
            showNextImage();
          } else if (info.offset.x > 50) {
            showPreviousImage();
          }
        }}
        onClick={() => {
          if (draggedRef.current) {
            draggedRef.current = false;
            return;
          }
          setLightboxOpen(true);
        }}
        className={`absolute inset-0 block w-full [touch-action:pan-y] ${images.length > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
        aria-label={`${t("projects.viewPreview")} — ${project.name}`}
      >
        <motion.img
          key={image.src}
          src={image.src}
          alt={project.imageAlts[activeImage] ?? project.name}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          initial={{ opacity: 0.35, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="h-full w-full object-contain transition duration-500 ease-out group-hover/preview:scale-[1.018] group-focus-visible/preview:scale-[1.018]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-black/5 opacity-75 transition-opacity duration-300 group-hover/preview:opacity-95" aria-hidden="true" />
        <span className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-ink/90 px-3 py-2 text-[11px] font-medium text-white shadow-xl transition-colors group-hover/preview:border-accent/50 group-hover/preview:text-accent">
          {t("projects.viewPreview")} <FiMaximize2 />
        </span>
        <span className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-ink/90 px-2.5 py-1.5 text-[10px] text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,.8)]" />
          {project.name}
        </span>
      </motion.button>

      {images.length > 1 && (
        <>
          <span className="absolute end-3 top-3 z-10 rounded-full border border-white/10 bg-ink/90 px-2.5 py-1.5 text-[10px] font-semibold text-white/80">
            {activeImage + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={showPreviousImage}
            aria-label={t("projects.previousImage")}
            className="absolute start-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl border border-white/15 bg-ink/90 text-white shadow-xl transition-all hover:border-accent/60 hover:bg-accent hover:text-ink rtl:[&>svg]:-scale-x-100"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={showNextImage}
            aria-label={t("projects.nextImage")}
            className="absolute end-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl border border-white/15 bg-ink/90 text-white shadow-xl transition-all hover:border-accent/60 hover:bg-accent hover:text-ink rtl:[&>svg]:-scale-x-100"
          >
            <FiChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 start-3 z-10 flex gap-1 rounded-xl border border-white/10 bg-ink/90 p-1 shadow-xl">
            {images.map((candidate, imageIndex) => (
              <button
                key={candidate.src}
                type="button"
                onClick={() => setActiveImage(imageIndex)}
                aria-label={t("projects.showImage", { number: imageIndex + 1 })}
                aria-pressed={activeImage === imageIndex}
                className={`grid h-7 min-w-7 place-items-center rounded-lg px-2 text-[10px] font-semibold transition-all duration-300 ${activeImage === imageIndex ? "bg-accent text-ink" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                {String(imageIndex + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </>
      )}
      </div>

      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              className="fixed inset-0 z-[200] grid place-items-center bg-[#02060d]/95 p-3 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`${t("projects.viewPreview")} — ${project.name}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label={t("projects.closePreview")}
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
                <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden p-2 sm:p-4">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={image.src}
                      src={image.src}
                      alt={project.imageAlts[activeImage] ?? project.name}
                      width={image.width}
                      height={image.height}
                      draggable={false}
                      initial={{ opacity: 0, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="max-h-[80vh] w-full select-none object-contain"
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={showPreviousImage}
                        aria-label={t("projects.previousImage")}
                        className="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl border border-white/15 bg-ink/90 text-white shadow-xl transition-all hover:border-accent hover:bg-accent hover:text-ink sm:start-5 sm:h-12 sm:w-12 rtl:[&>svg]:-scale-x-100"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        onClick={showNextImage}
                        aria-label={t("projects.nextImage")}
                        className="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl border border-white/15 bg-ink/90 text-white shadow-xl transition-all hover:border-accent hover:bg-accent hover:text-ink sm:end-5 sm:h-12 sm:w-12 rtl:[&>svg]:-scale-x-100"
                      >
                        <FiChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#0b1320] px-4 py-3 sm:px-6">
                  <span className="font-display text-sm font-semibold text-white sm:text-base">{project.name}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                    {activeImage + 1} / {images.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const projects = t("projects.items", { returnObjects: true }) as ProjectItem[];

  return (
    <AnimatedSection id="projects" labelledBy="projects-title" className="px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="projects-title"
          label={t("projects.label")}
          title={t("projects.title")}
          description={t("projects.description")}
        />

        <motion.div
          className="mt-14 grid gap-5 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } } }}
        >
          {projects.map((project, index) => (
            <motion.article
              key={`project-${index}`}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="glass premium-card project-card group rounded-[1.5rem] p-3 transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-glow sm:p-4"
            >
              <ProjectPreview project={project} index={index} />
              <div className="p-3 pt-6 sm:p-5 sm:pt-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xs font-semibold tracking-[0.2em] text-accent">{project.number}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted">{project.type}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[10px] text-white/55">
                    {index === 2 ? <FiCpu /> : <FiLock />} {project.badge}
                  </span>
                </div>

                <p className="mt-6 leading-8 text-white/75">{project.description}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-muted"><FiCheck className="shrink-0 text-accent" /> {feature}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
                  {project.tech.map((tech) => <span key={tech} className="rounded-lg bg-accent/[0.07] px-2.5 py-1.5 text-[11px] font-medium text-accent/90">{tech}</span>)}
                </div>
                <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent">
                  {t("projects.discuss")}
                  <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
