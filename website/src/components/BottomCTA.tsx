import { ScrollReveal } from "./ScrollReveal";

export function BottomCTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent-400/15 dark:bg-accent-500/10 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Stop losing context.{" "}
            <span className="text-gradient">Start looping.</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
            One file. Zero dependencies. Infinite interactive loops. Your agent will never end silently again.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#install"
              className="px-8 py-3.5 text-sm font-semibold bg-accent-500 text-white rounded-xl
                         hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/25
                         hover:shadow-accent-500/40"
            >
              Get Started
            </a>
            <a
              href="https://github.com/anthropics/durable-request"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 text-sm font-semibold border rounded-xl
                         hover:bg-[var(--muted)] transition-all flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
