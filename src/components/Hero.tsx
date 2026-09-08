import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiDownload,
  FiLayers,
  FiTarget,
} from "react-icons/fi";
import type { LocalizedStat } from "../types";
import HeroBackground from "./HeroBackground";
import PortraitOrbit from "./PortraitOrbit";

const statVisuals = [
  { icon: FiLayers, shell: "border-blue-400/20 bg-blue-500/10 text-blue-300", line: "bg-blue-400" },
  { icon: FiCode, shell: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300", line: "bg-fuchsia-400" },
  { icon: FiTarget, shell: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300", line: "bg-emerald-400" },
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const heroIsActive = useInView(heroRef, { margin: "180px 0px" });
  const stats = t("hero.stats", { returnObjects: true }) as LocalizedStat[];
  const language = i18n.resolvedLanguage ?? "fr";
  const cvPath = language === "fr" ? "./cv/Houssine-Belbaz-CV-FR.pdf" : "./cv/Houssine-Belbaz-CV-EN.pdf";

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section ref={heroRef} id="home" className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:pt-36">
      <HeroBackground active={heroIsActive} />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10">
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            {t("hero.availability")}
          </motion.div>

          <motion.p variants={item} className="mb-4 font-display text-sm font-medium tracking-wide text-accent">
            {t("hero.eyebrow")}
          </motion.p>

          <motion.h1 variants={item} className="text-balance font-display text-[clamp(2.75rem,7vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            <span className="block text-white/55">{t("hero.greeting")}</span>
            <span className="block">{t("hero.name")}</span>
          </motion.h1>

          <motion.h2 variants={item} className="text-balance mt-7 max-w-3xl font-display text-xl font-medium leading-snug tracking-[-0.025em] text-white sm:text-2xl lg:text-3xl">
            {t("hero.headlinePrefix")} <span className="text-accent drop-shadow-[0_0_18px_rgba(94,184,255,.22)]">{t("hero.headlineAccent")}</span>
          </motion.h2>

          <motion.p variants={item} className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {t("hero.description")}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#projects"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-ink shadow-[0_12px_35px_rgba(94,184,255,.18)] transition-[filter] hover:brightness-110"
            >
              {t("hero.primaryCta")}
              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/[0.035] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent/45 hover:bg-accent/[0.07]"
            >
              {t("hero.secondaryCta")}
            </motion.a>
            <motion.a
              href={cvPath}
              download
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              <FiDownload />
              {t("hero.downloadCta")}
            </motion.a>
          </motion.div>

          <motion.div variants={item} className="mt-12 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
            {stats.map((stat, index) => {
              const visual = statVisuals[index] ?? statVisuals[0];
              const Icon = visual.icon;
              return (
                <div key={stat.label} className="group flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
                  <motion.span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${visual.shell}`}
                    whileHover={shouldReduceMotion ? undefined : { y: -3, rotate: index === 1 ? 4 : -4, scale: 1.05 }}
                  >
                    <Icon size={18} />
                  </motion.span>
                  <span className="min-w-0">
                    <strong className="block font-display text-xl font-semibold text-white sm:text-2xl">{stat.value}</strong>
                    <span className="mt-1 block text-[10px] leading-4 text-muted sm:text-xs sm:leading-5">{stat.label}</span>
                    <span className={`mt-2 block h-px w-6 ${visual.line}`} aria-hidden="true" />
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto block w-full max-w-[26rem] sm:max-w-[31rem]"
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-10 rounded-full bg-accent/15 blur-[90px]" aria-hidden="true" />

          <PortraitOrbit layer="back" active={heroIsActive} />

          <motion.div
            className="relative z-10 rounded-[2rem] bg-gradient-to-br from-[#70caff] via-blue-500/30 to-blue-700/70 p-px shadow-[0_0_70px_rgba(30,126,255,.2)]"
            animate={shouldReduceMotion || !heroIsActive ? { y: 0, boxShadow: "0 0 42px rgba(30,126,255,.12)" } : {
              y: [0, -5, 0],
              boxShadow: ["0 0 42px rgba(30,126,255,.12)", "0 0 85px rgba(30,126,255,.32)", "0 0 42px rgba(30,126,255,.12)"],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rounded-[1.95rem] bg-[#07101d]/95 p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#0a101c]">
                <img
                  src="./images/houssine-belbaz.jpg"
                  alt={t("hero.imageAlt")}
                  width="900"
                  height="900"
                  fetchPriority="high"
                  className="h-full w-full scale-[1.025] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101d] via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 rounded-[1.55rem] shadow-[inset_0_0_45px_rgba(10,98,220,.16)]" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-2xl font-semibold text-white">{t("hero.name")}</p>
                  <p className="mt-1 text-sm text-accent">{t("hero.role")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <PortraitOrbit layer="front" active={heroIsActive} />

          <motion.div
            className="glass absolute -end-8 top-10 z-30 hidden rounded-2xl p-4 shadow-glow lg:block"
            animate={shouldReduceMotion || !heroIsActive ? { y: 0 } : { y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-display text-xs font-medium text-white">{t("hero.visualLabel")}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-300"><FiCheckCircle /> {t("hero.visualStatus")}</p>
          </motion.div>

          <motion.div
            className="glass absolute -start-10 top-[44%] z-30 hidden w-52 rounded-2xl p-4 shadow-glow lg:block"
            animate={shouldReduceMotion || !heroIsActive ? { y: 0 } : { y: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: -2 }}
          >
            <div className="flex items-center justify-between text-[10px] text-muted"><span>{t("hero.visualFrontend")}</span><span className="text-accent">React.js</span></div>
            <div className="my-2 h-px bg-white/[0.07]" />
            <div className="flex items-center justify-between text-[10px] text-muted"><span>{t("hero.visualBackend")}</span><span className="text-accent">Laravel · Express</span></div>
            <div className="my-2 h-px bg-white/[0.07]" />
            <div className="flex items-center justify-between text-[10px] text-muted"><span>{t("hero.visualData")}</span><span className="text-accent">MySQL</span></div>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-7 start-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-muted transition-colors hover:text-accent sm:flex rtl:translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {t("hero.scroll")}
        <FiArrowDown className={shouldReduceMotion ? "" : "animate-bounce"} />
      </motion.a>
    </section>
  );
}
