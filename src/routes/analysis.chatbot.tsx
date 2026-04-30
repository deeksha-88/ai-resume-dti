import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useAnalysis } from "@/store/analysisStore";
import { SectionHeader, NoDataNotice } from "@/components/SectionHeader";
import { chatWithBot } from "@/lib/api";
import { Send, Bot, User, Loader2 } from "lucide-react";

export const Route = createFileRoute("/analysis/chatbot")({
  head: () => ({ meta: [{ title: "Chatbot — AI Resume Analyzer" }] }),
  component: ChatbotPage,
});

type Msg = { role: "user" | "bot"; text: string };

function ChatbotPage() {
  const { result } = useAnalysis();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && messages.length === 0) {
      setMessages([{ role: "bot", text: result.chatbotResponse }]);
    }
  }, [result, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || !result) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await chatWithBot(userMsg, result);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Couldn't reach the backend. Make sure it's running on localhost:5000." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-3xl mx-auto flex flex-col" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <SectionHeader title="AI Chatbot" description="Ask follow-up questions about your resume, jobs, salary, or learning plan." />
      {!result ? (
        <NoDataNotice />
      ) : (
        <>
          <div className="flex-1 rounded-xl border border-border bg-card p-4 overflow-y-auto space-y-3 min-h-[300px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div
                    className="h-7 w-7 shrink-0 rounded-md flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="h-7 w-7 shrink-0 rounded-md bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "How can I improve?" or "Show jobs"'
              className="flex-1 rounded-lg bg-input border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg px-4 text-primary-foreground disabled:opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Try: "How can I improve?", "What's my salary?", "Show jobs", "Show roadmap", "Score?"
          </p>
        </>
      )}
    </div>
  );
}