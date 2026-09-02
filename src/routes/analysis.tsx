import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "@/components/mindbridge/AppShell";
import { Button } from "@/components/ui/button";
import { Disclaimer, MetricBar } from "@/components/mindbridge/WellnessBits";
import { analyseCheckIn } from "@/lib/mindbridge/ai";
import { useMindBridge } from "@/lib/mindbridge/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "AI Wellness Analysis — MindBridge" },
      {
        name: "description",
        content:
          "A supportive, non-diagnostic reflection on your latest wellness check-in, with recommended next steps.",
      },
      { property: "og:title", content: "AI Wellness Analysis — MindBridge" },
      {
        property: "og:description",
        content: "Understand what may be affecting you and pick one small next step.",
      },
    ],
  }),
  component: AnalysisPage,
});

const LEVEL_STYLE = {
  steady: "bg-success/15 text-success",
  moderate: "bg-warning/20 text-warning-foreground",
  elevated: "bg-destructive/12 text-destructive",
} as const;

function AnalysisPage() {
  const { latestCheckIn } = useMindBridge();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!latestCheckIn) {
    return (
      <AppShell>
        <PageContainer>
          <div className="surface p-10 text-center">
            <h1 className="text-2xl">No check-in yet</h1>
            <p className="mt-2 text-muted-foreground">
              Complete a short check-in and your analysis will appear here.
            </p>
            <Button asChild className="mt-6 rounded-xl">
              <Link to="/checkin">Start a check-in</Link>
            </Button>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  const a = analyseCheckIn(latestCheckIn);

  if (!ready) {
    return (
      <AppShell>
        <PageContainer>
          <div className="surface flex flex-col items-center gap-4 p-16 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-display text-xl">Reading your responses…</p>
            <p className="text-sm text-muted-foreground">
              Simulated AI analysis · nothing leaves your browser
            </p>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Step 2 of 3"
          title="Your wellness reflection"
          subtitle="Supportive interpretation of what you shared — never a diagnosis."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface animate-rise p-6 sm:p-8">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                LEVEL_STYLE[a.pressureLevel],
              )}
            >
              <Sparkles className="size-3.5" /> {a.pressureLevel} pressure signal
            </span>
            <p className="mt-4 font-display text-2xl leading-snug">{a.headline}</p>
            <p className="mt-3 text-muted-foreground">{a.summary}</p>

            <h2 className="mt-8 text-lg">What may be affecting you</h2>
            <ul className="mt-3 space-y-2.5">
              {a.drivers.map((d) => (
                <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface animate-rise p-6 sm:p-8">
            <h2 className="text-lg">Wellness snapshot</h2>
            <div className="mt-5 space-y-4">
              <MetricBar label="Mood" value={latestCheckIn.mood} />
              <MetricBar label="Stress" value={latestCheckIn.stress} inverted />
              <MetricBar label="Sleep" value={latestCheckIn.sleep} />
              <MetricBar label="Energy" value={latestCheckIn.energy} />
              <MetricBar label="Confidence" value={latestCheckIn.confidence} />
              <MetricBar label="Loneliness" value={latestCheckIn.loneliness} inverted />
            </div>
          </div>
        </div>

        <h2 className="mt-10 text-2xl">Recommended next steps</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {a.steps.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="surface group animate-rise p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <h3 className="text-base">{s.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Try it <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="rounded-xl">
            <Link to="/dashboard">
              View My Wellness Dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link to="/plan">See my wellness plan</Link>
          </Button>
        </div>

        <div className="mt-6">
          <Disclaimer>
            MindBridge provides mental-wellness support and does not replace professional diagnosis
            or treatment. If you feel unsafe, open Safety &amp; Support right away.
          </Disclaimer>
        </div>
      </PageContainer>
    </AppShell>
  );
}
