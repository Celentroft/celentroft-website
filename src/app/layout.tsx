import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Celentroft — Software Developer",
    template: "%s | Celentroft",
  },
  description:
    "Portfolio of Celentroft (Nathan) — a software developer building Discord bots, automations, and modern web applications with Python, JavaScript, Rust, and Go.",
  keywords: [
    "Celentroft",
    "Nathan",
    "Software Developer",
    "Discord Bot",
    "Portfolio",
    "Python",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Nathan (Celentroft)" }],
  creator: "Celentroft",
  openGraph: {
    title: "Celentroft — Software Developer",
    description:
      "Modern, scalable, and high-performance applications across Python, JavaScript, Rust, and Go.",
    type: "website",
    locale: "en_US",
    siteName: "Celentroft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Celentroft — Software Developer",
    description:
      "Modern, scalable, and high-performance applications across Python, JavaScript, Rust, and Go.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LoadingScreen />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
