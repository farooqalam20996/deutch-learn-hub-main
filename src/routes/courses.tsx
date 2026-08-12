import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const allCoursesQuery = queryOptions({
  queryKey: ["courses-all"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("level");
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Deutschkurse A1–C2 — Deutsch Akademie" },
      { name: "description", content: "Alle Deutschkurse: A1, A2, B1, B2, C1, C2. Strukturierte Online-Kurse mit Videolektionen und Lerngruppen." },
      { property: "og:title", content: "Deutschkurse A1–C2" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(allCoursesQuery),
  component: CoursesPage,
});

function CoursesPage() {
  const { t, i18n } = useTranslation();
  const { data: courses } = useSuspenseQuery(allCoursesQuery);

  const fmt = (cents: number, currency: string) =>
    new Intl.NumberFormat(i18n.language === "de" ? "de-DE" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">{t("courses.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("courses.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {courses.map((c) => (
            <article
              key={c.id}
              className="flex flex-col rounded-xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex h-9 items-center rounded-md bg-primary/10 px-3 font-serif text-lg font-semibold text-primary">
                    {c.level}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl">
                    {i18n.language === "en" && c.title_en ? c.title_en : c.title}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="font-serif text-2xl font-semibold">{fmt(c.price_cents, c.currency)}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.is_subscription ? "/ Monat" : ""}
                  </div>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {i18n.language === "en" && c.description_en ? c.description_en : c.description}
              </p>
              <div className="mt-6 flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/courses/$level" params={{ level: c.level }}>{t("courses.details")}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/auth">{t("courses.enroll")}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
