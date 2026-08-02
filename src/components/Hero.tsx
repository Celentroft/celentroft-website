"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import FloatingBackground from "./FloatingBackground";
import LinksTree from "./LinksTree";
import ScrollIndicator from "./ScrollIndicator";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#09090B]">
      <FloatingBackground />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[180px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-20 px-8">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
          className="max-w-xl"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Software Developer
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-6xl font-bold tracking-tight text-white"
          >
            Celentroft
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-8 mt-6 text-lg leading-8 text-zinc-400"
          >
            I&apos;m a passionate Software Developer with experience across multiple
            programming languages, including Python, Java, JavaScript, Rust, and Go.
            I enjoy designing and building modern, scalable, and high-performance
            applications that solve real-world problems.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,.4)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(139,92,246,.6)] hover:brightness-110 active:scale-[0.98]"
            >
              See Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex gap-6">
            <LinksTree />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative hidden md:block"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-violet-600/20 blur-3xl" />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[2rem] bg-gradient-to-br from-violet-500/50 via-fuchsia-500/30 to-purple-500/50 p-[1.5px]"
          >
            <Image
              src="/lucy.gif"
              alt="Nathan"
              width={300}
              height={300}
              priority
              className="relative aspect-square rounded-[calc(2rem-1.5px)] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#09090B]/90 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
