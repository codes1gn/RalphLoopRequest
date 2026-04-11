import { motion } from "framer-motion";
import { CodeEditor } from "./CodeEditor";

const demoConversation = `User:  Add dark mode to my settings page

Agent: [works for 2 minutes... adds ThemeProvider, toggle component, CSS variables]

       ┌─────────────────────────────────────────┐
       │  ✅ Dark mode added to settings page.    │
       │  What would you like to do next?         │
       │                                          │
       │  ○ Iterate / refine what was just done   │
       │  ○ Continue to the next step             │
       │  ○ Run tests                             │
       │  ○ Switch to a different task             │
       │  ○ I'm satisfied, we're done             │
       │  ○ I'll type my own instruction          │
       └─────────────────────────────────────────┘

User:  > Run tests

Agent: [runs test suite... 3 passed, 1 failed: contrast ratio]
       [fixes the failing test]

       ┌─────────────────────────────────────────┐
       │  ✅ Tests passing (4/4).                  │
       │  What would you like to do next?         │
       │  ...                                     │
       └─────────────────────────────────────────┘`;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-accent-400/10 dark:bg-accent-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-32 sm:pb-40">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-[var(--card)] text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--muted-foreground)]">
              Prompt-only — zero dependencies
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]"
          >
            Never End{" "}
            <span className="text-gradient">Silently</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl leading-relaxed"
          >
            A single skill file that turns any AI coding agent into an interactive loop.
            Your agent works, checkpoints, and waits — in the same request, forever.
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
              Try Durable Request Today
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 text-sm font-semibold border rounded-xl
                         hover:bg-[var(--muted)] transition-all"
            >
              See How It Works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 w-full max-w-3xl"
          >
            <CodeEditor filename="cursor-agent-session">
              <pre className="text-[var(--foreground)] text-xs sm:text-sm">
                <code>{demoConversation}</code>
              </pre>
            </CodeEditor>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
