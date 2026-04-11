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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.66 2.66a1.838 1.838 0 1 1-1.103 1.028l-2.48-2.48v6.53a1.838 1.838 0 1 1-1.512-.094V8.73a1.838 1.838 0 0 1-.998-2.41L7.629 3.586.452 10.762a1.55 1.55 0 0 0 0 2.188l10.48 10.48a1.55 1.55 0 0 0 2.186 0l10.428-10.43a1.55 1.55 0 0 0 0-2.07z" />
              </svg>
              Star on GitLab
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
