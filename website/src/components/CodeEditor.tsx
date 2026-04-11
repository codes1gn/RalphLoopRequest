import { type ReactNode } from "react";

export function CodeEditor({
  filename,
  children,
  className = "",
}: {
  filename?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border bg-[var(--card)] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/30 ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-[var(--muted)]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        {filename && (
          <span className="text-xs text-[var(--muted-foreground)] ml-2 font-mono">
            {filename}
          </span>
        )}
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
