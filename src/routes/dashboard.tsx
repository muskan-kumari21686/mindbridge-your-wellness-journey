import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ArrowRight, CalendarCheck, Flame, Sprout } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "@/components/mindbridge/AppShell";
import { Button } from "@/components/ui/button";
import { Disclaimer, MetricBar, StatTile } from "@/components/mindbridge/WellnessBits";
import { useMindBridge, gardenStage } from "@/lib/mindbridge/store";
import { analyseCheckIn } from "@/lib/mindbridge/ai";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Wellness Dashboard — MindBridge" },
      {
        name: "description",
        content:
          "Your anonymous MindBridge space: today's self-reported wellness, multi-day trends and personalized suggestions.",
      },
      { property: "og:title", content: "Wellness Dashboard — MindBridge" },
      {
        property: "og:description",
        content: "Track self-reported mood, stress and sleep trends over time.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { anonId, checkIns, latestCheckIn, xp, journal, t } = useMindBridge();
  const { stage } = gardenStage(xp);

  const chartData = checkIns.slice(-7).map((c, i) => ({
    day: `Day ${i + 1}`,
    Mood: c.mood,
    Stress: c.stress,
    Sleep: c.sleep,
  }));

  const analysis = latestCheckIn ? analyseCheckIn(latestCheckIn) : null;

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow={anonId ? `${t("common.anonId")} · ${anonId}` : "Anonymous session"}
          title={`${t("common.welcome")} 👋`}
          subtitle="Everything below is self-reported and stored locally in this prototype."
          action={
            <Button asChild className="rounded-xl">
              <Link to="/checkin">
                <CalendarCheck className="size-4" /> New check-in
              </Link>
            </Button>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="Check-ins"
            value={checkIns.length}
            hint="Self-reported entries"
            icon={<CalendarCheck className="size-4 text-primary" />}
          />
          <StatTile
            label={t("common.xp")}
            value={xp}
            hint={`Garden stage: ${stage.name}`}
            icon={<Sprout className="size-4 text-primary" />}
          />
          <StatTile
            label="Journal entries"
            value={journal.length}
            hint="Stored on this device"
            icon={<Flame className="size-4 text-accent" />}
          />
          <StatTile
            label="Pressure signal"
            value={<span className="capitalize">{analysis?.pressureLevel ?? "—"}</span>}
            hint="From your last check-in"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="surface animate-rise p-6">
            <h2 className="text-xl">{t("common.todaysWellness")}</h2>
            {latestCheckIn ? (
              <div className="mt-5 space-y-4">
                <MetricBar label={t("common.mood")} value={latestCheckIn.mood} />
                <MetricBar label={t("common.stress")} value={latestCheckIn.stress} inverted />
                <MetricBar label={t("common.sleep")} value={latestCheckIn.sleep} />
                <MetricBar label={t("common.energy")} value={latestCheckIn.energy} />
                <MetricBar label={t("common.confidence")} value={latestCheckIn.confidence} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No check-in yet — take one to fill this card.
              </p>
            )}
          </div>

          <div className="surface animate-rise p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl">{t("common.trend")}</h2>
              <span className="text-xs text-muted-foreground">Last {chartData.length} entries</span>
            </div>
            <div className="mt-5 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="Mood"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Stress"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sleep"
                    stroke="var(--color-chart-3)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Self-reported wellness trends — not medical measurements.
            </p>
          </div>
        </div>

        {analysis && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.steps.slice(0, 3).map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="surface group p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Recommended
                </p>
                <h3 className="mt-2 text-base">{s.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Disclaimer>{t("common.disclaimer")}</Disclaimer>
        </div>
      </PageContainer>
    </AppShell>
  );
}
