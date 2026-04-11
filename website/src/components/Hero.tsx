import { motion } from "framer-motion";
import { CodeEditor } from "./CodeEditor";

const demoConversation = `User:  Add dark mode to my settings page

Agent: [works for 2 minutes... adds ThemeProvider, toggle, CSS vars]

       ┌─────────────────────────────────────────┐
       │  ✅ Dark mode added to settings page.    │
       │  What would you like to do next?         │
       │                                          │
       │  ○ Run the test suite                    │
       │  ○ Iterate on the toggle UX              │
       │  ○ Review the diff                       │
       │  ○ I'm satisfied, we're done             │
       │  ○ I'll type my own instruction          │
       └─────────────────────────────────────────┘

User:  > Run tests

Agent: [runs tests... 3 passed, 1 failed: contrast ratio]
       [fixes the failing test automatically]

       ┌─────────────────────────────────────────┐
       │  ✅ All 4 tests passing.                  │
       │  What would you like to do next?         │
       │  ...                                     │
       └─────────────────────────────────────────┘

       ↻ Same request. Full context. No re-prompting.`;

function ValuePillar({
  icon,
  badge,
  title,
  points,
  variant,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  points: { strong: string; rest: string }[];
  variant: "blue" | "green";
}) {
  const styles = {
    blue: {
      border: "hover:border-accent-500/30",
      glow: "bg-accent-500/5 group-hover:bg-accent-500/10",
      badge: "bg-accent-500/10 text-accent-400",
      dot: "bg-accent-500",
    },
    green: {
      border: "hover:border-emerald-500/30",
      glow: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
      badge: "bg-emerald-500/10 text-emerald-400",
      dot: "bg-emerald-500",
    },
  }[variant];

  return (
    <div
      className={`relative rounded-2xl border bg-[var(--card)] p-8 overflow-hidden group ${styles.border} transition-all duration-300`}
    >
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full ${styles.glow} blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-500`}
      />

      <div className="relative">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${styles.badge} text-xs font-semibold mb-5 uppercase tracking-wide`}
        >
          {icon}
          {badge}
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          {title}
        </h3>

        <div className="space-y-3">
          {points.map((pt, j) => (
            <div key={j} className="flex items-start gap-3">
              <div
                className={`mt-1.5 w-1.5 h-1.5 rounded-full ${styles.dot} shrink-0`}
              />
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                <span className="text-[var(--foreground)] font-medium">
                  {pt.strong}
                </span>
                {pt.rest}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-400/8 dark:bg-accent-500/5 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-400/8 dark:bg-emerald-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-32 sm:pb-28">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-[var(--card)] text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--muted-foreground)]">
              Prompt-only — zero dependencies — one file
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1]"
          >
            Your Agent Should{" "}
            <span className="text-gradient">Never End</span> Silently
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-3xl leading-relaxed"
          >
            A single skill file that transforms AI agents from one-shot tools into
            interactive partners. Work, checkpoint, respond, repeat — all in one request.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#install"
              className="px-8 py-3.5 text-sm font-semibold bg-accent-500 text-white rounded-xl
                         hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/25
                         hover:shadow-accent-500/40"
            >
              Get Started — It's One File
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 text-sm font-semibold border rounded-xl
                         hover:bg-[var(--muted)] transition-all"
            >
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Two Value Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ValuePillar
            variant="blue"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            }
            badge="For Teams & Managers"
            title="Make Your AI Investment Durable"
            points={[
              { strong: "Dev at full pace", rest: " — agents work continuously, not one-shot-and-gone" },
              { strong: "5× more output", rest: " per request with the same token budget" },
              { strong: "Maximize Cursor Team Plan ROI", rest: " — zero idle agent turns, zero wasted context" },
              { strong: "Compound productivity", rest: " — each loop iteration builds on everything before it" },
            ]}
          />
          <ValuePillar
            variant="green"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            }
            badge="For Developers"
            title="Reveal the Agent's Black Box"
            points={[
              { strong: "Fine-grained control", rest: " — steer the agent at every checkpoint, not just the start" },
              { strong: "More discussion", rest: " — align on approach before the agent writes 200 wrong lines" },
              { strong: "More feedback loops", rest: " — knowledge aligns incrementally, not retroactively" },
              { strong: "True peer-coding", rest: " — a real back-and-forth conversation, not a monologue" },
            ]}
          />
        </motion.div>

        {/* Code Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 w-full max-w-4xl mx-auto"
        >
          <CodeEditor filename="cursor-agent-session — the durable loop in action">
            <pre className="text-[var(--foreground)] text-xs sm:text-sm">
              <code>{demoConversation}</code>
            </pre>
          </CodeEditor>
        </motion.div>
      </div>
    </section>
  );
}
