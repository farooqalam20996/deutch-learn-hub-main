import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookOpen, Users, Settings, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Deutsch Akademie" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
      if (data.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      }
    })();
  }, []);

  const { data: courses } = useQuery({
    queryKey: ["dashboard-courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, level, title, title_en")
        .eq("is_published", true)
        .order("level");
      return data ?? [];
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const en = i18n.language === "en";

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl">{en ? "Welcome back" : "Willkommen zurück"}</h1>
            <p className="mt-1 text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t("nav.logout")}</Button>
        </div>

        <h2 className="mt-12 font-serif text-2xl">{en ? "Continue learning" : "Weiterlernen"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((c) => (
            <Link
              key={c.id}
              to="/learn/$courseId"
              params={{ courseId: c.id }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary"
            >
              <div>
                <div className="inline-flex h-7 items-center rounded-md bg-primary/10 px-2 font-serif text-sm font-semibold text-primary">{c.level}</div>
                <div className="mt-2 font-serif text-base">{en && c.title_en ? c.title_en : c.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card icon={<BookOpen />} title="Alle Kurse" body="Stöbere durch das gesamte Kursangebot." cta="Ansehen" href="/courses" />
          <Card icon={<Users />} title="Meine Gruppe" body="Lerngruppe und Mitschüler — kommt in Phase 3." />
          {isAdmin && (
            <Card icon={<Settings />} title="Admin-Bereich" body="Kurse, Lektionen, Gruppen und Schüler verwalten." cta="Öffnen" href="/admin" />
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

function Card({ icon, title, body, cta, href }: { icon: React.ReactNode; title: string; body: string; cta?: string; href?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-xl">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      {cta && href && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to={href}>{cta}</Link>
        </Button>
      )}
    </div>
  );
}
