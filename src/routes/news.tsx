import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Aktuelles — Deutsch Akademie" },
      { name: "description", content: "Neuigkeiten und Ankündigungen der Deutsch Akademie." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  component: NewsPage,
});

function NewsPage() {
  const { t, i18n } = useTranslation();
  const { data: items } = useSuspenseQuery(newsQuery);

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl sm:text-5xl">{t("news.title")}</h1>
        {items.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("news.empty")}</p>
        ) : (
          <div className="mt-12 space-y-10">
            {items.map((n) => (
              <article key={n.id} className="border-b border-border pb-8 last:border-0">
                <time className="text-sm text-muted-foreground">
                  {new Date(n.published_at).toLocaleDateString(i18n.language === "de" ? "de-DE" : "en-US")}
                </time>
                <h2 className="mt-2 font-serif text-2xl">
                  {i18n.language === "en" && n.title_en ? n.title_en : n.title}
                </h2>
                <p className="mt-3 leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {i18n.language === "en" && n.body_en ? n.body_en : n.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </>
  );
}
