import { FeatureCard } from "./FeatureCard";
import { ScrollReveal } from "./ScrollReveal";
import { CodeEditor } from "./CodeEditor";

const withoutSkill = `User:  Refactor the auth module

Agent: Done! I've refactored the auth module.
       Updated 3 files, extracted 2 helpers.

       ┊  (session ends silently)
       ┊  User must start a new request
       ┊  Context is lost`;

const withSkill = `User:  Refactor the auth module

Agent: [durable-request] Refactoring complete.
       Called AskQuestion — checkpoint presented.

       ┌───────────────────────────────────────┐
       │  ✅ Auth module refactored.            │
       │  What would you like to do next?       │
       │                                        │
       │  ○ Run the test suite                  │
       │  ○ Refactor another module             │
       │  ○ Review the diff                     │
       │  ○ I'm satisfied, we're done           │
       │  ○ I'll type my own instruction        │
       └───────────────────────────────────────┘

       ↻ Same request. Full context preserved.`;

export function FeatureSkillDemo() {
  return (
    <FeatureCard
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      }
      title="One File. Infinite Loops."
      subtitle="Skill-Powered Checkpoints"
      description="Drop a single SKILL.md into your project. The agent reads it, internalizes the rules, and never ends silently again. Every task completion becomes an interactive checkpoint."
    >
      <div className="space-y-4">
        <ScrollReveal delay={0.2}>
          <div className="relative">
            <div className="absolute -top-2 left-3 px-2 py-0.5 bg-red-500/90 text-white text-xs font-semibold rounded z-10">
              Without durable-request
            </div>
            <CodeEditor filename="before.session">
              <pre className="text-[var(--foreground)] text-xs opacity-60">
                <code>{withoutSkill}</code>
              </pre>
            </CodeEditor>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="relative">
            <div className="absolute -top-2 left-3 px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded z-10">
              With durable-request
            </div>
            <CodeEditor filename="after.session">
              <pre className="text-[var(--foreground)] text-xs">
                <code>{withSkill}</code>
              </pre>
            </CodeEditor>
          </div>
        </ScrollReveal>
      </div>
    </FeatureCard>
  );
}
