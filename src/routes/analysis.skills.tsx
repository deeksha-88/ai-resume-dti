import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";

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
        <div className="grid md:grid-cols-2 gap-6">
          <Card title={`Required for ${result.jobRole}`} items={result.requiredSkills} tone="muted" />
          <Card title="Detected in your resume" items={result.extractedSkills} tone="primary" />
          <Card title="✅ Matched" items={result.matchedSkills} tone="primary" />
          <Card title="⚠️ Missing — focus here" items={result.missingSkills} tone="destructive" />
        </div>
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