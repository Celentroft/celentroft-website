import { profile } from "./config";

export interface DiscordGuild {
  name: string;
  icon: string | null;
  id: string;
  online: number;
  members: number;
  url: string;
}

export async function getDiscordGuild(): Promise<DiscordGuild | null> {
  const code = profile.discordInvite;
  if (!code) return null;
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${code}?with_counts=true`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    const d = (await res.json()) as {
      guild?: { id: string; name: string; icon: string | null };
      approximate_presence_count?: number;
      approximate_member_count?: number;
    };
    if (!d.guild) return null;
    return {
      id: d.guild.id,
      name: d.guild.name,
      icon: d.guild.icon
        ? `https://cdn.discordapp.com/icons/${d.guild.id}/${d.guild.icon}.png?size=128`
        : null,
      online: d.approximate_presence_count ?? 0,
      members: d.approximate_member_count ?? 0,
      url: `https://discord.gg/${code}`,
    };
  } catch {
    return null;
  }
}
