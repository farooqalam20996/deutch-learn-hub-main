import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  component: AdminCourses,
});

function AdminCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, level, title, is_published, price_cents, currency, modules(id, lessons(id))")
        .order("level");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl">Kurse & Lektionen</h1>
      <p className="mt-1 text-muted-foreground">Wähle einen Kurs, um Module und Lektionen zu bearbeiten.</p>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Lädt …</p>
      ) : (
        <div className="mt-8 space-y-3">
          {data?.map((c) => {
            const moduleCount = c.modules?.length ?? 0;
            const lessonCount = (c.modules ?? []).reduce((s, m) => s + (m.lessons?.length ?? 0), 0);
            return (
              <Link
                key={c.id}
                to="/admin/courses/$courseId"
                params={{ courseId: c.id }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-9 w-12 items-center justify-center rounded-md bg-primary/10 font-serif text-base font-semibold text-primary">{c.level}</span>
                  <div>
                    <div className="font-serif text-lg">{c.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {moduleCount} Module · {lessonCount} Lektionen {c.is_published ? "· veröffentlicht" : "· Entwurf"}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        Neue Kurse außerhalb von A1–C2 sind in einer späteren Phase geplant.
        <Button asChild variant="link" className="ml-2 p-0">
          <Link to="/admin">Zurück</Link>
        </Button>
      </div>
    </div>
  );
}
