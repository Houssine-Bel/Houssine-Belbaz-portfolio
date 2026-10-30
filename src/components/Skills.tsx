import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiBox,
  FiCode,
  FiDatabase,
  FiGitBranch,
  FiLayers,
  FiRepeat,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { SkillGroup } from "../types";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import LiquidGlass from "./LiquidGlass";

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
  const reducedMotion = useReducedMotion();
  const groups = t("skills.groups", { returnObjects: true }) as SkillGroup[];

  return (
    <AnimatedSection
      id="skills"
      labelledBy="skills-title"
      className="skills-section px-5 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="skills-layout">
          <div className="skills-intro">
            <SectionHeading
              id="skills-title"
              label={t("skills.label")}
              title={t("skills.title")}
              description={t("skills.description")}
            />
            <div className="skills-signature" aria-hidden="true">
              <FiLayers />
              <span>01 / 02 / 03</span>
            </div>
          </div>
          <LiquidGlass className="stack-panel skills-stack-glass" tilt={false}>
            <div className="stack-panel-heading">
              <span>
                <FiLayers aria-hidden="true" /> Full-Stack
              </span>
              <span className="stack-panel-status">
                <span className="status-dot" aria-hidden="true" />
                {t("hero.visualStatus")}
              </span>
            </div>
            {groups.slice(0, 3).map((group, index) => {
              const Icon = skillIcons[group.key];
              return (
                <motion.article
                  key={group.key}
                  className="stack-layer"
                  initial={{ opacity: 0, x: reducedMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.6,
                    delay: reducedMotion ? 0 : index * 0.08,
                  }}
                >
                  <div className="stack-layer-top">
                    <span className="stack-index">0{index + 1}</span>
                    <Icon aria-hidden="true" />
                    <h3>{group.title}</h3>
                    <span className="status-dot" aria-hidden="true" />
                  </div>
                  <p>{group.description}</p>
                  <ul className="stack-technologies">
                    {group.items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </LiquidGlass>
        </div>
        <div className="support-skills">
          {groups.slice(3).map((group, index) => {
            const Icon = skillIcons[group.key];
            return (
              <LiquidGlass
                key={group.key}
                className="support-glass"
                delay={index * 0.08}
              >
                <article className="support-skill-card">
                  <div className="support-skill-title">
                    <Icon aria-hidden="true" />
                    <h3>{group.title}</h3>
                    <span>0{index + 4}</span>
                  </div>
                  <p>{group.description}</p>
                  <ul>
                    {group.items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              </LiquidGlass>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
