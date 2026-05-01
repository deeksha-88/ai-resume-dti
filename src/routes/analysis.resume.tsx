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
      <SectionHeader title="Modified Resume" description="A fully rewritten resume tailored to your target role." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="space-y-5">
          {/* Full rewritten resume — looks like real resume content */}
          <article className="rounded-xl border border-border bg-card p-8 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <header className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">{result.jobRole} — Tailored Resume</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Rewritten using your detected skills, target role keywords, and quantified bullet style.
              </p>
            </header>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Professional Summary</h3>
              <p className="text-sm leading-relaxed">{result.modifiedResume.summary}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Skills</h3>
              <p className="text-sm leading-relaxed">
                {result.matchedSkills.length > 0 ? result.matchedSkills.join(" · ") : "—"}
              </p>
              {result.missingSkills.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Currently learning: {result.missingSkills.slice(0, 5).join(", ")}
                </p>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Experience &amp; Projects</h3>
              <ul className="space-y-2 text-sm list-disc pl-5">
                {result.modifiedResume.rewrittenBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>

            {result.modifiedResume.keywordsToAdd.length > 0 && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Keywords Worth Including</h3>
                <div className="flex flex-wrap gap-2">
                  {result.modifiedResume.keywordsToAdd.map((k) => (
                    <span key={k} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                      {k}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          {result.modifiedResume.fullResume && (
            <details className="rounded-xl border border-border bg-card p-6">
              <summary className="cursor-pointer text-sm font-semibold">Plain-text version (copy/paste ready)</summary>
              <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground font-mono">
                {result.modifiedResume.fullResume}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}