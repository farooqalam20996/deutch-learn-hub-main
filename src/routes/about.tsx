import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Über mich — Deutsch Akademie" },
      { name: "description", content: "Erfahrener Deutschlehrer mit über 15 Jahren Unterrichtserfahrung." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl sm:text-5xl">{t("about.title")}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("about.body")}</p>
      </section>
      <SiteFooter />
    </>
  );
}
