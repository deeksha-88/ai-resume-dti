const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000";

export type AnalysisResult = {
  jobRole: string;
  roleKey: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  extractedSkills: string[];
  matchedPercent: number;
  missingPercent: number;
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
  skillDistribution: {
    matchedPercentage: number;
    missingPercentage: number;
    pieData: Array<{ name: string; value: number; percentage: number }>;
  };
  modifiedResume: {
    summary: string;
    keywordsToAdd: string[];
    rewrittenBullets: string[];
    skillsSection?: string;
    experienceSection?: string;
    fullResume?: string;
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

export type InterviewNextResponse = {
  feedback: string | null;
  finished: boolean;
  nextIndex: number | null;
  nextQuestion: { id: number; question: string } | null;
  summary: string | null;
};

export async function getNextInterviewQuestion(params: {
  questions: Array<{ id: number; question: string }>;
  currentIndex: number;
  answer?: string;
  jobRole?: string;
}): Promise<InterviewNextResponse> {
  const res = await fetch(`${API_BASE}/interview/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Interview step failed");
  return res.json();
}

export { API_BASE };