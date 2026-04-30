import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";

export const Route = createFileRoute("/analysis/resume")({
  head: () => ({ meta: [{ title: "Modified Resume — AI Resume Analyzer" }] }),
  component: ResumePage,
});

function ResumePage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <SectionHeader title="Modified Resume" description="AI-suggested rewrites and keywords to add for better matching." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Suggested Summary</h3>
            <p className="text-sm leading-relaxed">{result.modifiedResume.summary}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">Keywords to add</h3>
            <div className="flex flex-wrap gap-2">
              {result.modifiedResume.keywordsToAdd.length === 0 && (
                <span className="text-sm text-muted-foreground">No additional keywords needed.</span>
              )}
              {result.modifiedResume.keywordsToAdd.map((k) => (
                <span key={k} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">Rewritten bullet points</h3>
            <ul className="space-y-2 text-sm list-disc pl-5">
              {result.modifiedResume.rewrittenBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}