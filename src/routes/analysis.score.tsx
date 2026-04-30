import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/analysis/score")({
  head: () => ({ meta: [{ title: "Analysis Score — AI Resume Analyzer" }] }),
  component: ScorePage,
});

function ScorePage() {
  const { result } = useAnalysis();

  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <SectionHeader
        title="Analysis Score"
        description="Your resume's match score against the target role's required skills."
      />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="md:col-span-1 rounded-xl border border-border bg-card p-6 text-center"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-sm text-muted-foreground mb-2">Match Score</div>
            <div
              className="text-6xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {result.score}
            </div>
            <div className="text-xs text-muted-foreground mt-1">out of 100</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${result.score}%`, background: "var(--gradient-primary)" }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Target: <span className="text-foreground font-medium">{result.jobRole}</span>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-semibold mb-3">Suggestions</h3>
            <ul className="space-y-2 text-sm">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Matched Skills ({result.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.length === 0 && (
                  <span className="text-sm text-muted-foreground">None detected.</span>
                )}
                {result.matchedSkills.map((s) => (
                  <span key={s} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" /> Missing Skills ({result.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length === 0 && (
                  <span className="text-sm text-muted-foreground">No gaps! 🎉</span>
                )}
                {result.missingSkills.map((s) => (
                  <span key={s} className="rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}