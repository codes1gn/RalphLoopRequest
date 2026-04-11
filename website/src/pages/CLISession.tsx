import { motion } from "framer-motion";
import { ScrollReveal } from "../components/ScrollReveal";
import { CodeEditor } from "../components/CodeEditor";

const tmuxCapture = `  === [durable-request] Checkpoint ===

  Auth module refactored (3 files updated). What next?

    1. Run the test suite
    2. Iterate on implementation
    3. Review the diff in detail
    4. Commit changes
    5. Done for now
    6. I'll type my own instruction

  ======================================

  > Choice (number or text): 1
  * Sent: Run the test suite`;

const architectureDiagram = `┌──────────────────────────────────────────────────────┐
│                    tmux session                       │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │         Cursor Agent CLI (top pane)            │  │
│  │                                                │  │
│  │  Agent: [Shell] bash checkpoint.sh ...         │  │
│  │         [durable-request] Waiting...           │  │
│  │         ████████░░ polling .ckpt-answer        │  │
│  │                                                │  │
│  ├────────────────────────────────────────────────┤  │
│  │    checkpoint-ui.sh (bottom split pane)        │  │
│  │                                                │  │
│  │    === [durable-request] Checkpoint ===        │  │
│  │    What would you like to do next?             │  │
│  │      1. Run tests  2. Review  3. Done          │  │
│  │    > Choice: _                                 │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  File IPC:                                           │
│    checkpoint.sh  ──write──>  .ckpt-question         │
│    checkpoint.sh  <──poll───  .ckpt-answer           │
│    checkpoint-ui.sh ─read──>  .ckpt-question         │
│    checkpoint-ui.sh ─write─>  .ckpt-answer           │
└──────────────────────────────────────────────────────┘`;

const steps = [
  {
    num: "01",
    title: "Agent launches checkpoint",
    desc: "The agent calls checkpoint.sh via Shell tool, passing a prompt and options. Shell blocks, keeping the agent's turn alive.",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
    code: `[Shell] bash ~/.cursor/skills/durable-request/checkpoint.sh \\
       "Auth module refactored" \\
       "Run tests" "Review diff" "Commit" "Done"`,
  },
  {
    num: "02",
    title: "Tmux split pane opens",
    desc: "checkpoint.sh detects the tmux session, serializes the question to .ckpt-question, and opens a split pane running checkpoint-ui.sh.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    code: `tmux split-window -t cursor:0 -v -l 14 \\
  "bash checkpoint-ui.sh /path/to/skill-dir"`,
  },
  {
    num: "03",
    title: "User makes a choice",
    desc: "checkpoint-ui.sh reads the question file, renders the interactive prompt with numbered options, and waits for user input via real TTY.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    code: tmuxCapture,
  },
  {
    num: "04",
    title: "Answer flows back to agent",
    desc: "checkpoint-ui.sh writes the answer to .ckpt-answer and removes the lock file. checkpoint.sh's polling loop detects this and returns the answer as Shell output.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    code: `[durable-request] User responded: Run the test suite

# Agent continues immediately with full context intact`,
  },
];

export function CLISession() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-400/8 dark:bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-400/8 dark:bg-emerald-500/5 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-[var(--card)] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[var(--muted-foreground)]">
              Cursor CLI + tmux
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            The CLI Plugin Design
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Interactive checkpoints in your terminal. No separate windows, no lost context.
            The agent blocks while you decide — right in a tmux split pane.
          </p>
        </motion.div>

        {/* Quick Start — usage first */}
        <ScrollReveal>
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-2 text-center">
              Usage
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] text-center mb-4 max-w-xl mx-auto">
              After installing durable-request, just run <code className="px-1.5 py-0.5 rounded bg-[var(--muted)] text-xs font-mono">cursor-agent</code> as usual.
              The tmux alias wraps it automatically — you get the same Cursor CLI TUI, with interactive checkpoints built in.
            </p>
            <div className="max-w-2xl mx-auto">
              <CodeEditor filename="terminal">
                <pre className="text-[var(--foreground)] text-xs sm:text-sm leading-relaxed">
                  <code>{`# One-time setup (add to ~/.bashrc)
alias cursor-agent='tmux new-session -A -s cursor -- cursor-agent'

# Then just run it normally — tmux wraps transparently
$ cursor-agent

# The Cursor CLI TUI launches as usual inside tmux.
# When the agent reaches a checkpoint, a split pane opens below
# with your options. Pick one, the pane closes, agent continues.
# Same request. Full context. No re-prompting.`}</code>
                </pre>
              </CodeEditor>
            </div>
          </div>
        </ScrollReveal>

        {/* Architecture */}
        <ScrollReveal delay={0.1}>
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-4 text-center">
              Architecture
            </h2>
            <CodeEditor filename="tmux-checkpoint-architecture">
              <pre className="text-[var(--foreground)] text-xs sm:text-sm leading-relaxed">
                <code>{architectureDiagram}</code>
              </pre>
            </CodeEditor>
          </div>
        </ScrollReveal>

        {/* Step-by-step */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-8 text-center">
            How It Works — Step by Step
          </h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={0.1 * i}>
                <div className="rounded-xl border bg-[var(--card)] overflow-hidden">
                  <div className="flex items-start gap-4 p-6 pb-0">
                    <span className={`text-3xl font-extrabold ${step.color} font-mono`}>
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <div className={`m-4 rounded-lg ${step.bg} p-4`}>
                    <pre className="text-xs sm:text-sm font-mono text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Live Capture */}
        <ScrollReveal delay={0.2}>
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-2 text-center">
              Real Checkpoint UI
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] text-center mb-4">
              Captured from an actual tmux split pane on this machine
            </p>
            <div className="max-w-lg mx-auto">
              <div className="rounded-xl border-2 border-cyan-500/30 bg-[#0d1117] overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-500/20 bg-[#161b22]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-[10px] text-cyan-400/70 ml-2 font-mono">
                    tmux split-pane — checkpoint-ui.sh
                  </span>
                </div>
                <pre className="p-4 text-sm font-mono text-green-400 leading-relaxed">
                  <code>{tmuxCapture}</code>
                </pre>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Properties */}
        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Blocking", value: "Yes", desc: "Shell tool blocks while user decides", color: "text-emerald-400" },
              { label: "Context", value: "100%", desc: "Same request, no re-prompting", color: "text-accent-400" },
              { label: "Latency", value: "<1s", desc: "File IPC, no network", color: "text-cyan-400" },
            ].map((prop) => (
              <div key={prop.label} className="rounded-xl border bg-[var(--card)] p-5 text-center">
                <div className={`text-3xl font-extrabold ${prop.color} mb-1`}>{prop.value}</div>
                <div className="text-sm font-semibold mb-0.5">{prop.label}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{prop.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
