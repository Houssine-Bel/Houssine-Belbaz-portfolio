import { useTranslation } from "react-i18next";
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import BrandMark from "./BrandMark";

const socialLinks = [
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/houssine-belbaz-0244052b8/", label: "LinkedIn" },
  { icon: FiGithub, href: "https://github.com/Houssine-Bel", label: "GitHub" },
  { icon: FiMail, href: "mailto:belbaz.houssine@gmail.com", label: "Email" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/[0.07] px-5 py-8 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <a href="#home" className="group flex items-center gap-3 rounded-xl" aria-label="Houssine Belbaz">
          <BrandMark className="transition-colors group-hover:border-accent/60" />
          <span>
            <span className="block font-display text-lg font-semibold text-white">Houssine Belbaz</span>
            <span className="mt-1 block text-xs text-muted">{t("footer.tagline")}</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] text-muted transition-all hover:-translate-y-1 hover:border-accent/40 hover:text-accent"><Icon /></a>
          ))}
          <a href="#home" aria-label={t("footer.backToTop")} className="ms-2 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-xs text-muted transition-all hover:-translate-y-1 hover:border-accent/40 hover:text-accent">
            <FiArrowUp /> <span className="hidden md:inline">{t("footer.backToTop")}</span>
          </a>
        </div>
      </div>
      <div className="mx-auto mt-7 max-w-7xl border-t border-white/[0.05] pt-5 text-[11px] text-muted/70">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
