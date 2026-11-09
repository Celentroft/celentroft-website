export type Lang = "en" | "fr";

const en = {
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.contact": "Contact",
  "nav.search": "Search",
  "hero.status": "Open to Opportunities",
  "hero.lead":
    "{role} building Discord bots, automations and web applications that hold up in production — from community-scale tooling to clean, fast interfaces.",
  "hero.cta1": "View Projects",
  "hero.lastPush": "last push",
  "hero.stars": "GitHub stars",
  "hero.repos": "Repositories",
  "hero.followers": "Followers",
  "hero.scroll": "Scroll",
  "about.label": "01 — About",
  "about.title": "Building Things That Last",
  "about.p1":
    "I’m {name}, a software developer based in {location}. I work across Python, TypeScript, Rust and Go, with a focus on reliable, well-structured software.",
  "about.p2":
    "Most of my recent work is Discord tooling — moderation, ticketing and automation systems used by large communities — which taught me a lot about performance, security and shipping things people actually depend on.",
  "terminal.label": "02 — Terminal",
  "terminal.title": "Talk to my terminal",
  "terminal.hint": "Type help, or just click a command.",
  "projects.label": "03 — Projects",
  "projects.title": "Open Source, Live from GitHub",
  "projects.all": "All Repositories",
  "community.label": "Community",
  "community.online": "online",
  "community.members": "members",
  "community.join": "Join the Server",
  "contact.label": "04 — Contact",
  "contact.title": "Let’s Work Together",
  "contact.lead": "Have a project in mind or want to talk? My inbox is open.",
  "contact.location": "Location",
  "footer.rights": "All rights reserved.",
  "footer.press": "Press",
  "footer.navigate": "to navigate ·",
  "footer.top": "Back to Top",
} as const;

export type Key = keyof typeof en;

const fr: Record<Key, string> = {
  "nav.about": "À propos",
  "nav.projects": "Projets",
  "nav.contact": "Contact",
  "nav.search": "Rechercher",
  "hero.status": "Ouvert aux opportunités",
  "hero.lead":
    "{role} : bots Discord, automatisations et applications web qui tiennent en production — des outils pour communautés aux interfaces rapides et soignées.",
  "hero.cta1": "Voir les projets",
  "hero.lastPush": "dernier push",
  "hero.stars": "Étoiles GitHub",
  "hero.repos": "Dépôts",
  "hero.followers": "Abonnés",
  "hero.scroll": "Défiler",
  "about.label": "01 — À propos",
  "about.title": "Du code fait pour durer",
  "about.p1":
    "Je suis {name}, développeur logiciel basé à {location}. Je travaille en Python, TypeScript, Rust et Go, avec un souci de logiciels fiables et bien structurés.",
  "about.p2":
    "L’essentiel de mon travail récent, ce sont des outils Discord — modération, tickets et automatisation pour de grandes communautés — qui m’ont appris la performance, la sécurité et à livrer des choses dont les gens dépendent vraiment.",
  "terminal.label": "02 — Terminal",
  "terminal.title": "Parle à mon terminal",
  "terminal.hint": "Tape help, ou clique sur une commande.",
  "projects.label": "03 — Projets",
  "projects.title": "Open source, en direct de GitHub",
  "projects.all": "Tous les dépôts",
  "community.label": "Communauté",
  "community.online": "en ligne",
  "community.members": "membres",
  "community.join": "Rejoindre le serveur",
  "contact.label": "04 — Contact",
  "contact.title": "Travaillons ensemble",
  "contact.lead": "Un projet en tête ou envie d’échanger ? Ma boîte mail est ouverte.",
  "contact.location": "Localisation",
  "footer.rights": "Tous droits réservés.",
  "footer.press": "Appuie sur",
  "footer.navigate": "pour naviguer ·",
  "footer.top": "Retour en haut",
};

export const dictionaries: Record<Lang, Record<Key, string>> = { en, fr };
