import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowUpRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiGlobe,
  FiLock,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import type { ProjectItem } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

const projectImages = [
  [
    { src: "/images/projects/arz-crm.webp", width: 1914, height: 822 },
    {
      src: "/images/projects/arz-messaging-safe.jpg",
      width: 1600,
      height: 677,
    },
  ],
  [{ src: "/images/projects/think-os.webp", width: 1932, height: 814 }],
  [
    {
      src: "/images/projects/ai-content-agent-flow.svg",
      width: 1600,
      height: 700,
    },
    {
      src: "/images/projects/ai-content-agent-workflows.webp",
      width: 1278,
      height: 490,
    },
  ],
  [
    {
      src: "/images/projects/dental-center-home.webp",
      width: 1798,
      height: 920,
    },
    {
      src: "/images/projects/dental-center-services.webp",
      width: 1596,
      height: 906,
    },
  ],
];

function ProjectPreview({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const draggedRef = useRef(false);
  const previewRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const images = projectImages[index] ?? projectImages[0];
  const image = images[activeImage] ?? images[0];

  const openPreview = (trigger: HTMLButtonElement) => {
    previewRef.current = trigger;
    setLightboxOpen(true);
  };

  const showPreviousImage = () => {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previewButton = previewRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") {
        setActiveImage(
          (current) => (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % images.length);
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
      previewButton?.focus({ preventScroll: true });
    };
  }, [lightboxOpen, images.length]);

  return (
    <>
      <div className="project-preview">
        <div className="project-preview-topbar" aria-hidden="true">
          <span className="project-window-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="project-preview-name">{project.name}</span>
          <span className="project-preview-count" dir="ltr">
            {activeImage + 1} / {images.length}
          </span>
        </div>
        <motion.button
          type="button"
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onPointerDown={() => {
            draggedRef.current = false;
          }}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={(_, info) => {
            draggedRef.current = Math.abs(info.offset.x) > 8;
            if (info.offset.x < -50) {
              showNextImage();
            } else if (info.offset.x > 50) {
              showPreviousImage();
            }
          }}
          onClick={(event) => {
            if (draggedRef.current && event.detail !== 0) {
              event.preventDefault();
              return;
            }
            openPreview(event.currentTarget);
          }}
          className={`project-image-trigger [touch-action:pan-y] ${images.length > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
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
            initial={{ opacity: reducedMotion ? 1 : 0.35, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="project-screenshot"
          />
        </motion.button>

        <div className="project-preview-controls">
          <div className="project-gallery-navigation">
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label={t("projects.previousImage")}
                  className="project-gallery-arrow rtl:[&>svg]:-scale-x-100"
                >
                  <FiChevronLeft size={20} />
                </button>
                <div className="project-gallery-pages">
                  {images.map((candidate, imageIndex) => (
                    <button
                      key={candidate.src}
                      type="button"
                      onClick={() => setActiveImage(imageIndex)}
                      aria-label={t("projects.showImage", {
                        number: imageIndex + 1,
                      })}
                      aria-pressed={activeImage === imageIndex}
                      className="project-gallery-page"
                    >
                      {String(imageIndex + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label={t("projects.nextImage")}
                  className="project-gallery-arrow rtl:[&>svg]:-scale-x-100"
                >
                  <FiChevronRight size={20} />
                </button>
              </>
            ) : (
              <span className="project-gallery-single" aria-hidden="true" dir="ltr">
                01 / 01
              </span>
            )}
          </div>
          <button
            type="button"
            className="project-open-preview"
            onClick={(event) => openPreview(event.currentTarget)}
            aria-label={`${t("projects.viewPreview")} — ${project.name}`}
          >
            <span className="project-open-label">{t("projects.viewPreview")}</span>
            <FiMaximize2 aria-hidden="true" />
          </button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              ref={dialogRef}
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
                initial={{
                  opacity: 0,
                  scale: reducedMotion ? 1 : 0.96,
                  y: reducedMotion ? 0 : 18,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: reducedMotion ? 1 : 0.97,
                  y: reducedMotion ? 0 : 10,
                }}
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
                      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.01 }}
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
                  <span className="font-display text-sm font-semibold text-white sm:text-base">
                    {project.name}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65" dir="ltr">
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

function ProjectCard({
  project,
  index,
  total,
}: {
  project: ProjectItem;
  index: number;
  total: number;
}) {
  const { t } = useTranslation();
  const BadgeIcon = index === 2 ? FiCpu : index === 3 ? FiGlobe : FiLock;

  return (
    <article
      id={`project-${project.number}`}
      className={`work-project work-project-${index + 1} group`}
    >
      <LiquidGlass
        className={`project-liquid-card project-liquid-${index + 1}`}
        delay={index % 2 === 1 ? 0.1 : 0}
        tilt={false}
      >
        <div className="work-project-meta">
          <span dir="ltr">
            {project.number} / {String(total).padStart(2, "0")}
          </span>
          <span>
            <BadgeIcon aria-hidden="true" />
            {project.badge}
          </span>
        </div>
        <div className="work-project-visual">
          <ProjectPreview project={project} index={index} />
        </div>
        <div className="work-project-copy">
          <div className="work-project-title">
            <div>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
            </div>
            <a
              href="#contact"
              aria-label={`${t("projects.discuss")} — ${project.name}`}
              className="work-project-arrow"
            >
              <FiArrowUpRight className="rtl:-scale-x-100" />
            </a>
          </div>
          <p className="work-project-description">{project.description}</p>
          <ul className="work-project-features">
            {project.features.map((feature) => (
              <li key={feature}>
                <FiCheck aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="work-project-tech">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <a href="#contact" className="work-project-discuss">
            {t("projects.discuss")}
            <FiArrowUpRight className="rtl:-scale-x-100" />
          </a>
        </div>
      </LiquidGlass>
    </article>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const projects = t("projects.items", {
    returnObjects: true,
  }) as ProjectItem[];

  return (
    <AnimatedSection
      id="projects"
      labelledBy="projects-title"
      className="work-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="work-heading">
          <SectionHeading
            id="projects-title"
            label={t("projects.label")}
            title={t("projects.title")}
            description={t("projects.description")}
          />
          <span className="work-count" aria-hidden="true">
            ({String(projects.length).padStart(2, "0")})
          </span>
        </div>
        <nav className="work-index" aria-label={t("projects.label")}>
          {projects.map((project) => (
            <a key={project.number} href={`#project-${project.number}`}>
              <span>{project.number}</span>
              {project.name}
              <FiArrowUpRight className="rtl:-scale-x-100" />
            </a>
          ))}
        </nav>
        <div className="work-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
