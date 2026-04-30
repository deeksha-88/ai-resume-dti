import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>}
    </header>
  );
}

export function NoDataNotice() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
      <p className="text-muted-foreground mb-4">
        No analysis yet. Upload your resume and target role to see results here.
      </p>
      <Link
        to="/upload"
        className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        Go to Upload <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}