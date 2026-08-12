import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [courses, lessons, students] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      return {
        courses: courses.count ?? 0,
        lessons: lessons.count ?? 0,
        students: students.count ?? 0,
      };
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl">Übersicht</h1>
      <p className="mt-1 text-muted-foreground">Willkommen im Verwaltungsbereich.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Kurse" value={data?.courses ?? "—"} />
        <Stat label="Lektionen" value={data?.lessons ?? "—"} />
        <Stat label="Nutzer" value={data?.students ?? "—"} />
      </div>
      <div className="mt-8">
        <Button asChild><Link to="/admin/courses">Kurse & Lektionen verwalten</Link></Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-4xl">{value}</div>
    </div>
  );
}
