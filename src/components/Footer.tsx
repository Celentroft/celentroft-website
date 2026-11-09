import { profile } from "@/lib/config";
import { T } from "./Lang";
import ShortcutKey from "./ShortcutKey";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} <span translate="no">{profile.name}</span>.{" "}
          <T k="footer.rights" />
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-1.5">
          <span>
            <T k="footer.press" />
          </span>
          <ShortcutKey className="font-mono text-violet-400" />
          <span>
            <T k="footer.navigate" />
          </span>
          <a href="#top" className="transition-colors hover:text-white">
            <T k="footer.top" />
          </a>
        </p>
      </div>
    </footer>
  );
}
