"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}

export default function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
}: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-16 text-center"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300"
      >
        {badge}
      </motion.span>
      <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {title}{" "}
        {highlight && <span className="text-violet-300">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">{subtitle}</p>
      )}
    </motion.header>
  );
}
