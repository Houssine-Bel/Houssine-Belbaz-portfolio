export type LocalizedStat = {
  value: string;
  label: string;
};

export type AboutCard = {
  number: string;
  title: string;
  description: string;
};

export type SkillGroup = {
  key: "frontend" | "backend" | "database" | "devops" | "automation" | "methods";
  title: string;
  description: string;
  items: string[];
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  date: string;
  summary: string;
  bullets: string[];
};

export type ProjectItem = {
  number: string;
  name: string;
  type: string;
  description: string;
  badge: string;
  imageAlts: string[];
  features: string[];
  tech: string[];
};

export type EducationItem = {
  degree: string;
  school: string;
  location: string;
  date: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  tag: string;
};

export type LanguageItem = {
  name: string;
  level: string;
  value: number;
};
