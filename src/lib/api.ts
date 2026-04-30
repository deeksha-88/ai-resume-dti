const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000";

export type AnalysisResult = {
  jobRole: string;
  roleKey: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  extractedSkills: string[];
  suggestions: string[];
  jobRecommendations: Array<{
    title: string;
    company: string;
    matchPercent: number;
    keySkills: string[];
    location: string;
  }>;
  salaryInsights: {
    currency: string;
    junior: string;
    mid: string;
    senior: string;
    expectedForYou: string;
    note: string;
  };
  learningRoadmap: Array<{ title: string; link: string }>;
  modifiedResume: {
    summary: string;
    keywordsToAdd: string[];
    rewrittenBullets: string[];
    originalLength: number;
  };
  mockInterviewQuestions: Array<{ id: number; question: string }>;
  chatbotResponse: string;
};

export async function analyzeResume(resumeText: string, jobRole: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jobRole }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Failed to analyze");
  }
  return res.json();
}

export async function chatWithBot(message: string, context: AnalysisResult): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });
  if (!res.ok) throw new Error("Chat failed");
  const data = await res.json();
  return data.reply as string;
}

export { API_BASE };