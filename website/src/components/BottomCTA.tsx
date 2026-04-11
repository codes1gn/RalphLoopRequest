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
              href="http://git.enflame.cn/skills/durablerequest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 text-sm font-semibold border rounded-xl
                         hover:bg-[var(--muted)] transition-all flex items-center justify-center gap-2"
            >
              <svg width="28" height="28" viewBox="0 0 380 380" fill="currentColor">
                <path d="M282.83 170.73l-.27-.69-26.14-68.22a6.81 6.81 0 0 0-2.69-3.24 7 7 0 0 0-8 .43 7 7 0 0 0-2.32 3.52l-17.65 54h-71.47l-17.65-54a6.86 6.86 0 0 0-2.32-3.53 7 7 0 0 0-8-.43 6.87 6.87 0 0 0-2.69 3.24L97.44 170l-.26.69a48.54 48.54 0 0 0 16.1 56.1l.09.07.24.17 39.82 29.82 19.7 14.91 12 9.06a8.07 8.07 0 0 0 9.76 0l12-9.06 19.7-14.91 40.06-30 .1-.08a48.56 48.56 0 0 0 16.08-56.04z" />
              </svg>
              Star on GitLab
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
