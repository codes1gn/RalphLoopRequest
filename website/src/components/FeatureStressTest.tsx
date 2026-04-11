import { FeatureCard } from "./FeatureCard";
import { ScrollReveal } from "./ScrollReveal";

const bars = [
  { label: "Checkpoint Completion", v1: 100, v2: 100 },
  { label: "Format Correctness", v1: 99.7, v2: 100 },
  { label: "Verbose Presence", v1: null, v2: 100 },
];

export function FeatureStressTest() {
  return (
    <FeatureCard
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      }
      title="Proven at Scale"
      subtitle="Stress-Tested to 300+ Steps"
      description="142 A/B subagent experiments. 672 total treatment steps. Two 300-step consecutive stress tests. Zero degradation over time. Every metric tracked: completion, format correctness, and verbose output presence."
    >
      <div className="space-y-6">
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
            <div className="px-4 py-3 border-b bg-[var(--muted)] text-xs font-medium text-[var(--muted-foreground)]">
              3-Metric Stress Test Results (300 steps each)
            </div>
            <div className="p-5 space-y-4">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted-foreground)]">{bar.label}</span>
                    <span className="font-mono font-semibold text-emerald-500">
                      {bar.v2}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {bar.v1 !== null ? (
                      <div className="flex-1">
                        <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">v1</div>
                        <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-500/60 rounded-full transition-all duration-1000"
                            style={{ width: `${bar.v1}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">v1</div>
                        <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--border)] rounded-full italic text-[8px] leading-3 text-center text-[var(--muted-foreground)]">
                            n/a
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">v2</div>
                      <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${bar.v2}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-[var(--card)] p-4 text-center">
              <div className="text-2xl font-bold text-accent-500">142</div>
              <div className="text-[10px] text-[var(--muted-foreground)] mt-1">A/B experiments</div>
            </div>
            <div className="rounded-xl border bg-[var(--card)] p-4 text-center">
              <div className="text-2xl font-bold text-accent-500">672</div>
              <div className="text-[10px] text-[var(--muted-foreground)] mt-1">Treatment steps</div>
            </div>
            <div className="rounded-xl border bg-[var(--card)] p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500">100%</div>
              <div className="text-[10px] text-[var(--muted-foreground)] mt-1">Checkpoint rate</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </FeatureCard>
  );
}
