import { profile } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p>
          Press <kbd className="font-mono text-violet-400">Ctrl K</kbd> to
          navigate · Built with Next.js &amp; Tailwind
        </p>
      </div>
    </footer>
  );
}
