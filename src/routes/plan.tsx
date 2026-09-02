import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Target } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "@/components/mindbridge/AppShell";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/mindbridge/WellnessBits";
import { Progress } from "@/components/ui/progress";
import { useMindBridge, XP_REWARDS } from "@/lib/mindbridge/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Your Wellness Plan — MindBridge" },
      {
        name: "description",
        content:
          "A personalized set of small daily steps generated from your latest self-reported wellness check-in.",
      },
      { property: "og:title", content: "Your Wellness Plan — MindBridge" },
      {
        property: "og:description",
        content: "Small steps today: breathing, journaling, focus and connection.",
      },
    ],
  }),
  component: PlanPage,
});

interface Rec {
  title: string;
  why: string;
  to: string;
  cta: string;
}

function PlanPage() {
  const { latestCheckIn, awardXp } = useMindBridge();
  const [done, setDone] = useState<string[]>([]);

  const c = latestCheckIn;
  const recs: Rec[] = [];
  if (!c || c.stress >= 6)
    recs.push({
      title: "Breathing Bubble",
      why: "Stress is running high — a slow breathing cycle settles the nervous system fastest.",
      to: "/mindgym",
      cta: "Start breathing",
    });
  if (!c || c.confidence <= 6)
    recs.push({
      title: "Positive Puzzle",
      why: "Confidence feels shaky — a short reframing activity collects small proof.",
      to: "/mindgym",
      cta: "Open MindGym",
    });
  if (!c || c.energy <= 6)
    recs.push({
      title: "Focus Challenge",
      why: "Low energy makes focus harder — a two-minute win restarts momentum.",
      to: "/mindgym",
      cta: "Try focus",
    });
  if (!c || c.loneliness >= 5)
    recs.push({
      title: "SafeConnect",
      why: "You reported feeling disconnected — talking to a person can help.",
      to: "/safeconnect",
      cta: "See support profiles",
    });
  recs.push({
    title: "SafeTalk AI",
    why: "When you just need to say it out loud without being judged.",
    to: "/safetalk",
    cta: "Start a chat",
  });
  if (!c || c.sleep <= 6)
    recs.push({
      title: "Wind-down note",
      why: "Rest is low — writing tomorrow's first task frees your mind tonight.",
      to: "/journal",
      cta: "Open journal",
    });

  const STEPS = [
    "2-minute breathing",
    "Write one thought in your journal",
    "Take a short break",
    "Complete one MindGym activity",
  ];

  const toggle = (s: string) => {
    setDone((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      awardXp(XP_REWARDS.action, s);
      toast.success(`Nice step · +${XP_REWARDS.action} XP`);
      return [...prev, s];
    });
  };

  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Personalized"
          title="Your Wellness Plan 🎯"
          subtitle="Built from your most recent check-in. Do what fits today — skipping is allowed."
        />

        <div className="surface animate-rise p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl">Your small steps today</h2>
            <span className="text-sm text-muted-foreground">
              {done.length}/{STEPS.length} complete
            </span>
          </div>
          <Progress value={pct} className="mt-4 h-2" />
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {STEPS.map((s) => {
              const active = done.includes(s);
              return (
                <li key={s}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(s)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition-all",
                      active
                        ? "border-primary bg-secondary text-secondary-foreground"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                    </span>
                    <span className={active ? "line-through opacity-70" : ""}>{s}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <h2 className="mt-10 text-2xl">Recommended for you</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recs.map((r) => (
            <div key={r.title} className="surface animate-rise flex flex-col p-6">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Target className="size-5" />
              </span>
              <h3 className="mt-4 text-lg">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.why}</p>
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link to={r.to}>{r.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Disclaimer>
            Recommendations come from simple rules over your self-reported scores in this prototype —
            they are not clinical advice.
          </Disclaimer>
        </div>
      </PageContainer>
    </AppShell>
  );
}
