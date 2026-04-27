import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "About — Journal" },
    {
      name: "description",
      content:
        "A journal exploring the craft of software — design, typography, and building with purpose.",
    },
  ];
};

export default function About() {
  return (
    <div className="space-y-24">
      <section>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-tight">
          About This Journal
        </h1>
        <div className="max-w-2xl space-y-6">
          <p className="text-xl text-muted-foreground leading-relaxed">
            This is a living document exploring the intersection of engineering
            precision and aesthetic intentionality in modern web development.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every decision in software — from architecture to typography, from
            performance budgets to color palettes — is an act of judgment. This
            journal documents that process: the principles we follow, the mistakes
            we make, and the patterns we refine.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-12">
          What I Care About
        </h2>
        <div className="max-w-2xl space-y-8">
          <div className="flex gap-4">
            <span className="text-primary font-mono text-sm self-start">01</span>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Intentionality over habit</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every choice — a font, a spacing value, a component pattern —
                should be deliberate. I write code the way I'd build something
                I need to live with.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-primary font-mono text-sm self-start">02</span>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Systems, not shortcuts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Good engineering creates leverage. Design tokens, type safety,
                and consistent patterns compound over time. The upfront cost
                pays dividends.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-primary font-mono text-sm self-start">03</span>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Readability first</h3>
              <p className="text-muted-foreground leading-relaxed">
                Code is read far more often than it's written. I optimize for
                the person reading it tomorrow — including myself.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-primary font-mono text-sm self-start">04</span>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                The difference between good and great is in the details. Typographic
                scale, color harmony, the rhythm of whitespace — these aren't
                decorations, they're the work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-12 border-t border-border">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-8">
          Built With
        </h2>
        <div className="flex flex-wrap gap-3">
          {["React Router", "TypeScript", "Tailwind", "Geist", "OKLCH", "MDX"].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm font-medium bg-secondary/50 text-secondary-foreground rounded-lg"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
