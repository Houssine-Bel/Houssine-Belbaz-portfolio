import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import About from "./components/About";
import AmbientBackground from "./components/AmbientBackground";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Languages from "./components/Languages";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function updateMeta(name: string, content: string, property = false) {
  const attribute = property ? "property" : "name";
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage ?? "fr");
  const [switching, setSwitching] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const isRtl = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.title = t("seo.title");
    updateMeta("description", t("seo.description"));
    updateMeta("keywords", t("seo.keywords"));
    updateMeta("og:title", t("seo.title"), true);
    updateMeta("og:description", t("seo.description"), true);
    updateMeta("og:type", "website", true);
    updateMeta("og:locale", language === "fr" ? "fr_FR" : language === "ar" ? "ar_MA" : language === "de" ? "de_DE" : "en_US", true);
    const socialImage = new URL("./og-image.png", window.location.href).href;
    updateMeta("og:image", socialImage, true);
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", t("seo.title"));
    updateMeta("twitter:description", t("seo.description"));
    updateMeta("twitter:image", socialImage);
  }, [isRtl, language, t]);

  const handleLanguageChange = (nextLanguage: string) => {
    if (nextLanguage === language || switching) return;
    setSwitching(true);
    window.setTimeout(async () => {
      await i18n.changeLanguage(nextLanguage);
      localStorage.setItem("portfolio-language", nextLanguage);
      setLanguage(nextLanguage);
      window.setTimeout(() => setSwitching(false), 30);
    }, 200);
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-accent shadow-[0_0_12px_rgba(94,184,255,.7)] rtl:origin-right"
        style={{ scaleX: progress }}
      />
      <AmbientBackground />
      <CustomCursor />
      <motion.div animate={{ opacity: switching ? 0 : 1 }} transition={{ duration: 0.2 }}>
        <Header language={language} onLanguageChange={handleLanguageChange} />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Languages />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
