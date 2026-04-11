import { FeatureCard } from "./FeatureCard";
import { ScrollReveal } from "./ScrollReveal";

const platforms = [
  {
    name: "Cursor",
    tool: "AskQuestion",
    status: "active",
    statusLabel: "Active",
    desc: "Blocks turn, presents UI widget, same request continues",
  },
  {
    name: "Claude Code",
    tool: "AskUserQuestion",
    status: "active",
    statusLabel: "Active",
    desc: "Terminal-native interactive prompt with structured options",
  },
  {
    name: "OpenCode",
    tool: "question",
    status: "active",
    statusLabel: "Active",
    desc: "Question tool integration with conversation continuation",
  },
  {
    name: "Cursor CLI",
    tool: "checkpoint.sh",
    status: "active",
    statusLabel: "Active",
    desc: "Tmux split-pane interactive checkpoint — true blocking durable loop via Shell",
  },
];

export function FeatureMultiAgent() {
  return (
    <FeatureCard
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      }
      title="Works Everywhere"
      subtitle="Multi-Agent Compatibility"
      description="Auto-detects your environment and uses the right tool. One SKILL.md, all platforms — including Cursor CLI with true blocking checkpoints via tmux split panes."
      reversed
    >
      <div className="space-y-3">
        {platforms.map((p, i) => (
          <ScrollReveal key={p.name} delay={0.1 + i * 0.08}>
            <div className="rounded-xl border bg-[var(--card)] p-4 flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                {p.status === "active" ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      p.status === "active"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {p.statusLabel}
                  </span>
                  {p.tool !== "—" && (
                    <code className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
                      {p.tool}
                    </code>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{p.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </FeatureCard>
  );
}
