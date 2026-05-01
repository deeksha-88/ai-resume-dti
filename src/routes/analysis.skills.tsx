import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
);

export const Route = createFileRoute("/analysis/skills")({
  head: () => ({ meta: [{ title: "Skill Gap — AI Resume Analyzer" }] }),
  component: SkillsPage,
});

function SkillsPage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <SectionHeader title="Skill Gap" description="A side-by-side view of skills you have vs skills the role demands." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card title={`Required for ${result.jobRole}`} items={result.requiredSkills} tone="muted" />
            <Card title="Detected in your resume" items={result.extractedSkills} tone="primary" />
            <Card title="✅ Matched" items={result.matchedSkills} tone="primary" />
            <Card title="⚠️ Missing — focus here" items={result.missingSkills} tone="destructive" />
          </div>
          <Charts result={result} />
        </>
      )}
    </div>
  );
}

function Card({ title, items, tone }: { title: string; items: string[]; tone: "primary" | "destructive" | "muted" }) {
  const cls =
    tone === "primary"
      ? "border-primary/40 bg-primary/10 text-primary"
      : tone === "destructive"
        ? "border-destructive/40 bg-destructive/10 text-destructive"
        : "border-border bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
        {items.map((s) => (
          <span key={s} className={`rounded-full border px-3 py-1 text-xs ${cls}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function Charts({ result }: { result: ReturnType<typeof useAnalysis>["result"] }) {
  if (!result) return null;
  const matched = result.matchedSkills;
  const missing = result.missingSkills;
  const required = result.requiredSkills;

  // Pie: matched vs missing counts
  const pieData = {
    labels: ["Matched", "Missing"],
    datasets: [
      {
        data: [matched.length, missing.length],
        backgroundColor: ["rgba(34,197,94,0.75)", "rgba(239,68,68,0.75)"],
        borderColor: ["rgb(34,197,94)", "rgb(239,68,68)"],
        borderWidth: 1,
      },
    ],
  };

  // Bar: each required skill -> 1 (have) or 0 (missing)
  const barData = {
    labels: required,
    datasets: [
      {
        label: "Skill present (1) / missing (0)",
        data: required.map((s) => (matched.includes(s) ? 1 : 0)),
        backgroundColor: required.map((s) =>
          matched.includes(s) ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.6)",
        ),
      },
    ],
  };

  // Radar: coverage across 6 buckets — use first 6 required skills
  const radarLabels = required.slice(0, Math.min(8, required.length));
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: "Your Coverage",
        data: radarLabels.map((s) => (matched.includes(s) ? 100 : 0)),
        backgroundColor: "rgba(99,102,241,0.25)",
        borderColor: "rgb(99,102,241)",
        borderWidth: 2,
      },
      {
        label: "Role Requirement",
        data: radarLabels.map(() => 100),
        backgroundColor: "rgba(148,163,184,0.15)",
        borderColor: "rgb(148,163,184)",
        borderWidth: 1,
        borderDash: [4, 4],
      },
    ],
  };

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
  };

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="font-semibold mb-1">Matched vs Missing</h3>
        <p className="text-xs text-muted-foreground mb-3">
          {result.matchedPercent}% matched · {result.missingPercent}% missing
        </p>
        <div className="h-64">
          <Pie data={pieData} options={baseOpts} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="font-semibold mb-3">Per-skill coverage</h3>
        <div className="h-72">
          <Bar
            data={barData}
            options={{
              ...baseOpts,
              scales: {
                y: { min: 0, max: 1, ticks: { stepSize: 1 } },
                x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 } },
              },
              plugins: { ...baseOpts.plugins, legend: { display: false } },
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="font-semibold mb-3">Skill coverage radar</h3>
        <div className="h-80">
          <Radar
            data={radarData}
            options={{
              ...baseOpts,
              scales: { r: { min: 0, max: 100, ticks: { stepSize: 25 } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}