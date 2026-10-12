"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, triggerFx } from "@/lib/fx";

export interface TerminalRepo {
  name: string;
  url: string;
  stars: number;
  language: string | null;
}

export interface TerminalProps {
  repos: TerminalRepo[];
  stats: { repos: number; stars: number; followers: number };
  profile: {
    name: string;
    realName: string;
    role: string;
    location: string;
    email: string;
    github: string;
    discordUser: string;
  };
  githubUrl: string;
  discordUrl?: string;
}

type Entry = { id: number; node: React.ReactNode };

const SECTIONS = ["about", "projects", "contact"] as const;

const COMMAND_NAMES = [
  "about",
  "cat",
  "cd",
  "clear",
  "contact",
  "date",
  "discord",
  "echo",
  "email",
  "exit",
  "github",
  "goto",
  "help",
  "ls",
  "matrix",
  "neofetch",
  "open",
  "projects",
  "pwd",
  "skills",
  "sudo",
  "whoami",
];

const QUICK_COMMANDS = ["help", "projects", "contact", "neofetch"];

const LOGO = [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"];

/* ---------- tiny presentational helpers ---------- */

function Prompt({ children }: { children?: React.ReactNode }) {
  return (
    <p className="break-words text-zinc-100">
      <span aria-hidden="true" className="mr-2 select-none text-violet-500">
        $
      </span>
      {children}
    </p>
  );
}

function Out({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`whitespace-pre-wrap break-words text-violet-300/90 ${className}`}>{children}</p>
  );
}

function Hl({ children }: { children: React.ReactNode }) {
  return <span className="text-violet-100">{children}</span>;
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-violet-200 underline decoration-violet-500/50 underline-offset-2 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

function HelpBlock({ hasDiscord }: { hasDiscord: boolean }) {
  const rows: [string, string][] = [
    ["about", "who is behind this"],
    ["skills", "languages & tools"],
    ["projects", "repositories, live from GitHub"],
    ["open <repo>", "open a repository"],
    ["contact", "how to reach me"],
    ["email", "copy my email address"],
    ["github", "open my GitHub profile"],
    ...(hasDiscord ? ([["discord", "join the community"]] as [string, string][]) : []),
    ["goto <section>", "about · projects · contact"],
    ["neofetch", "system info"],
    ["clear", "clear the screen"],
  ];
  return (
    <div className="space-y-1">
      <Out>available commands</Out>
      <div className="grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-0.5">
        {rows.map(([command, description]) => (
          <Fragment key={command}>
            <span className="text-violet-100">{command}</span>
            <span className="text-zinc-400">{description}</span>
          </Fragment>
        ))}
      </div>
      <Out className="text-zinc-500">there are a few hidden ones too. good luck.</Out>
    </div>
  );
}

function Neofetch({ rows }: { rows: [string, string][] }) {
  const lines: React.ReactNode[] = [
    <Fragment key="title">
      <span className="text-violet-300">celentroft</span>@<span className="text-violet-300">portfolio</span>
    </Fragment>,
    <span key="rule" className="text-zinc-600">
      {"─".repeat(22)}
    </span>,
    ...rows.map(([label, value]) => (
      <Fragment key={label}>
        <span className="text-violet-400">{label.padEnd(9)}</span>
        {value}
      </Fragment>
    )),
  ];
  return (
    <pre className="overflow-x-auto font-mono leading-[1.2] text-zinc-300">
      {lines.map((line, i) => (
        <div key={i}>
          <span className="text-violet-500">{(LOGO[i] ?? "").padEnd(11)}</span>
          {line}
        </div>
      ))}
    </pre>
  );
}

/* ---------- utilities ---------- */

function distance(a: string, b: string) {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array<number>(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

function commonPrefix(words: string[]) {
  let prefix = words[0] ?? "";
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/* ---------- the terminal ---------- */

export default function Terminal({ repos, stats, profile, githubUrl, discordUrl }: TerminalProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typing, setTyping] = useState("");
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");

  const idRef = useRef(0);
  const skipRef = useRef(false);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const draft = useRef("");
  const timers = useRef<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = useCallback((...nodes: React.ReactNode[]) => {
    const items = nodes.map((node) => ({ id: idRef.current++, node }));
    setEntries((prev) => [...prev, ...items].slice(-200));
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  /* Intro: types a few commands, then hands the prompt over to the visitor. */
  const { name, role } = profile;
  const repoCount = repos.length;
  useEffect(() => {
    let cancelled = false;
    skipRef.current = prefersReducedMotion();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        if (skipRef.current) resolve();
        else window.setTimeout(resolve, ms);
      });

    const steps: { cmd: string; out: string }[] = [
      { cmd: "whoami", out: `${name.toLowerCase()} — ${role.toLowerCase()}` },
      { cmd: "cat stack.txt", out: "python · typescript · rust · go" },
      { cmd: "ls projects/ | wc -l", out: `${repoCount} open-source projects` },
      { cmd: "echo $STATUS", out: "open to opportunities" },
    ];

    (async () => {
      await wait(600);
      for (const step of steps) {
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return;
          setTyping(step.cmd.slice(0, i));
          await wait(36 + Math.random() * 38);
        }
        await wait(200);
        if (cancelled) return;
        setTyping("");
        push(<Prompt>{step.cmd}</Prompt>, <Out>{step.out}</Out>);
        await wait(240);
      }
      if (cancelled) return;
      push(
        <Out className="text-zinc-500">
          type <Hl>help</Hl> to look around.
        </Out>,
      );
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [name, role, repoCount, push]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, typing, ready]);

  const go = useCallback((id: string) => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    if (id === "top") window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior });
  }, []);

  const findRepo = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return (
        repos.find((r) => r.name.toLowerCase() === q) ??
        repos.find((r) => r.name.toLowerCase().startsWith(q)) ??
        repos.find((r) => r.name.toLowerCase().includes(q))
      );
    },
    [repos],
  );

  const showProjects = useCallback(() => {
    if (repos.length === 0) {
      push(
        <Out>
          no repositories loaded right now — try <Hl>github</Hl>.
        </Out>,
      );
      return;
    }
    push(
      <div className="space-y-1">
        <Out>{repos.length} projects, most starred first</Out>
        {repos.slice(0, 6).map((repo) => (
          <p key={repo.name} className="break-words">
            <span className="mr-2 inline-block min-w-[4ch] tabular-nums text-violet-400">
              ★ {repo.stars}
            </span>
            <Ext href={repo.url}>{repo.name}</Ext>
            {repo.language && <span className="text-zinc-500">  {repo.language.toLowerCase()}</span>}
          </p>
        ))}
        <Out className="text-zinc-500">
          tip: <Hl>open &lt;name&gt;</Hl> opens a repository.
        </Out>
      </div>,
    );
  }, [repos, push]);

  const execute = useCallback(
    (raw: string) => {
      const [first, ...rest] = raw.split(/\s+/);
      const cmd = first.toLowerCase();
      const arg = rest.join(" ");

      switch (cmd) {
        case "help":
        case "?":
          push(<HelpBlock hasDiscord={Boolean(discordUrl)} />);
          return;

        case "about":
          push(
            <Out>
              hi, i&rsquo;m <Hl>{profile.realName}</Hl> — a {profile.role.toLowerCase()} based in{" "}
              {profile.location}.{"\n"}i build discord bots, automation and web apps that hold up in
              production.
            </Out>,
          );
          return;

        case "skills":
        case "stack":
          push(
            <Out>
              {"languages  python · typescript · javascript · rust · go\n"}
              {"web        next.js · react · tailwind · node.js\n"}
              {"data       postgresql · mongodb · sqlite\n"}
              {"infra      docker · linux · nginx · git"}
            </Out>,
          );
          return;

        case "projects":
          showProjects();
          return;

        case "ls":
          if (/projects/i.test(arg)) showProjects();
          else push(<Out>about/ projects/ contact/ README.md</Out>);
          return;

        case "open": {
          if (!arg) {
            push(
              <Out>
                usage: <Hl>open &lt;repo&gt;</Hl> — try <Hl>projects</Hl> first.
              </Out>,
            );
            return;
          }
          const repo = findRepo(arg);
          if (!repo) {
            push(
              <Out>
                open: no repository matches <Hl>{arg}</Hl>.
              </Out>,
            );
            return;
          }
          window.open(repo.url, "_blank", "noopener,noreferrer");
          push(
            <Out>
              opening <Ext href={repo.url}>{repo.name}</Ext>…
            </Out>,
          );
          return;
        }

        case "github":
          window.open(githubUrl, "_blank", "noopener,noreferrer");
          push(
            <Out>
              opening <Ext href={githubUrl}>github.com/{profile.github}</Ext>…
            </Out>,
          );
          return;

        case "discord":
          if (discordUrl) {
            window.open(discordUrl, "_blank", "noopener,noreferrer");
            push(
              <Out>
                opening <Ext href={discordUrl}>{discordUrl.replace("https://", "")}</Ext>…
              </Out>,
            );
          } else {
            push(
              <Out>
                find me on discord: <Hl>{profile.discordUser}</Hl>
              </Out>,
            );
          }
          return;

        case "contact":
          push(
            <Out>
              {"email     "}
              <Ext href={`mailto:${profile.email}`}>{profile.email}</Ext>
              {"\ngithub    "}
              <Ext href={githubUrl}>github.com/{profile.github}</Ext>
              {"\ndiscord   "}
              <Hl>{profile.discordUser}</Hl>
              {"\nlocation  "}
              {profile.location}
            </Out>,
          );
          return;

        case "email":
          navigator.clipboard.writeText(profile.email).then(
            () =>
              push(
                <Out>
                  copied <Hl>{profile.email}</Hl> to the clipboard.
                </Out>,
              ),
            () => push(<Out>{profile.email}</Out>),
          );
          return;

        case "cd":
        case "goto": {
          const target = arg.replace(/^[./~]+/, "").replace(/\/$/, "").toLowerCase() || "top";
          const id = target === "home" ? "top" : target;
          if (id === "top" || (SECTIONS as readonly string[]).includes(id)) {
            push(<Out>→ {id === "top" ? "top" : `/${id}`}</Out>);
            later(250, () => go(id));
          } else {
            push(
              <Out>
                {cmd}: no such section: <Hl>{arg}</Hl> (try about, projects, contact)
              </Out>,
            );
          }
          return;
        }

        case "cat":
          if (/^readme(\.md)?$/i.test(arg)) {
            push(
              <Out>
                {"# celentroft\n\nsoftware developer — python / typescript / rust / go.\ndiscord bots, automation, web apps.\nopen to opportunities."}
              </Out>,
            );
          } else {
            push(
              <Out>
                cat: {arg || "missing file"}: no such file or directory (try README.md)
              </Out>,
            );
          }
          return;

        case "pwd":
          push(<Out>/home/celentroft/portfolio</Out>);
          return;

        case "whoami":
          push(<Out>{profile.name.toLowerCase()}</Out>);
          return;

        case "date":
          push(
            <Out>
              {new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(
                new Date(),
              )}
            </Out>,
          );
          return;

        case "echo":
          push(<Out>{arg}</Out>);
          return;

        case "clear":
          setEntries([]);
          return;

        case "neofetch":
          push(
            <Neofetch
              rows={[
                ["Role", profile.role],
                ["Location", profile.location],
                ["Stack", "Python · TS · Rust · Go"],
                ["Repos", `${stats.repos} public · ★ ${stats.stars}`],
                ["Status", "open to opportunities"],
              ]}
            />,
          );
          return;

        case "matrix":
          if (prefersReducedMotion()) {
            push(<Out>matrix: skipped — your system asks for reduced motion.</Out>);
          } else {
            push(<Out>wake up…</Out>);
            triggerFx("matrix");
          }
          return;

        case "sudo":
          if (/^hire\s+(me|celentroft|nathan)$/i.test(arg)) {
            push(<Out>[sudo] password for recruiter: ••••••••</Out>);
            later(700, () => push(<Out className="text-emerald-300">access granted. wise decision.</Out>));
            later(1400, () => {
              push(<Out>opening contact…</Out>);
              triggerFx("burst");
            });
            later(1900, () => go("contact"));
          } else {
            push(<Out>recruiter is not in the sudoers file. this incident will be reported.</Out>);
          }
          return;

        case "rm":
          push(
            <Out>
              {/-\w*r\w*f|-\w*f\w*r|\s\/(\s|$)/.test(raw)
                ? "rm: nice try. everything here is version controlled."
                : "rm: permission denied."}
            </Out>,
          );
          return;

        case "exit":
        case "logout":
        case "quit":
          push(<Out>logout: there is no escape. scroll down instead.</Out>);
          return;

        case "vim":
        case "vi":
        case "nano":
        case "emacs":
          push(<Out>{cmd}: you can get in, but getting out is on you.</Out>);
          return;

        default: {
          const [nearest, score] = COMMAND_NAMES.map((c) => [c, distance(cmd, c)] as const).sort(
            (a, b) => a[1] - b[1],
          )[0];
          push(
            <Out>
              command not found: <Hl>{first}</Hl>
              {score <= 2 ? (
                <>
                  {" "}
                  — did you mean <Hl>{nearest}</Hl>?
                </>
              ) : (
                <>
                  {" "}
                  — type <Hl>help</Hl>
                </>
              )}
            </Out>,
          );
        }
      }
    },
    [push, later, go, findRepo, showProjects, profile, stats, githubUrl, discordUrl],
  );

  const runCommand = useCallback(
    (raw: string) => {
      const text = raw.trim();
      push(<Prompt>{text}</Prompt>);
      if (!text) return;
      history.current = [...history.current.slice(-49), text];
      cursor.current = -1;
      execute(text);
    },
    [push, execute],
  );

  const complete = (): boolean => {
    if (!value) return false;
    const lower = value.toLowerCase();
    const parts = value.split(/\s+/);
    let options: string[] = [];
    let prefix = "";

    if (parts.length === 1) {
      options = COMMAND_NAMES.filter((c) => c.startsWith(lower));
    } else if (parts.length === 2) {
      const head = parts[0].toLowerCase();
      const part = parts[1].toLowerCase();
      prefix = `${parts[0]} `;
      if (head === "open") {
        options = repos.map((r) => r.name).filter((n) => n.toLowerCase().startsWith(part));
      } else if (head === "goto" || head === "cd") {
        options = [...SECTIONS, "top"].filter((s) => s.startsWith(part));
      }
    }
    if (options.length === 0) return false;

    if (options.length === 1) {
      setValue(`${prefix}${options[0]} `);
    } else {
      setValue(prefix + commonPrefix(options));
      push(<Prompt>{value}</Prompt>, <Out>{options.join("   ")}</Out>);
    }
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = history.current;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (list.length === 0) return;
      if (cursor.current === -1) {
        draft.current = value;
        cursor.current = list.length;
      }
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(list[cursor.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor.current === -1) return;
      cursor.current += 1;
      if (cursor.current >= list.length) {
        cursor.current = -1;
        setValue(draft.current);
      } else {
        setValue(list[cursor.current]);
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Only hijack Tab when there is something to complete: it must never trap keyboard users.
      if (complete()) e.preventDefault();
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c" && !window.getSelection()?.toString()) {
      e.preventDefault();
      push(
        <Prompt>
          {value}
          <span className="text-violet-400">^C</span>
        </Prompt>,
      );
      setValue("");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value;
    setValue("");
    runCommand(text);
  };

  const focusInput = () => {
    if (!ready || window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const skipIntro = () => {
    if (!ready) skipRef.current = true;
  };

  return (
    <div
      onPointerDown={skipIntro}
      onKeyDown={skipIntro}
      translate="no"
      className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/80 shadow-[0_0_80px_-20px_rgba(139,92,246,.45)] backdrop-blur transition-[border-color,box-shadow] duration-300 focus-within:border-violet-400/50 focus-within:shadow-[0_0_0_1px_rgba(167,139,250,.3),0_0_90px_-18px_rgba(139,92,246,.6)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">celentroft@portfolio: ~</span>
        <span aria-hidden="true" className="ml-auto font-mono text-[10px] text-zinc-600">
          {ready ? "type help" : "click to skip"}
        </span>
      </div>

      <p id="terminal-hint" className="sr-only">
        Interactive terminal. Type help to list the available commands.
      </p>

      <div
        ref={scroller}
        onClick={focusInput}
        className="h-[21rem] overflow-y-auto overscroll-contain px-5 py-4 font-mono text-[13px] leading-6"
      >
        <div
          role="log"
          aria-label="Terminal output"
          aria-live={ready ? "polite" : "off"}
          className="space-y-1"
        >
          {entries.map((entry) => (
            <div key={entry.id}>{entry.node}</div>
          ))}
        </div>

        <div className="mt-1">
          {ready ? (
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <span aria-hidden="true" className="select-none text-violet-500">
                $
              </span>
              <input
                ref={inputRef}
                name="command"
                aria-label="Terminal command"
                aria-describedby="terminal-hint"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                placeholder="type help…"
                className="min-w-0 flex-1 bg-transparent font-mono caret-violet-400 outline-none placeholder:text-zinc-600 max-sm:text-base"
              />
            </form>
          ) : (
            <Prompt>
              <span className="caret">{typing}</span>
            </Prompt>
          )}
        </div>
      </div>

      <div
        className={`flex flex-wrap gap-2 border-t border-border px-4 py-3 ${ready ? "" : "invisible"}`}
      >
        {QUICK_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              runCommand(command);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-zinc-400 transition-colors hover:border-violet-400/40 hover:text-white"
          >
            {command}
          </button>
        ))}
        <button
          type="button"
          onClick={() => runCommand("sudo hire me")}
          className="rounded-md border border-violet-500/40 bg-violet-500/15 px-2.5 py-1 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-500/25 hover:text-white"
        >
          sudo hire me
        </button>
      </div>
    </div>
  );
}
