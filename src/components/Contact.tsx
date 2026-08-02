"use client";

import { motion } from "framer-motion";
import { FiMail, FiGithub, FiMessageCircle, FiMapPin } from "react-icons/fi";
import SectionBackground from "./SectionBackground";
import SectionHeader from "./SectionHeader";

const contactChannels = [
  {
    label: "Email",
    value: "scarlxrd_1337@cianigger.com",
    icon: FiMail,
    href: "mailto:scarlxrd_1337@cianigger.com",
  },
  {
    label: "GitHub",
    value: "github.com/Celentroft",
    icon: FiGithub,
    href: "https://github.com/Celentroft",
  },
  {
    label: "Discord",
    value: "celentroft",
    icon: FiMessageCircle,
    href: "https://discord.com/users/1427003899939913809",
  },
  {
    label: "Location",
    value: "Strasbourg, France",
    icon: FiMapPin,
    href: undefined,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070608] px-6 py-28"
    >
      <SectionBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeader
          badge="Contact"
          title="Let's"
          highlight="Work Together"
          subtitle="Have a project in mind or just want to say hi? My inbox is always open."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactChannels.map(({ label, value, icon: Icon, href }) => {
            const inner = (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300 transition-colors duration-300 group-hover:border-violet-400/50 group-hover:bg-violet-500/20 group-hover:text-violet-200">
                  <Icon className="text-2xl" />
                </span>
                <span className="mt-4 block text-xs uppercase tracking-wider text-gray-500">
                  {label}
                </span>
                <span className="mt-1 block truncate text-base font-medium text-gray-200 transition-colors duration-300 group-hover:text-white">
                  {value}
                </span>
              </>
            );

            const className =
              "group flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_0_40px_rgba(139,92,246,.15)]";

            return href ? (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className={className}
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className={className}
              >
                {inner}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
