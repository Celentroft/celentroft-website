import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette, { type PaletteItem } from "@/components/CommandPalette";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import { getGithubData } from "@/lib/github";
import { getDiscordGuild } from "@/lib/discord";
import { githubUrl, profile } from "@/lib/config";

export default async function Home() {
  const [github, guild] = await Promise.all([getGithubData(), getDiscordGuild()]);

  const items: PaletteItem[] = [
    { label: "About", hint: "section", href: "#about" },
    { label: "Projects", hint: "section", href: "#projects" },
    { label: "Contact", hint: "section", href: "#contact" },
    { label: "Open GitHub", hint: "github.com", href: githubUrl, external: true },
    ...(guild
      ? [{ label: "Join Discord", hint: "discord.gg", href: guild.url, external: true }]
      : []),
    { label: "Copy email", hint: profile.email, copy: profile.email },
    ...github.repos.slice(0, 6).map((r) => ({
      label: r.name,
      hint: `★ ${r.stars}`,
      href: r.url,
      external: true,
    })),
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero github={github} />
        <About />
        <Projects repos={github.repos} />
        <Community guild={guild} />
        <Contact />
      </main>
      <Footer />
      <CommandPalette items={items} />
      <ConsoleGreeting />
    </>
  );
}
