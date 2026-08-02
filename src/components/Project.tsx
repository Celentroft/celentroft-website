"use client";

import ProjectCard from "./ProjectCard";
import SectionBackground from "./SectionBackground";
import SectionHeader from "./SectionHeader";

interface Project {
  title: string;
  category: string;
  language: string;
  description: string;
  image: string;
  githubLink: string;
  featured?: boolean;
}

const projects: Project[] = [
    {
        title: "Purity",
        category: "Discord Bot",
        language: "Python",
        description: "A feature-rich Discord bot trusted by large communities — moderation, ticket management, automations, and over 90 slash commands.",
        githubLink: "https://github.com/Celentroft/purity",
        image: "/purity.jpg",
    },
    {
        title: "Portfolio",
        category: "Web Application",
        language: "TypeScript",
        description: "My personal portfolio built with Next.js and TailwindCSS — showcasing my projects, skills, and what I'm working on.",
        githubLink: "https://github.com/Celentroft/purity",
        image: "/portfolio.png",
        featured: true,
    },
    {
        title: "Middle Man Bot",
        category: "Discord Bot",
        language: "Python",
        description: "An automated middle-man system for secure crypto trades (LTC) with buyer and seller confirmations built in.",
        githubLink: "https://github.com/Celentroft/AutoMm-bot",
        image: "/mmbot.jpg",
    },
    ];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070608] px-6 py-28"
    >
      <SectionBackground />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeader
          badge="My Projects"
          title="Featured"
          highlight="Work"
          subtitle="A selection of projects I've built — from community-scale Discord bots to modern web applications."
        />

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3 lg:items-center">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}