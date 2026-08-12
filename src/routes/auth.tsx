import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Anmelden — Deutsch Akademie" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success(t("auth.signedUp"));
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("auth.loggedIn"));
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error(result.error.message ?? "OAuth error");
      setLoading(false);
      return;
    }
    if (!result.redirected) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <>
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-serif text-3xl">
            {mode === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}
          </h1>

          <Button
            type="button"
            variant="outline"
            className="mt-6 h-11 w-full"
            onClick={onGoogle}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            {t("auth.google")}
          </Button>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs uppercase text-muted-foreground">oder</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "..." : mode === "login" ? t("auth.login") : t("auth.signup")}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-primary"
          >
            {mode === "login" ? t("auth.toggleToSignup") : t("auth.toggleToLogin")}
          </button>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
