import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Upload,
  Gauge,
  Target,
  Briefcase,
  DollarSign,
  GraduationCap,
  FileEdit,
  MessageSquareCode,
  Bot,
  Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Upload Resume", url: "/upload", icon: Upload },
  { title: "Analysis Score", url: "/analysis/score", icon: Gauge },
  { title: "Skill Gap", url: "/analysis/skills", icon: Target },
  { title: "Job Recommendations", url: "/analysis/jobs", icon: Briefcase },
  { title: "Salary Insights", url: "/analysis/salary", icon: DollarSign },
  { title: "Learning Roadmap", url: "/analysis/roadmap", icon: GraduationCap },
  { title: "Modified Resume", url: "/analysis/resume", icon: FileEdit },
  { title: "Mock Interview", url: "/analysis/interview", icon: MessageSquareCode },
  { title: "Chatbot", url: "/analysis/chatbot", icon: Bot },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5 border-b border-sidebar-border flex items-center gap-2">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-tight">AI Resume</div>
          <div className="text-xs text-muted-foreground -mt-0.5">Analyzer</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) => {
          const active = pathname === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground">
        Backend: <span className="text-primary">localhost:5000</span>
      </div>
    </aside>
  );
}