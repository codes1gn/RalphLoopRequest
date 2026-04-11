import { FeatureCard } from "./FeatureCard";
import { ScrollReveal } from "./ScrollReveal";

export function FeatureTodoGuardrail() {
  return (
    <FeatureCard
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      }
      title="Double-Lock Guardrail"
      subtitle="TodoWrite + AskQuestion"
      description="TodoWrite anchors the checkpoint as an in-progress obligation. AskQuestion blocks the turn. Together they form a double-lock — even if AskQuestion fails, the agent cannot end silently because the todo forces it to address the failure."
      reversed
    >
      <div className="space-y-4">
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
            <div className="px-4 py-3 border-b bg-[var(--muted)] text-xs font-medium text-[var(--muted-foreground)]">
              Reinforcement Pattern
            </div>
            <div className="p-5 font-mono text-xs leading-relaxed">
              <pre className="text-[var(--foreground)]">
                <code>{`┌─────────── SAME TOOL CALL BATCH ───────────┐
│                                              │
│  TodoWrite([{                                │
│    id: "durable-checkpoint",                 │
│    content: "Present checkpoint",            │
│    status: "in_progress"     ← structural    │
│  }])                           anchor        │
│                                              │
│  AskQuestion({                               │
│    title: "Task Checkpoint",                 │
│    questions: [...]          ← blocks turn   │
│  })                                          │
│                                              │
└──────────────────────────────────────────────┘

If AskQuestion succeeds → user responds → continue
If AskQuestion fails   → todo stays in_progress
                       → agent MUST address it
                       → verbose fallback message`}</code>
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-[var(--card)] p-4 text-center">
              <div className="text-3xl font-bold text-accent-500">2</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">Independent locks</div>
            </div>
            <div className="rounded-xl border bg-[var(--card)] p-4 text-center">
              <div className="text-3xl font-bold text-accent-500">0</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">Silent failure modes</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </FeatureCard>
  );
}
