import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";

export const Route = createFileRoute("/analysis/salary")({
  head: () => ({ meta: [{ title: "Salary Insights — AI Resume Analyzer" }] }),
  component: SalaryPage,
});

function SalaryPage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <SectionHeader title="Salary Insights" description="Estimated ranges based on your match score and target role." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="space-y-6">
          <div
            className="rounded-xl border border-border bg-card p-6 text-center"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <div className="text-sm text-muted-foreground mb-2">Expected for you</div>
            <div
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {result.salaryInsights.expectedForYou}
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">{result.salaryInsights.note}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {(["junior", "mid", "senior"] as const).map((lvl) => (
              <div key={lvl} className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{lvl}</div>
                <div className="mt-2 text-xl font-bold">{result.salaryInsights[lvl]}</div>
                <div className="text-xs text-muted-foreground mt-1">{result.salaryInsights.currency} per year</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}