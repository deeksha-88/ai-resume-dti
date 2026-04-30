import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";

const items = [
  { title: "Dashboard", url: "/" },
  { title: "Upload Resume", url: "/upload" },
  { title: "Analysis Score", url: "/analysis/score" },
  { title: "Skill Gap", url: "/analysis/skills" },
  { title: "Jobs", url: "/analysis/jobs" },
  { title: "Salary", url: "/analysis/salary" },
  { title: "Roadmap", url: "/analysis/roadmap" },
  { title: "Modified Resume", url: "/analysis/resume" },
  { title: "Mock Interview", url: "/analysis/interview" },
  { title: "Chatbot", url: "/analysis/chatbot" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="md:hidden border-b border-border bg-sidebar">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">AI Resume Analyzer</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-sidebar-accent"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <nav className="px-2 pb-3 grid grid-cols-2 gap-1">
          {items.map((it) => (
            <Link
              key={it.url}
              to={it.url}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-md text-xs ${
                pathname === it.url
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/60"
              }`}
            >
              {it.title}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}