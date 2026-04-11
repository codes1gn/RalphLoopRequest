import { ScrollReveal } from "./ScrollReveal";
import { CodeEditor } from "./CodeEditor";

const installCmd = `# One command. That's it.
curl -fsSL https://raw.githubusercontent.com/anthropics/durable-request/main/install.sh | sh

# Or manually:
cp skill/SKILL.md .cursor/skills/durable-request/SKILL.md`;

const stats = [
  {
    number: "1",
    unit: "file",
    label: "to install",
    detail: "SKILL.md — no runtime, no deps",
  },
  {
    number: "∞",
    unit: "loops",
    label: "per request",
    detail: "Work → checkpoint → respond → repeat",
  },
  {
    number: "0",
    unit: "silent endings",
    label: "guaranteed",
    detail: "100% checkpoint rate across 672 steps",
  },
  {
    number: "5×",
    unit: "more",
    label: "work per request",
    detail: "Avg 5 task cycles before user says 'done'",
  },
];

export function ROISection() {
  return (
    <section id="roi" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-10" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-500/5 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              ROI
            </div>
            <h2 id="install" className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Try <span className="text-gradient">Durable Request</span> Today
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              One file turns every agent interaction from a one-shot into a sustained work session.
              More work per request = fewer context switches = less wasted tokens.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-[var(--card)] p-5 hover:border-accent-500/30 transition-colors"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-gradient">{s.number}</span>
                    <span className="text-sm text-[var(--muted-foreground)] font-medium">{s.unit}</span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{s.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">{s.detail}</div>
                </div>
              ))}
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-6 rounded-xl border bg-[var(--card)] p-5">
                <h3 className="font-semibold text-sm mb-3">The Math</h3>
                <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-3">
                    <span className="text-accent-500 font-mono text-xs">Without</span>
                    <span>1 request = 1 task = context lost</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-mono text-xs">With&nbsp;&nbsp;&nbsp;</span>
                    <span>1 request = 5+ tasks = context preserved</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-medium text-[var(--foreground)]">
                    Same request budget, 5× the output. Zero token waste on re-establishing context.
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <CodeEditor filename="terminal">
              <pre className="text-[var(--foreground)] text-xs sm:text-sm">
                <code>{installCmd}</code>
              </pre>
            </CodeEditor>
            <p className="text-xs text-center text-[var(--muted-foreground)] mt-3">
              Works with Cursor, Claude Code, and OpenCode
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
