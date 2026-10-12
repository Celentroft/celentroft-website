import { profile } from "@/lib/config";
import ShortcutKey from "./ShortcutKey";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} <span translate="no">{profile.name}</span>. All rights
          reserved.
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-1.5">
          <span>Press</span>
          <ShortcutKey className="font-mono text-violet-400" />
          <span>to navigate ·</span>
          <a href="#top" className="transition-colors hover:text-white">
            Back to Top
          </a>
        </p>
      </div>
    </footer>
  );
}
