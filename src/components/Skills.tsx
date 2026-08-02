"use client";

import { motion, type Variants } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiRust,
  SiGo,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiMariadb,
  SiSqlite,
  SiMysql,
  SiDocker,
  SiGit,
  SiKubernetes,
  SiTerraform,
  SiDeno,
  SiBun,
  SiZig,
  SiLinux
} from "react-icons/si";
import SectionBackground from "./SectionBackground";
import SectionHeader from "./SectionHeader";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Rust", icon: SiRust, color: "#DEA584" },
      { name: "Go", icon: SiGo, color: "#00ADD8" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "TailwindCSS", icon: SiTailwindcss, color: "#38BDF8" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "MariaDB", icon: SiMariadb, color: "#FFFFFF" },
      { name: "SQLite", icon: SiSqlite, color: "#0F80CC" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    ],
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Bun", icon: SiBun, color: "#FBF0DF" },
      { name: "Linux", icon: SiLinux, color: "#000000" },
    ],
  },
];

const exploring: Skill[] = [
  { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
  { name: "Terraform", icon: SiTerraform, color: "#844FBA" },
  { name: "Deno", icon: SiDeno, color: "#70FFAF" },
  { name: "Zig", icon: SiZig, color: "#F7A41D" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function SkillItem({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <motion.div
      variants={item}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-3 transition-colors duration-300 hover:border-white/15 hover:bg-white/6"
      style={{ ["--skill-color" as string]: skill.color }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/4 transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-[0_0_24px_var(--skill-color)]"
      >
        <Icon className="text-xl" style={{ color: skill.color }} />
      </span>
      <span className="truncate text-sm font-medium text-gray-200">
        {skill.name}
      </span>
    </motion.div>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  return (
    <motion.div
      variants={item}
      className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-violet-400/30"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-300">
        {category.title}
      </h3>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {category.skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070608] px-6 py-28"
    >
      <SectionBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeader
          badge="Skills"
          title="My"
          highlight="Tech Stack"
          subtitle="The languages, frameworks, and tools I use every day to build fast, reliable software."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {skillCategories.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}

          <motion.div
            variants={item}
            className="rounded-3xl border border-dashed border-violet-500/25 bg-violet-500/3 p-6"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-300">
              Currently Exploring
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {exploring.map((skill) => {
                const Icon = skill.icon;
                return (
                  <span
                    key={skill.name}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-300 hover:border-violet-400/40 hover:text-white"
                  >
                    <Icon className="text-base" style={{ color: skill.color }} />
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}