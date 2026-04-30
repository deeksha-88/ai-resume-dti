import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Upload, Brain, Briefcase, Bot, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Resume Analyzer — Smart Career Insights" },
      {
        name: "description",
        content:
          "Upload your resume, set your target role, and get AI-powered analysis: skill gaps, job matches, salary insights, and a personalized learning roadmap.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Upload, title: "Upload Resume", desc: "Drop a PDF or paste your resume text in seconds." },
  { icon: Brain, title: "AI Analysis", desc: "Get a match score, skill gaps, and tailored suggestions." },
  { icon: Briefcase, title: "Job Matches", desc: "Discover roles aligned to your skills and target." },
  { icon: Bot, title: "AI Chatbot", desc: "Ask follow-up questions about your career path." },
];

function Index() {
  return (
    <div className="min-h-full" style={{ background: "var(--gradient-hero)" }}>
      <section className="px-6 md:px-12 pt-16 pb-20 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-6 backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          AI-powered career intelligence
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          AI{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Resume Analyzer
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Upload your resume, set your target role, and get AI-powered analysis including skill gaps,
          job recommendations, salary insights, and a personalized learning roadmap.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/analysis/chatbot"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Talk to AI
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Everything you need</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
