"use client";

import { motion } from "framer-motion";
import {
  FaDocker,
  FaReact,
  FaJava,
  FaGitAlt,
  FaPython,
  FaRust,
  FaJs,
  FaCss3,
  FaShapes,
} from "react-icons/fa";

import {
  SiKubernetes,
} from "react-icons/si";

const icons = [
  { Icon: FaPython, top: "8%", left: "8%", size: 90 },
  { Icon: FaReact, top: "18%", right: "12%", size: 110 },
  { Icon: FaRust, bottom: "15%", left: "12%", size: 100 },
  { Icon: FaJs, top: "45%", left: "35%", size: 80 },
  { Icon: FaCss3, bottom: "20%", right: "20%", size: 90 },
  { Icon: FaShapes, top: "65%", left: "70%", size: 80 },
  { Icon: SiKubernetes, top: "30%", right: "38%", size: 100 },
  { Icon: FaGitAlt, bottom: "8%", right: "8%", size: 85 },
];

export default function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {icons.map(({ Icon, size, ...position }, index) => (
        <motion.div
          key={index}
          className="absolute text-violet-500/10"
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 10 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

    </div>
  );
}