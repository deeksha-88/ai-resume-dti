import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";
import { analyzeResume, extractPdfText } from "@/lib/api";
import { analysisStore } from "@/store/analysisStore";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Resume — AI Resume Analyzer" },
      { name: "description", content: "Upload your resume and target role to get AI-powered analysis." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setError(null);
    const isText = file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md");
    if (isText) {
      const text = await file.text();
      setResumeText(text);
      return;
    }
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      // Send PDF to backend for proper parsing with pdf-parse.
      try {
        const extracted = await extractPdfText(file);
        if (extracted && extracted.trim().length > 20) {
          setResumeText(extracted);
        } else {
          setError("Could not extract readable text from this PDF. Please paste the resume text below.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message}. Make sure the backend is running on http://localhost:5000.`
            : "Failed to extract PDF. Please paste the resume text below.",
        );
      }
      return;
    }
    setError("Unsupported file type. Use PDF or TXT, or paste text below.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (resumeText.trim().length < 20) {
      setError("Please provide at least 20 characters of resume text.");
      return;
    }
    if (!jobRole.trim()) {
      setError("Enter a target job role.");
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeResume(resumeText, jobRole);
      analysisStore.set({ result, resumeText, jobRole, fileName });
      navigate({ to: "/analysis/score" });
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. Make sure the backend is running on http://localhost:5000.`
          : "Failed to analyze",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <SectionHeader
        title="Upload your resume"
        description="Upload a PDF or paste your resume text. Then enter the role you're targeting."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="rounded-xl border border-dashed border-border bg-card p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer py-6">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              {fileName ? (
                <span className="inline-flex items-center gap-2 text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> {fileName}
                </span>
              ) : (
                "Click to upload PDF or TXT"
              )}
            </span>
            <input
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Or paste resume text</label>
          <textarea
            className="w-full min-h-[160px] rounded-lg bg-input border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <div className="text-xs text-muted-foreground mt-1">{resumeText.length} characters</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Target job role</label>
          <input
            className="w-full rounded-lg bg-input border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Frontend Developer, Data Scientist, DevOps Engineer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            <>Get Analysis</>
          )}
        </button>
      </form>
    </div>
  );
}