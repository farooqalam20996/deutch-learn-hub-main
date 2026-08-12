import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learn/$courseId")({
  head: () => ({ meta: [{ title: "Lernen — Deutsch Akademie" }] }),
  component: LearnLayout,
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Kurs nicht gefunden</div>,
});

function LearnLayout() {
  const { courseId } = Route.useParams();
  const params = useParams({ strict: false }) as { lessonId?: string };
  const activeLessonId = params.lessonId;
  const { i18n } = useTranslation();
  const en = i18n.language === "en";

  const { data, isLoading } = useQuery({
    queryKey: ["learn-course", courseId],
    queryFn: async () => {
      const [{ data: course }, { data: rawModules }, { data: catalog }, { data: user }] = await Promise.all([
        supabase.from("courses").select("id, title, title_en, level").eq("id", courseId).maybeSingle(),
        supabase
          .from("modules")
          .select("id, title, title_en, sort_order")
          .eq("course_id", courseId)
          .order("sort_order"),
        supabase.rpc("lesson_catalog", { _course_id: courseId }),
        supabase.auth.getUser(),
      ]);
      const catalogLessons = catalog ?? [];
      const modules = (rawModules ?? []).map((m) => ({
        ...m,
        lessons: catalogLessons.filter((l) => l.module_id === m.id),
      }));
      const userId = user.user?.id;
      const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
      let completed = new Set<string>();
      if (userId && lessonIds.length) {
        const { data: prog } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);
        completed = new Set((prog ?? []).map((p) => p.lesson_id));
      }
      return { course, modules: modules ?? [], completed };
    },
  });

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Lädt …</div>;
  if (!data?.course) return <div className="p-10 text-center">Kurs nicht gefunden</div>;

  const { course, modules, completed } = data;

  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-primary">← Dashboard</Link>
          <div className="mt-2">
            <div className="inline-flex h-7 items-center rounded-md bg-primary/10 px-2 font-serif text-sm font-semibold text-primary">{course.level}</div>
            <h2 className="mt-2 font-serif text-xl">{en && course.title_en ? course.title_en : course.title}</h2>
          </div>
          <div className="mt-5 space-y-5">
            {modules.map((m) => {
              const lessons = [...(m.lessons ?? [])]

                .sort((a, b) => a.sort_order - b.sort_order);
              return (
                <div key={m.id}>
                  <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{en && m.title_en ? m.title_en : m.title}</h3>
                  <ul className="mt-1.5">
                    {lessons.map((l) => {
                      const active = l.id === activeLessonId;
                      const done = completed.has(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to="/learn/$courseId/$lessonId"
                            params={{ courseId, lessonId: l.id }}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}`}
                          >
                            {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : active ? <PlayCircle className="h-4 w-4" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                            <span className="truncate">{en && l.title_en ? l.title_en : l.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {modules.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Lektionen.</p>}
          </div>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}
