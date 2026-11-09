import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Stage, { type PanelDef } from "@/components/Stage";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import SceneLoader from "@/components/SceneLoader";
import TerminalSection from "@/components/TerminalSection";
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

  // One panel per screen of the pinned film (and per block of the phone layout).
  const panels: PanelDef[] = [
    { id: "top", label: "Home", node: <Hero github={github} discordUrl={guild?.url} /> },
    { id: "about", label: "About", node: <About /> },
    { id: "terminal", label: "Terminal", node: <TerminalSection github={github} discordUrl={guild?.url} /> },
    { id: "projects", label: "Projects", node: <Projects repos={github.repos} languages={github.languages} /> },
    ...(guild ? [{ id: "community", label: "Community", node: <Community guild={guild} /> }] : []),
    { id: "contact", label: "Contact", node: <Contact /> },
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
      <Loader />
      <Cursor />
      <SceneLoader />
      <ScrollProgress />
      <Navbar />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Stage panels={panels} />
      </main>
      <Footer />
      <CommandPalette items={items} />
      <ConsoleGreeting />
    </>
  );
}
