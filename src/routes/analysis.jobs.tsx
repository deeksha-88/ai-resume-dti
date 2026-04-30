import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import { Briefcase, MapPin } from "lucide-react";

export const Route = createFileRoute("/analysis/jobs")({
  head: () => ({ meta: [{ title: "Job Recommendations — AI Resume Analyzer" }] }),
  component: JobsPage,
});

function JobsPage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <SectionHeader title="Job Recommendations" description="Roles aligned with your skills and target." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {result.jobRecommendations.map((j, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" /> {j.company}
                  </div>
                  <h3 className="mt-1 font-semibold">{j.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {j.location}
                  </div>
                </div>
                <div
                  className="rounded-lg px-3 py-2 text-sm font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {j.matchPercent}%
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {j.keySkills.map((s) => (
                  <span key={s} className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}