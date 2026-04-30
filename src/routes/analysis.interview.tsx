import { createFileRoute } from "@tanstack/react-router";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";

export const Route = createFileRoute("/analysis/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — AI Resume Analyzer" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const { result } = useAnalysis();
  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <SectionHeader
        title="Mock Interview"
        description="Practice questions tailored to your skills and target role."
      />
      {!result ? (
        <NoDataNotice />
      ) : (
        <div className="space-y-3">
          {result.mockInterviewQuestions.map((q) => (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4 flex gap-3">
              <div
                className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-xs font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                {q.id}
              </div>
              <p className="text-sm leading-relaxed">{q.question}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}