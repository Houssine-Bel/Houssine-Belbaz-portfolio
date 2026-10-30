import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";
import BrandMark from "./BrandMark";

type HeaderProps = {
  language: string;
  onLanguageChange: (language: string) => void;
};

const navItems = ["home", "about", "skills", "experience", "projects", "contact"] as const;
const languages = ["fr", "en", "de", "ar"];

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item))
      .filter((section): section is HTMLElement => Boolean(section));
    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260);
      let currentSection: (typeof navItems)[number] = navItems[0];

      for (const section of sections) {
        if (section.offsetTop <= marker) currentSection = section.id as (typeof navItems)[number];
      }

      setActiveSection((current) => current === currentSection ? current : currentSection);
    };

    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleNavigate = () => setMenuOpen(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="glass studio-header mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 sm:px-5">
        <a
          href="#home"
          onClick={handleNavigate}
          className="group flex items-center gap-3 rounded-lg"
          aria-label="Houssine Belbaz"
        >
          <BrandMark className="transition-colors group-hover:border-accent/60" />
          <span className="hidden font-display text-sm font-medium tracking-tight text-white sm:block">
            {t("hero.name")}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`group relative rounded-lg px-3 py-2 text-sm transition-colors ${
                activeSection === item ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              {t(`nav.${item}`)}
              <span
                className={`absolute inset-x-3 -bottom-px h-px origin-center bg-accent transition-transform duration-300 ${
                  activeSection === item ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1" aria-label={t("nav.language")}>
            {languages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onLanguageChange(item)}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all sm:px-2.5 ${
                  language === item
                    ? "bg-accent text-ink shadow-[0_0_18px_rgba(94,184,255,.2)]"
                    : "text-muted hover:text-white"
                }`}
                aria-pressed={language === item}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white transition-colors hover:border-accent/40 hover:bg-accent/10 lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-3 lg:hidden"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            aria-label="Navigation mobile"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={handleNavigate}
                className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                  activeSection === item ? "bg-accent/10 text-accent" : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {t(`nav.${item}`)}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
