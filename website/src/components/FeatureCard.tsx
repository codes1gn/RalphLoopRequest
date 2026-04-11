import { type ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";

export function FeatureCard({
  icon,
  title,
  subtitle,
  description,
  children,
  reversed = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  children?: ReactNode;
  reversed?: boolean;
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${
            reversed ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-12 lg:gap-20 items-center`}
        >
          <div className="flex-1 max-w-xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 text-accent-500 dark:text-accent-400 text-sm font-medium mb-6">
                {icon}
                {subtitle}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {title}
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                {description}
              </p>
            </ScrollReveal>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <ScrollReveal delay={0.15}>{children}</ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
