import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiDownload,
  FiGitBranch,
  FiLayers,
  FiTarget,
} from "react-icons/fi";
import { SiReact, SiLaravel, SiMysql, SiNodedotjs } from "react-icons/si";
import type { LocalizedStat } from "../types";
import useDesktopMotion from "../hooks/useDesktopMotion";

const statIcons = [FiLayers, FiCode, FiTarget];
const technologies = [
  { name: "React.js", icon: SiReact },
  { name: "Laravel", icon: SiLaravel },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "MySQL", icon: SiMysql },
];
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const desktopMotion = useDesktopMotion();
  const heroRef = useRef<HTMLElement>(null);
  const active = useInView(heroRef, { margin: "100px 0px" });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const rotateX = useSpring(pointerY, { stiffness: 110, damping: 22 });
  const stats = t("hero.stats", { returnObjects: true }) as LocalizedStat[];
  const language = i18n.resolvedLanguage ?? "fr";
  const cvPath =
    language === "fr"
      ? "/cv/Houssine-Belbaz-CV-FR.pdf"
      : "/cv/Houssine-Belbaz-CV-EN.pdf";
  const nameParts = t("hero.name").split(" ");
  const surname = nameParts.pop();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!desktopMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 7);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -7);
  };
  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };
  const reveal = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.15 : 0.85, ease },
    },
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="hero-section"
      data-active={active}
    >
      <div className="hero-container">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: reducedMotion ? 0 : 0.09 },
            },
          }}
        >
          <motion.div variants={reveal} className="availability-pill">
            <span className="status-dot" aria-hidden="true" />
            {t("hero.availability")}
          </motion.div>
          <motion.p variants={reveal} className="hero-eyebrow">
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            variants={reveal}
            className="hero-title"
            aria-label={`${t("hero.greeting")} ${t("hero.name")}`}
          >
            <span className="hero-greeting">{t("hero.greeting")}</span>
            <span className="hero-first-name">{nameParts.join(" ")}</span>{" "}
            <span className="hero-last-name">{surname}</span>
          </motion.h1>
          <motion.p variants={reveal} className="hero-headline">
            {t("hero.headlinePrefix")} <span>{t("hero.headlineAccent")}</span>
          </motion.p>
          <motion.p variants={reveal} className="hero-description">
            {t("hero.description")}
          </motion.p>
          <motion.div variants={reveal} className="hero-actions">
            <motion.a
              href="#projects"
              className="button-primary group"
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              {t("hero.primaryCta")}{" "}
              <FiArrowUpRight className="rtl:-scale-x-100" />
            </motion.a>
            <a href="#contact" className="button-secondary">
              {t("hero.secondaryCta")}{" "}
              <FiArrowUpRight className="rtl:-scale-x-100" />
            </a>
            <a href={cvPath} download className="hero-download">
              <FiDownload /> {t("hero.downloadCta")}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="portrait-stage"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: reducedMotion ? 0 : 0.25 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <motion.div
            className="portrait-composition"
            style={
              desktopMotion ? { rotateX, rotateY, y: portraitY } : undefined
            }
          >
            <div className="portrait-coordinate" aria-hidden="true">
              HB / 01
            </div>
            <div className="portrait-frame">
              <img
                src="/images/houssine-belbaz.jpg"
                alt={t("hero.imageAlt")}
                width="900"
                height="900"
                loading="eager"
                className="portrait-image"
              />
              <div className="portrait-caption">
                <span>{t("hero.name")}</span>
                <p>{t("hero.role")}</p>
              </div>
            </div>
            <div className="portrait-status">
              <FiCheckCircle aria-hidden="true" />{" "}
              <span>{t("hero.visualStatus")}</span>
            </div>
            <div className="hero-system-panel">
              <div className="system-panel-header">
                <FiLayers />
                <span>{t("hero.visualLabel")}</span>
                <span className="status-dot" aria-hidden="true" />
              </div>
              {[
                [t("hero.visualFrontend"), "React.js"],
                [t("hero.visualBackend"), "Laravel · Express"],
                [t("hero.visualData"), "MySQL"],
              ].map(([label, value], index) => (
                <div key={value} className="system-layer">
                  <span className="system-layer-number">0{index + 1}</span>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.85, duration: 0.7 }}
        >
          <div className="hero-stats">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] ?? FiLayers;
              return (
                <div className="hero-stat" key={index}>
                  <Icon className="hero-stat-icon" aria-hidden="true" />
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <a className="hero-explore" href="#about">
            <span>{t("hero.scroll")}</span>
            <FiArrowDown aria-hidden="true" />
          </a>
        </motion.div>
      </div>
      <div className="technology-strip" aria-label={t("skills.label")}>
        <div className="technology-strip-inner">
          {technologies.map(({ name, icon: Icon }) => (
            <span key={name}>
              <Icon aria-hidden="true" />
              {name}
            </span>
          ))}
          <span>
            <FiGitBranch aria-hidden="true" />
            n8n
          </span>
          <span className="technology-strip-note">{t("footer.tagline")}</span>
        </div>
      </div>
    </section>
  );
}
