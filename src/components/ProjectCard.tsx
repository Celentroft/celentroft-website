"use client";

import { motion } from "framer-motion";
import  GithubButton from "./GithubButton";

export interface ProjectCardProps {
  title: string;
  category: string;
  language: string;
  description: string;
  image: string;
  githubLink: string;
  featured?: boolean;
}

const cardBaseClasses = `
  group relative overflow-hidden rounded-[32px]
  border border-white/10 bg-white/[0.03] backdrop-blur-xl
  transition-all duration-500
  hover:-translate-y-2 hover:border-violet-400/40
  hover:shadow-[0_0_60px_rgba(139,92,246,.25)]
`;

const featuredClasses = "lg:scale-110 lg:-translate-y-8 z-10";
const defaultClasses = "opacity-90 hover:opacity-100";

export default function ProjectCard({
  title,
  category,
  language,
  description,
  image,
  githubLink,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${cardBaseClasses} ${featured ? featuredClasses : defaultClasses}`}
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={`${title} project preview`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading={featured ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07040E] via-[#07040E]/20 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-md">
          {language}
        </span>
      </div>

      <div className="p-7">
        <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-violet-300">
          {category}
        </span>
        <h3 className="mt-4 text-3xl font-bold text-white">{title}</h3>
        <p className="mt-4 leading-relaxed text-gray-400">{description}</p>

        <div className="mt-8 flex justify-center">
          <GithubButton link={githubLink} />
        </div>
      </div>
    </motion.article>
  );
}