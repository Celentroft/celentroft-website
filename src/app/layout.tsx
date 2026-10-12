import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Effects from "@/components/Effects";
import Providers from "@/components/Providers";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#06030d",
  colorScheme: "dark",
};

const description =
  "Portfolio of Celentroft (Nathan) — a software developer building Discord bots, automations, and modern web applications with Python, TypeScript, Rust, and Go.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Celentroft — Software Developer",
    template: "%s | Celentroft",
  },
  description,
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
  alternates: { canonical: "/" },
  openGraph: {
    title: "Celentroft — Software Developer",
    description,
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Celentroft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Celentroft — Software Developer",
    description,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-violet-600 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white"
        >
          Skip to Content
        </a>
        <Providers>
          {children}
          <Effects />
        </Providers>
      </body>
    </html>
  );
}
