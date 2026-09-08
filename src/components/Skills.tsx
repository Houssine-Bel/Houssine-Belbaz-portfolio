import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiBox,
  FiCode,
  FiDatabase,
  FiGitBranch,
  FiRepeat,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { SkillGroup } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const skillIcons: Record<SkillGroup["key"], IconType> = {
  frontend: FiCode,
  backend: FiBox,
  database: FiDatabase,
  devops: FiGitBranch,
  automation: FiRepeat,
  methods: FiUsers,
};

export default function Skills() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const groups = t("skills.groups", { returnObjects: true }) as SkillGroup[];

  return (
    <AnimatedSection id="skills" labelledBy="skills-title" className="px-5 sm:px-6">
      <div className="absolute inset-x-0 top-1/3 -z-10 h-80 bg-accent/[0.025] blur-[100px]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="skills-title"
          label={t("skills.label")}
          title={t("skills.title")}
          description={t("skills.description")}
          centered
        />

        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
        >
          {groups.map((group) => {
            const Icon = skillIcons[group.key];
            return (
              <motion.article
                key={group.key}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="glass premium-card skill-card group rounded-2xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <motion.span
                    className="skill-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/[0.08] text-accent"
                    whileHover={shouldReduceMotion ? undefined : { rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={21} />
                  </motion.span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted">{group.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="skill-chip rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-white/75 transition-colors group-hover:border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
