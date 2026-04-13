import { motion } from "framer-motion";
import { ScrollReveal } from "../components/ScrollReveal";

type Status = "shipped" | "in_progress" | "planned" | "exploring";

interface RoadmapItem {
  title: string;
  description: string;
  status: Status;
  version?: string;
  startQ: string;
  endQ: string;
  progress: number;
}

interface RoadmapPhase {
  phase: string;
  subtitle: string;
  items: RoadmapItem[];
}

const statusConfig: Record<Status, { label: string; className: string; dot: string; bar: string }> = {
  shipped:     { label: "Shipped",      className: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400", bar: "bg-emerald-500" },
  in_progress: { label: "In Progress",  className: "bg-amber-500/15 text-amber-400",    dot: "bg-amber-400",   bar: "bg-amber-500" },
  planned:     { label: "Planned",      className: "bg-sky-500/15 text-sky-400",         dot: "bg-sky-400",     bar: "bg-sky-500/40" },
  exploring:   { label: "Exploring",    className: "bg-violet-500/15 text-violet-400",   dot: "bg-violet-400",  bar: "bg-violet-500/30" },
};

const quarters = ["Q1 '26", "Q2 '26", "Q3 '26", "Q4 '26", "Q1 '27", "Q2 '27"];

function quarterIndex(q: string): number {
  const idx = quarters.indexOf(q);
  return idx === -1 ? 0 : idx;
}

const phases: RoadmapPhase[] = [
  {
    phase: "Foundation",
    subtitle: "The core loop — never let a request end silently",
    items: [
      {
        title: "Universal checkpoint",
        description: "AskQuestion (Cursor IDE), AskUserQuestion (Claude Code), question (OpenCode), and conversational fallback.",
        status: "shipped",
        version: "v1.0.0",
        startQ: "Q1 '26",
        endQ: "Q1 '26",
        progress: 100,
      },
      {
        title: "TodoWrite reinforcement",
        description: "Double-lock pattern — TodoWrite anchors checkpoint as unfinished obligation.",
        status: "shipped",
        version: "v1.0.0",
        startQ: "Q1 '26",
        endQ: "Q1 '26",
        progress: 100,
      },
      {
        title: "CLI checkpoint (tmux)",
        description: "checkpoint.sh + checkpoint-ui.sh — blocking interactive checkpoints in terminal.",
        status: "shipped",
        version: "v1.1.0",
        startQ: "Q1 '26",
        endQ: "Q2 '26",
        progress: 100,
      },
      {
        title: "A/B experiment harness",
        description: "170 subagent experiments, 3 epochs, statistical validation (p < 2.2e-16).",
        status: "shipped",
        version: "v1.0.0",
        startQ: "Q1 '26",
        endQ: "Q2 '26",
        progress: 100,
      },
    ],
  },
  {
    phase: "Continuation Control",
    subtitle: "Stay in the loop without losing flow — steer, pause, and resume within a single request",
    items: [
      {
        title: "Steering in continuation",
        description: "Redirect the agent mid-session without starting a new request. At any checkpoint, inject a new goal or constraint that overrides the current plan — the agent pivots immediately while preserving full context.",
        status: "planned",
        startQ: "Q2 '26",
        endQ: "Q3 '26",
        progress: 0,
      },
      {
        title: "Pause in continuation",
        description: "Freeze a durable session at any checkpoint and resume later — across terminal restarts, machine reboots, or network drops. Session state serialized to disk, picked up exactly where you left off.",
        status: "planned",
        startQ: "Q2 '26",
        endQ: "Q3 '26",
        progress: 0,
      },
      {
        title: "Manual context compaction",
        description: "At any checkpoint, trigger a context compaction that summarizes the session so far into a compact representation. Shed stale context, keep decisions and file changes — extend effective session length without hitting token limits.",
        status: "planned",
        startQ: "Q3 '26",
        endQ: "Q4 '26",
        progress: 0,
      },
    ],
  },
  {
    phase: "Adaptive Behavior",
    subtitle: "The skill that learns from you — smarter defaults from real usage patterns",
    items: [
      {
        title: "Change snapshot & rollback",
        description: "Automatically snapshot workspace state before each checkpoint. One-click rollback if the agent went wrong — no more git reflog archaeology.",
        status: "planned",
        startQ: "Q3 '26",
        endQ: "Q4 '26",
        progress: 0,
      },
      {
        title: "Option auto-learning",
        description: "Every user has different habits — some always run tests, others prefer reviewing diffs first. Track checkpoint selections over time and build a personal preference profile. Frequently chosen actions rise to the top, rarely used ones fade out. The checkpoint learns your workflow instead of forcing a generic one.",
        status: "exploring",
        startQ: "Q3 '26",
        endQ: "Q1 '27",
        progress: 0,
      },
    ],
  },
  {
    phase: "Autopilot Mode",
    subtitle: "From asking to knowing — the agent that understands your intent before you say it",
    items: [
      {
        title: "Personalized autopilot",
        description: "Built on auto-learning data: instead of generic 'keep going' autopilot, the agent uses your accumulated preference profile to make decisions at checkpoints automatically. At each continuation point, the agent asks itself — based on this user's history, what would they choose? — and acts accordingly. Better than market-default autopilot because it's trained on your real interaction patterns, not assumptions.",
        status: "exploring",
        startQ: "Q1 '27",
        endQ: "Q2 '27",
        progress: 0,
      },
      {
        title: "Confidence-gated autonomy",
        description: "Autopilot doesn't mean blind execution. The agent evaluates its confidence at each checkpoint: high confidence (familiar pattern) → auto-proceed; low confidence (novel situation) → pause and ask. Gradually widen the autopilot scope as the preference profile deepens, with the user always in control of the confidence threshold.",
        status: "exploring",
        startQ: "Q1 '27",
        endQ: "Q2 '27",
        progress: 0,
      },
    ],
  },
];

function GanttBar({ item }: { item: RoadmapItem }) {
  const start = quarterIndex(item.startQ);
  const end = quarterIndex(item.endQ);
  const total = quarters.length;
  const leftPct = (start / total) * 100;
  const widthPct = ((end - start + 1) / total) * 100;
  const sc = statusConfig[item.status];

  return (
    <div className="relative h-8 group">
      <div
        className={`absolute top-1 h-6 rounded-full ${sc.bar} transition-all duration-500`}
        style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: "2rem" }}
      >
        {item.progress > 0 && item.progress < 100 && (
          <div
            className="absolute inset-0 rounded-full bg-white/20"
            style={{ width: `${item.progress}%` }}
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white truncate px-2">
          {item.title}
        </span>
      </div>
    </div>
  );
}

export function Roadmap() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-400/8 dark:bg-accent-500/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Roadmap
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl">
            durable-request is evolving from a single skill into a{" "}
            <span className="text-[var(--foreground)] font-semibold">zero-config safety net for AI coding</span>.
            We focus on problems that IDE vendors won't solve — the gaps between "the agent finished" and "the code is actually safe."
          </p>

          <div className="flex flex-wrap gap-5 mt-8">
            {(Object.entries(statusConfig) as [Status, typeof statusConfig[Status]][]).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                <span className="text-[var(--muted-foreground)]">{config.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gantt-style timeline overview */}
        <ScrollReveal delay={0.1}>
          <div className="mb-16 rounded-xl border bg-[var(--card)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold">Timeline Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid border-b border-[var(--border)]" style={{ gridTemplateColumns: `180px repeat(${quarters.length}, 1fr)` }}>
                  <div className="px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Phase / Item
                  </div>
                  {quarters.map((q) => (
                    <div key={q} className="px-2 py-2 text-xs font-semibold text-center text-[var(--muted-foreground)] uppercase tracking-wider border-l border-[var(--border)]">
                      {q}
                    </div>
                  ))}
                </div>

                {phases.map((phase) => (
                  <div key={phase.phase}>
                    <div className="grid border-b border-[var(--border)] bg-[var(--muted)]/30" style={{ gridTemplateColumns: `180px 1fr` }}>
                      <div className="px-4 py-2 text-sm font-bold">
                        {phase.phase}
                      </div>
                      <div />
                    </div>
                    {phase.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="grid border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]/20 transition-colors"
                        style={{ gridTemplateColumns: `180px 1fr` }}
                      >
                        <div className="px-4 py-1.5 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig[item.status].dot}`} />
                          <span className="text-xs text-[var(--muted-foreground)] truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${quarters.length}, 1fr)` }}>
                            {quarters.map((q) => (
                              <div key={q} className="border-l border-[var(--border)]" />
                            ))}
                          </div>
                          <GanttBar item={item} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Detailed phase cards */}
        <div className="space-y-14">
          {phases.map((phase, pi) => (
            <ScrollReveal key={phase.phase} delay={0.1 * pi}>
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold tracking-tight mb-1">
                    {phase.phase}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {phase.subtitle}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {phase.items.map((item, ii) => {
                    const sc = statusConfig[item.status];
                    return (
                      <motion.div
                        key={ii}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * ii, duration: 0.4 }}
                        className="rounded-xl border bg-[var(--card)] p-5 flex flex-col"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${sc.className}`}>
                            {sc.label}
                          </span>
                          {item.version && (
                            <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--muted)]">
                              {item.version}
                            </span>
                          )}
                          <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
                            {item.startQ} → {item.endQ}
                          </span>
                        </div>

                        <h3 className="font-semibold text-[var(--foreground)] mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
                          {item.description}
                        </p>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] mb-1">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${sc.bar}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
