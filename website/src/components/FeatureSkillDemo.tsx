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
       │  Auth module refactored.               │
       │  What would you like to do next?       │
       │                                        │
       │  ○ Run the test suite                  │
       │  ○ Refactor another module             │
       │  ○ Review the diff                     │
       │  ○ I'm satisfied, we're done           │
       │  ○ I'll type my own instruction        │
       └───────────────────────────────────────┘

       Same request. Full context preserved.`;

const withCLI = `$ cursor-agent  (inside tmux)

Agent: [Shell] bash checkpoint.sh "Auth refactored"
       [durable-request] Opening checkpoint in tmux...

  ┌── Cursor Agent CLI ────────────────────┐
  │  > Refactored auth module, 3 files...  │
  │  > [Shell: waiting for checkpoint...]  │
  ├── [durable-request] Checkpoint ────────┤
  │                                        │
  │   Auth module refactored. What next?   │
  │                                        │
  │    1. Run the test suite               │
  │    2. Review the diff                  │
  │    3. Done                             │
  │    4. I'll type my own instruction     │
  │                                        │
  │   > Choice: 1                          │
  └────────────────────────────────────────┘

Agent: [durable-request] User responded: Run tests
       Running pytest... All 42 tests passed.`;

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
      description="Drop a single SKILL.md into your project. The agent reads it, internalizes the rules, and never ends silently again. Every task completion becomes an interactive checkpoint — in the editor, CLI, or anywhere."
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
              With durable-request (Editor)
            </div>
            <CodeEditor filename="cursor-editor.session">
              <pre className="text-[var(--foreground)] text-xs">
                <code>{withSkill}</code>
              </pre>
            </CodeEditor>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="relative">
            <div className="absolute -top-2 left-3 px-2 py-0.5 bg-cyan-500 text-white text-xs font-semibold rounded z-10">
              With durable-request (CLI + tmux)
            </div>
            <CodeEditor filename="cursor-cli.session">
              <pre className="text-[var(--foreground)] text-xs">
                <code>{withCLI}</code>
              </pre>
            </CodeEditor>
          </div>
        </ScrollReveal>
      </div>
    </FeatureCard>
  );
}
