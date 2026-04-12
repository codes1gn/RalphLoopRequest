import { FeatureCard } from "./FeatureCard";
import { ScrollReveal } from "./ScrollReveal";
import { CodeEditor } from "./CodeEditor";
import cursorIdeCase from "../assets/cursor ide case 1.png";
import cursorCliCase from "../assets/cursor cli case 1.png";

const withoutSkill = `User:  Refactor the auth module

Agent: Done! I've refactored the auth module.
       Updated 3 files, extracted 2 helpers.

       ┊  (session ends silently)
       ┊  User must start a new request
       ┊  Context is lost`;

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
            <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-[var(--muted)]">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">cursor-editor — real checkpoint</span>
              </div>
              <img src={cursorIdeCase} alt="Cursor IDE AskQuestion checkpoint with interactive options" className="w-full" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="relative">
            <div className="absolute -top-2 left-3 px-2 py-0.5 bg-cyan-500 text-white text-xs font-semibold rounded z-10">
              With durable-request (CLI + tmux)
            </div>
            <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-[var(--muted)]">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">cursor-cli — real tmux checkpoint</span>
              </div>
              <img src={cursorCliCase} alt="Cursor CLI tmux split pane checkpoint with numbered options" className="w-full" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </FeatureCard>
  );
}
