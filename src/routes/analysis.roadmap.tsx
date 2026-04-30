import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import { ExternalLink, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/analysis/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — AI Resume Analyzer" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <SectionHeader
        title="Learning Roadmap"
        description="Curated free resources from W3Schools, freeCodeCamp, and MDN — only trusted links."
      />
      {!result ? (
        <NoDataNotice />
      ) : (
        <ol className="space-y-3">
          {result.learningRoadmap.map((step, i) => (
            <li key={step.link} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div
                className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-medium">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {step.title}
                </div>
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 break-all"
                >
                  {step.link} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}