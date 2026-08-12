import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Video, Users, MessageCircle, Award, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import heroImg from "@/assets/hero-library.jpg";
import {
  StatsStrip,
  MethodSection,
  TeacherSection,
  TestimonialsSection,
  ClosingCta,
} from "@/components/premium-sections";

const coursesQuery = queryOptions({
  queryKey: ["courses-home"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, level, title, title_en, price_cents, currency")
      .eq("is_published", true)
      .order("level");
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deutsch Akademie — Deutsch lernen online (A1–C2)" },
      { name: "description", content: "Strukturierte Online-Deutschkurse von A1 bis C2 mit erfahrenem Muttersprachler. Videolektionen, Lerngruppen, persönliche Betreuung." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Home,
});

function formatPrice(cents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function Home() {
  const { t, i18n } = useTranslation();
  const { data: courses } = useSuspenseQuery(coursesQuery);

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [background:radial-gradient(60rem_40rem_at_80%_-10%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_70%),radial-gradient(50rem_35rem_at_0%_10%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 md:gap-16 lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              {t("home.eyebrow")}
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:text-[4rem]">
              {t("home.title")}
            </h1>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-[var(--gold)] to-transparent" />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {t("home.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link to="/courses">{t("home.ctaCourses")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <Link to="/auth">{t("home.ctaSignup")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-primary/10 blur-2xl" />
            <img
              src={heroImg}
              alt="German library reading room"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-2xl ring-1 ring-border"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl sm:text-4xl">{t("home.levelsTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.levelsSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link
                key={c.id}
                to="/courses/$level"
                params={{ level: c.level }}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-semibold text-primary">{c.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("courses.from")} {formatPrice(c.price_cents, c.currency, i18n.language)}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl">
                  {i18n.language === "en" && c.title_en ? c.title_en : c.title}
                </h3>
                <span className="mt-6 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {t("courses.details")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="text-center font-serif text-3xl sm:text-4xl">{t("home.featuresTitle")}</h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Video, t: t("home.f1Title"), b: t("home.f1Body") },
            { Icon: Users, t: t("home.f2Title"), b: t("home.f2Body") },
            { Icon: MessageCircle, t: t("home.f3Title"), b: t("home.f3Body") },
            { Icon: Award, t: t("home.f4Title"), b: t("home.f4Body") },
          ].map((f) => (
            <div key={f.t} className="flex flex-col items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-[var(--gold)]/30">
                <f.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-xl">{f.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.b}</p>
            </div>
          ))}
        </div>
      </section>

      <MethodSection />
      <TeacherSection />
      <TestimonialsSection />
      <ClosingCta />

      <SiteFooter />
    </>
  );
}
