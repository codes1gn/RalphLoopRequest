import { motion } from "framer-motion";
import { ScrollReveal } from "../components/ScrollReveal";

interface ChangeEntry {
  type: "added" | "changed" | "fixed" | "note";
  text: string;
}

interface Release {
  version: string;
  date: string;
  highlight?: string;
  entries: ChangeEntry[];
}

const releases: Release[] = [
  {
    version: "1.1.0",
    date: "2026-04-12",
    highlight: "Cursor CLI Checkpoint — True Durable Loop in Terminal",
    entries: [
      { type: "added", text: "Cursor CLI checkpoint tool (checkpoint.sh + checkpoint-ui.sh) — true blocking interactive checkpoints via tmux split panes" },
      { type: "added", text: "Three-layer checkpoint architecture: AskQuestion (editor) → checkpoint.sh (CLI) → conversational fallback" },
      { type: "added", text: "Tmux alias for seamless cursor-agent launch inside tmux sessions" },
      { type: "added", text: "CLI Session demo page (/cli-session) — step-by-step walkthrough with real tmux capture and architecture diagram" },
      { type: "added", text: "In-app Changelog page — no more jumping to GitLab, full changelog on the website" },
      { type: "added", text: "React Router (HashRouter) for multi-page navigation" },
      { type: "changed", text: "Slogan: 'Your Agent Requests Should Give You More Value' (Requests + Value highlighted)" },
      { type: "changed", text: "SKILL.md: priority-ordered environment detection, CLI-specific handlers, tmux diagrams" },
      { type: "changed", text: "README.md: 3-layer architecture, platform behavior table with Blocking column" },
      { type: "changed", text: "install.md: Step 3 for CLI checkpoint + tmux/locale setup" },
      { type: "changed", text: "Navbar: Changelog and CLI Demo use in-app routes instead of external links" },
      { type: "fixed", text: "set -e in checkpoint.sh caused silent exit when tmux unavailable" },
      { type: "fixed", text: "Terminal rendering (VT100 ACS fallback) when LANG/locale not set to UTF-8" },
      { type: "note", text: "Cursor CLI Shell tool runs in sandbox — no /dev/tty access, but CAN access tmux via tmux split-window" },
      { type: "note", text: "File-based IPC: checkpoint.sh writes question, checkpoint-ui.sh writes answer, polling loop bridges them" },
      { type: "note", text: "Install + 20-checkpoint continuation test: all 60 batch simulations passed (20×continue, 20×iterate, 20×done)" },
    ],
  },
  {
    version: "1.0.1",
    date: "2026-04-11",
    entries: [
      { type: "added", text: "Epoch 3 A/B experiments (30 control + 30 treatment subagents)" },
      { type: "added", text: "Product website with animated feature demos" },
      { type: "added", text: "LAN serving script (serve.sh) + systemd service file" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-04-10",
    highlight: "Initial Release",
    entries: [
      { type: "added", text: "durable-request skill — universal end-of-task continuation gate" },
      { type: "added", text: "AskQuestion integration for Cursor editor" },
      { type: "added", text: "AskUserQuestion integration for Claude Code" },
      { type: "added", text: "question tool integration for OpenCode" },
      { type: "added", text: "Conversational fallback for all platforms" },
      { type: "added", text: "TodoWrite + AskQuestion reinforcement pattern (double-lock)" },
      { type: "added", text: "A/B experiment harness with 170 total subagent experiments across 3 epochs" },
    ],
  },
];

const typeBadge: Record<ChangeEntry["type"], { label: string; className: string }> = {
  added:   { label: "Added",   className: "bg-emerald-500/15 text-emerald-400" },
  changed: { label: "Changed", className: "bg-amber-500/15 text-amber-400" },
  fixed:   { label: "Fixed",   className: "bg-rose-500/15 text-rose-400" },
  note:    { label: "Note",    className: "bg-sky-500/15 text-sky-400" },
};

export function Changelog() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-accent-400/8 dark:bg-accent-500/5 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            All notable changes to durable-request, documented with care.
          </p>
        </motion.div>

        <div className="space-y-12">
          {releases.map((release, ri) => (
            <ScrollReveal key={release.version} delay={0.1 * ri}>
              <article className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-extrabold tracking-tight">
                    v{release.version}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)] px-3 py-1 rounded-full bg-[var(--muted)]">
                    {release.date}
                  </span>
                  {ri === 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 uppercase tracking-wider">
                      Latest
                    </span>
                  )}
                </div>

                {release.highlight && (
                  <p className="text-base font-semibold text-[var(--foreground)] mb-4 pl-1">
                    {release.highlight}
                  </p>
                )}

                <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
                  {release.entries.map((entry, ei) => {
                    const badge = typeBadge[entry.type];
                    return (
                      <div
                        key={ei}
                        className={`flex items-start gap-3 px-5 py-3 ${
                          ei !== release.entries.length - 1 ? "border-b border-[var(--border)]" : ""
                        }`}
                      >
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 uppercase tracking-wider ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                          {entry.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
