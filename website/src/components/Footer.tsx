export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔄</span>
          <span>durable-request</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--muted)]">v1.1.0</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="http://git.enflame.cn/skills/durablerequest"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            GitLab
          </a>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
