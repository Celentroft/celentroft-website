"use client";

import { motion } from "framer-motion";
import {
  FiCode,
  FiCpu,
  FiHeart,
  FiUsers,
  FiZap,
  FiShield,
  FiTerminal,
} from "react-icons/fi";
import SectionBackground from "./SectionBackground";
import SectionHeader from "./SectionHeader";

const stats = [
  { value: "3+", label: "Years Coding" },
  { value: "10+", label: "Projects Built" },
  { value: "5+", label: "Languages" },
  { value: "∞", label: "Coffee Cups" },
];

const focusAreas = [
  {
    icon: FiZap,
    title: "Performance",
    description: "Building fast, scalable systems that stay snappy under load.",
  },
  {
    icon: FiShield,
    title: "Security",
    description: "Writing secure bots and apps — from auth to input validation.",
  },
  {
    icon: FiUsers,
    title: "Community",
    description: "Crafting tools for large communities, not just small groups.",
  },
  {
    icon: FiTerminal,
    title: "Automation",
    description: "Automating the boring parts so humans can focus on what matters.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070608] px-6 py-28"
    >
      <SectionBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeader
          badge="About Me"
          title="Who"
          highlight="Am I?"
          subtitle="A quick look at who I am, what I do, and what drives me."
        />

        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8 lg:col-span-3"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                  <FiCode className="text-xl" />
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Hi, I&apos;m Celentroft
                </h3>
              </div>

              <div className="space-y-4 leading-relaxed text-gray-400">
                <p>
                  I&apos;m a passionate Software Developer with hands-on experience across
                  multiple languages — <span className="text-gray-200">Python</span>,{" "}
                  <span className="text-gray-200">Java</span>,{" "}
                  <span className="text-gray-200">JavaScript</span>,{" "}
                  <span className="text-gray-200">Rust</span> and{" "}
                  <span className="text-gray-200">Go</span>.
                </p>
                <p>
                  I enjoy designing and building modern, scalable, and high-performance
                  applications that solve real-world problems. My most recent focus is
                  building Discord bots and automation systems that serve large communities.
                </p>
                <p>
                  When I&apos;m not writing code, you&apos;ll probably find me learning a new
                  language, exploring a new framework, or improving the tools I use every day.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {focusAreas.map(({ icon: Icon, title, description }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4 }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300 transition-colors duration-300 group-hover:bg-violet-500/20">
                    <Icon className="text-xl" />
                  </span>
                  <h4 className="font-semibold text-white">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: stats + quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6 lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-5">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl transition-colors duration-300 hover:border-violet-400/40"
                >
                  <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-4xl font-bold text-transparent">
                    {value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                  <FiHeart className="text-xl" />
                </span>
                <h4 className="font-semibold text-white">Quick Facts</h4>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <FiCpu className="shrink-0 text-violet-400" />
                  Based in Strasbourg, France
                </li>
                <li className="flex items-center gap-3">
                  <FiTerminal className="shrink-0 text-violet-400" />
                  Linux enjoyer &amp; automation nerd
                </li>
                <li className="flex items-center gap-3">
                  <FiUsers className="shrink-0 text-violet-400" />
                  Built tools for 100k+ user communities
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
