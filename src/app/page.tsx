import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette, { type PaletteItem } from "@/components/CommandPalette";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import ScrollProgress from "@/components/ScrollProgress";
import { getGithubData } from "@/lib/github";
import { getDiscordGuild } from "@/lib/discord";
import { githubUrl, profile } from "@/lib/config";
import { siteUrl } from "@/lib/site";

export default async function Home() {
  const [github, guild] = await Promise.all([getGithubData(), getDiscordGuild()]);

  const items: PaletteItem[] = [
    { id: "about", group: "Navigate", label: "About", hint: "section", href: "#about" },
    { id: "projects", group: "Navigate", label: "Projects", hint: "section", href: "#projects" },
    { id: "contact", group: "Navigate", label: "Contact", hint: "section", href: "#contact" },
    { id: "top", group: "Navigate", label: "Back to Top", hint: "↑", href: "#top" },
    {
      id: "github",
      group: "Links",
      label: "Open GitHub",
      hint: `github.com/${profile.github}`,
      href: githubUrl,
      external: true,
    },
    ...(guild
      ? [
          {
            id: "discord",
            group: "Links",
            label: "Join Discord",
            hint: "discord.gg",
            href: guild.url,
            external: true,
          },
        ]
      : []),
    { id: "email", group: "Links", label: "Copy Email", hint: profile.email, copy: profile.email },
    ...github.repos.slice(0, 6).map((repo) => ({
      id: `repo-${repo.name}`,
      group: "Projects",
      label: repo.name,
      hint: `★ ${repo.stars}`,
      href: repo.url,
      external: true,
    })),
    {
      id: "hire",
      group: "Fun",
      label: "sudo hire me",
      hint: "try it",
      href: "#contact",
      fx: "burst",
    },
    { id: "matrix", group: "Fun", label: "Enter the Matrix", hint: "wake up…", fx: "matrix" },
  ];

  // Structured data for search engines. "<" is escaped to keep the payload inert in HTML.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.realName,
    alternateName: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    sameAs: [githubUrl],
    address: { "@type": "PostalAddress", addressLocality: "Nancy", addressCountry: "FR" },
    knowsAbout: ["Python", "TypeScript", "Rust", "Go", "Discord bots", "Web development"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero github={github} discordUrl={guild?.url} />
        <About />
        <Projects repos={github.repos} languages={github.languages} />
        <Community guild={guild} />
        <Contact />
      </main>
      <Footer />
      <CommandPalette items={items} />
      <ConsoleGreeting />
    </>
  );
}
