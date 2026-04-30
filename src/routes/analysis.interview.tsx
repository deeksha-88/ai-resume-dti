import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import { getNextInterviewQuestion } from "@/lib/api";
import { Loader2, Send, RotateCcw, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/analysis/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — AI Resume Analyzer" }] }),
  component: InterviewPage,
});

type Turn = {
  question: string;
  answer: string;
  feedback: string | null;
};

function InterviewPage() {
  const { result } = useAnalysis();
  const questions = result?.mockInterviewQuestions ?? [];

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    // reset when a new analysis arrives
    setIndex(0);
    setAnswer("");
    setHistory([]);
    setFinished(false);
    setSummary(null);
  }, [result?.jobRole, result?.score]);

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || !result || loading) return;
    setLoading(true);
    try {
      const res = await getNextInterviewQuestion({
        questions,
        currentIndex: index,
        answer,
        jobRole: result.jobRole,
      });
      setHistory((h) => [
        ...h,
        { question: questions[index].question, answer, feedback: res.feedback },
      ]);
      setAnswer("");
      if (res.finished) {
        setFinished(true);
        setSummary(res.summary);
      } else if (res.nextIndex !== null) {
        setIndex(res.nextIndex);
      }
    } catch {
      setHistory((h) => [
        ...h,
        {
          question: questions[index].question,
          answer,
          feedback: "Couldn't reach the backend. Make sure it's running on localhost:5000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setIndex(0);
    setAnswer("");
    setHistory([]);
    setFinished(false);
    setSummary(null);
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <SectionHeader
        title="Mock Interview"
        description="Interactive practice. Answer one question at a time and get feedback before moving on."
      />
      {!result ? (
        <NoDataNotice />
      ) : questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No interview questions generated.</p>
      ) : (
        <div className="space-y-4">
          {/* History */}
          {history.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex gap-3">
                <div
                  className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-xs font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Q{i + 1}
                </div>
                <p className="text-sm leading-relaxed font-medium">{t.question}</p>
              </div>
              <div className="ml-11 text-sm text-muted-foreground whitespace-pre-wrap">
                <span className="font-medium text-foreground">You:</span> {t.answer}
              </div>
              {t.feedback && (
                <div className="ml-11 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
                  <span className="font-semibold">Feedback:</span> {t.feedback}
                </div>
              )}
            </div>
          ))}

          {/* Current question */}
          {!finished && (
            <form
              onSubmit={submitAnswer}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex gap-3">
                <div
                  className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-xs font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Q{index + 1}
                </div>
                <p className="text-sm leading-relaxed font-medium">{questions[index].question}</p>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here. Add a specific example and a metric for a stronger response."
                className="w-full min-h-[120px] rounded-lg bg-input border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Question {index + 1} of {questions.length}
                </span>
                <button
                  type="submit"
                  disabled={loading || !answer.trim()}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Submit & Next
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Finished */}
          {finished && (
            <div
              className="rounded-xl border border-primary/40 bg-primary/10 p-5 space-y-3"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 text-primary font-semibold">
                <CheckCircle2 className="h-5 w-5" /> Interview complete
              </div>
              {summary && <p className="text-sm">{summary}</p>}
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" /> Restart interview
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
