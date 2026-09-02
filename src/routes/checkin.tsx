import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "@/components/mindbridge/AppShell";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Disclaimer } from "@/components/mindbridge/WellnessBits";
import { FACTORS } from "@/lib/mindbridge/mock-data";
import { useMindBridge } from "@/lib/mindbridge/store";
import type { WellnessScores } from "@/lib/mindbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Wellness Check-in — MindBridge" },
      {
        name: "description",
        content:
          "A two-minute self-reported check-in on mood, stress, sleep, energy, confidence and loneliness.",
      },
      { property: "og:title", content: "Wellness Check-in — MindBridge" },
      {
        property: "og:description",
        content: "Rate how you're doing today and get a supportive, non-diagnostic reflection.",
      },
    ],
  }),
  component: CheckInPage,
});

const SLIDERS: { key: keyof WellnessScores; label: string; low: string; high: string }[] = [
  { key: "mood", label: "Mood", low: "Very low", high: "Very good" },
  { key: "stress", label: "Stress", low: "Calm", high: "Overwhelmed" },
  { key: "sleep", label: "Sleep", low: "Barely rested", high: "Well rested" },
  { key: "loneliness", label: "Loneliness", low: "Connected", high: "Very lonely" },
  { key: "energy", label: "Energy", low: "Drained", high: "Energised" },
  { key: "confidence", label: "Confidence", low: "Shaky", high: "Steady" },
];

function CheckInPage() {
  const { addCheckIn, anonId, setAnonId } = useMindBridge();
  const navigate = useNavigate();
  const [scores, setScores] = useState<WellnessScores>({
    mood: 6,
    stress: 7,
    sleep: 5,
    energy: 6,
    confidence: 5,
    loneliness: 4,
  });
  const [factors, setFactors] = useState<string[]>(["Studies"]);
  const [loading, setLoading] = useState(false);

  const toggleFactor = (f: string) =>
    setFactors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const submit = () => {
    if (!anonId) setAnonId(`MB-${Math.random().toString(16).slice(2, 8).toUpperCase()}`);
    setLoading(true);
    // FUTURE: POST /api/checkins -> AI/NLP analysis service
    setTimeout(() => {
      addCheckIn({ ...scores, factors });
      toast.success("Check-in saved · +15 XP");
      navigate({ to: "/analysis" });
    }, 900);
  };

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Step 1 of 3"
          title="Wellness check-in"
          subtitle="Rate today honestly — there are no wrong answers, and nothing here is a medical test."
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface animate-rise space-y-7 p-6 sm:p-8">
            {SLIDERS.map((s) => (
              <div key={s.key}>
                <div className="flex items-baseline justify-between">
                  <label className="font-medium" htmlFor={`slider-${s.key}`}>
                    {s.label}
                  </label>
                  <span className="font-display text-xl tabular-nums text-primary">
                    {scores[s.key]}
                    <span className="text-sm text-muted-foreground">/10</span>
                  </span>
                </div>
                <Slider
                  id={`slider-${s.key}`}
                  className="mt-3"
                  min={1}
                  max={10}
                  step={1}
                  value={[scores[s.key]]}
                  onValueChange={([v]) => setScores((p) => ({ ...p, [s.key]: v ?? 5 }))}
                  aria-label={s.label}
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{s.low}</span>
                  <span>{s.high}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="surface animate-rise p-6 sm:p-8">
              <h2 className="text-xl">What's affecting you most right now?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select as many as apply.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FACTORS.map((f) => {
                  const active = factors.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleFactor(f)}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-sm transition-all",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full rounded-xl"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Sparkles className="size-4 animate-pulse" /> Analyzing your check-in…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Analyze My Check-in
                </>
              )}
            </Button>

            <Disclaimer>
              These are self-reported wellness signals, not medical measurements. MindBridge does not
              diagnose any condition.
            </Disclaimer>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
