import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlayCircle, Lock } from "lucide-react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];

const courseDetailQuery = (level: string) =>
  queryOptions({
    queryKey: ["course-detail", level],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("level", level as Level)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!course) return null;
      const [{ data: modules }, { data: catalog }] = await Promise.all([
        supabase
          .from("modules")
          .select("id, title, title_en, description, description_en, sort_order")
          .eq("course_id", course.id)
          .order("sort_order"),
        supabase.rpc("lesson_catalog", { _course_id: course.id }),
      ]);
      const lessons = catalog ?? [];
      return {
        course,
        modules: (modules ?? []).map((m) => ({
          ...m,
          lessons: lessons.filter((l) => l.module_id === m.id),
        })),
      };
    },
  });

export const Route = createFileRoute("/courses/$level")({
  head: ({ params }) => ({
    meta: [
      { title: `Deutschkurs ${params.level} — Deutsch Akademie` },
      { name: "description", content: `Deutschkurs auf Niveau ${params.level}: Lektionen, Inhalte und Einschreibung.` },
      { property: "og:title", content: `Deutschkurs ${params.level}` },
    ],
  }),
  loader: async ({ context, params }) => {
    const lvl = params.level.toUpperCase();
    if (!LEVELS.includes(lvl as Level)) throw notFound();
    await context.queryClient.ensureQueryData(courseDetailQuery(lvl));
    return { level: lvl };
  },
  component: CourseDetailPage,
  notFoundComponent: () => (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Kurs nicht gefunden</h1>
        <Button asChild className="mt-6"><Link to="/courses">Zurück zu Kursen</Link></Button>
      </div>
      <SiteFooter />
    </>
  ),
  errorComponent: ({ error }) => (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Etwas ist schiefgelaufen</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
      <SiteFooter />
    </>
  ),
});

function CourseDetailPage() {
  const level = Route.useParams().level.toUpperCase();
  const { t, i18n } = useTranslation();
  const { data } = useSuspenseQuery(courseDetailQuery(level));

  if (!data) {
    return (
      <>
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-serif text-3xl">Kurs nicht verfügbar</h1>
          <Button asChild className="mt-6"><Link to="/courses">Alle Kurse</Link></Button>
        </div>
        <SiteFooter />
      </>
    );
  }
  const { course, modules } = data;
  const en = i18n.language === "en";
  const fmt = (cents: number) =>
    new Intl.NumberFormat(en ? "en-US" : "de-DE", { style: "currency", currency: course.currency, maximumFractionDigits: 0 }).format(cents / 100);

  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length ?? 0), 0);

  return (
    <>
      <SiteHeader />
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex h-9 items-center rounded-md bg-primary/10 px-3 font-serif text-lg font-semibold text-primary">
                {course.level}
              </span>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
                {en && course.title_en ? course.title_en : course.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {en && course.description_en ? course.description_en : course.description}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {modules.length} {en ? "modules" : "Module"} · {totalLessons} {en ? "lessons" : "Lektionen"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="font-serif text-3xl font-semibold">{fmt(course.price_cents)}</div>
              <div className="text-xs text-muted-foreground">{course.is_subscription ? (en ? "/ month" : "/ Monat") : (en ? "one-time" : "Einmalzahlung")}</div>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link to="/auth">{t("courses.enroll")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl">{en ? "Curriculum" : "Lehrplan"}</h2>
        {modules.length === 0 ? (
          <p className="mt-6 text-muted-foreground">{en ? "Curriculum coming soon." : "Lehrplan folgt in Kürze."}</p>
        ) : (
          <div className="mt-8 space-y-4">
            {modules.map((m, mi) => (
              <article key={m.id} className="rounded-xl border border-border bg-card p-6">
                <header>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {en ? "Module" : "Modul"} {mi + 1}
                  </div>
                  <h3 className="mt-1 font-serif text-xl">{en && m.title_en ? m.title_en : m.title}</h3>
                  {(en ? m.description_en : m.description) && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{en && m.description_en ? m.description_en : m.description}</p>
                  )}
                </header>
                {m.lessons && m.lessons.length > 0 && (
                  <ul className="mt-4 divide-y divide-border">
                    {[...m.lessons]

                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((l) => (
                        <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                          <span className="flex items-center gap-2">
                            {l.is_free_preview ? <PlayCircle className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                            {en && l.title_en ? l.title_en : l.title}
                          </span>
                          {l.duration_minutes && <span className="text-xs text-muted-foreground">{l.duration_minutes} min</span>}
                        </li>
                      ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}
