"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMail, FiGithub, FiMessageCircle } from "react-icons/fi";
import {
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaDiscord,
} from "react-icons/fa6";

const socialLinks = [
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/bst.wlr" },
  { label: "X / Twitter", icon: FaXTwitter, href: "https://x.com/1337_zk" },
  { label: "GitHub", icon: FiGithub, href: "https://github.com/Celentroft" },
  { label: "TikTok", icon: FaTiktok, href: "https://tiktok.com/@scarlxrd_1337" },
  { label: "Discord", icon: FaDiscord, href: "https://discord.com/users/1427003899939913809" },
];

const contactLinks = [
  { label: "Email", icon: FiMail, href: "mailto:scarlxrd_1337@cianigger.com" },
  { label: "GitHub", icon: FiGithub, href: "https://github.com/Celentroft" },
  { label: "Discord", icon: FiMessageCircle, href: "https://discord.com/users/1427003899939913809" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-violet-500/10 bg-[#05030a]">
      <div className="absolute left-1/2 top-0 h-40 w-[600px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-6 px-8 py-8 lg:flex-row lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={38}
            height={38}
            priority
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-white">Celentroft</p>
            <p className="text-xs text-zinc-500">Software Developer</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {contactLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              <Icon className="text-violet-400/70 transition-colors group-hover:text-violet-300" />
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:text-violet-300 hover:shadow-[0_0_16px_rgba(139,92,246,.3)]"
            >
              <Icon className="text-base" />
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-8 py-4 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {year} Celentroft. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built with Next.js & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
}
