import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Handshake,
  LineChart,
  LifeBuoy,
  MessagesSquare,
  ShieldCheck,
  Target,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/mindbridge/LanguageSelector";
import { Disclaimer } from "@/components/mindbridge/WellnessBits";
import { useMindBridge } from "@/lib/mindbridge/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindBridge — Recognize. Support. Connect. Improve." },
      {
        name: "description",
        content:
          "Recognize emotional pressure early. Find support privately. Take one small step toward feeling better — anonymously, with no name or email required.",
      },
      { property: "og:title", content: "MindBridge — Mental Wellness & Early Support" },
      {
        property: "og:description",
        content: "A privacy-first mental-wellness prototype with anonymous check-ins and AI support.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: MessagesSquare,
    title: "AI Wellness Support",
    body: "SafeTalk AI listens any time of day and answers with warmth, never with a diagnosis.",
    to: "/safetalk",
  },
  {
    icon: Handshake,
    title: "Safe Human Connection",
    body: "SafeConnect pairs you with demo support profiles, protected by a live safety filter.",
    to: "/safeconnect",
  },
  {
    icon: Brain,
    title: "MindGym Activities",
    body: "Two-minute breathing, focus and memory activities that reset a difficult afternoon.",
    to: "/mindgym",
  },
  {
    icon: LineChart,
    title: "Wellness Tracking",
    body: "Self-reported mood, stress and sleep trends you can actually read at a glance.",
    to: "/dashboard",
  },
  {
    icon: Target,
    title: "Personalized Guidance",
    body: "A plan that adapts to your check-in and suggests the next small, doable step.",
    to: "/plan",
  },
  {
    icon: LifeBuoy,
    title: "Safety Resources",
    body: "Clear routes to emergency, professional and trusted-person support when it matters.",
    to: "/safety",
  },
];

function Landing() {
  const { anonId } = useMindBridge();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold">MindBridge</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <Button asChild variant="ghost" className="hidden rounded-xl sm:inline-flex">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link to="/entry">{anonId ? "Continue" : "Start Anonymously"}</Link>
          </Button>
        </div>
      </header>

      <section className="canvas-glow relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-success" />
              Recognize. Support. Connect. Improve.
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl">
              AI-powered mental wellness &amp; early support
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Recognize emotional pressure early. Find support privately. Take one small step toward
              feeling better.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/entry">
                  Start Anonymously <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-card/70">
                <Link to="/dashboard">Explore MindBridge</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["No name required", "No email required", "Privacy-first experience"].map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Lock className="size-3.5 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise relative">
            <div className="surface animate-float p-6">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Today's snapshot · demo
              </p>
              <p className="mt-3 font-display text-2xl">
                “Your responses suggest increased emotional pressure.”
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["Mood", 6],
                  ["Stress", 7],
                  ["Sleep", 5],
                  ["Energy", 6],
                ].map(([label, v]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="text-muted-foreground">{v}/10</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(v as number) * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl bg-secondary px-3.5 py-3 text-sm text-secondary-foreground">
                Suggested next step: a 2-minute Breathing Bubble.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl">Everything in one calm space</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick whatever you need today. Nothing here is compulsory, and nothing is locked behind an
          account.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="surface group animate-rise p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-16 sm:px-6">
        <Disclaimer>
          MindBridge provides mental-wellness support and does not replace professional diagnosis or
          treatment. This is a frontend prototype — AI responses, support profiles and data are
          simulated.
        </Disclaimer>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MindBridge.</p>
      </footer>
    </div>
  );
}
