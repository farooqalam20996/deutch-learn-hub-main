import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadRole = async (userId: string | undefined) => {
      if (!userId) { setIsAdmin(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
    };
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      loadRole(data.session?.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
      loadRole(session?.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/about", label: t("nav.about") },
    { to: "/news", label: t("nav.news") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  // const switchLang = (lng: "de" | "en") => {
  //   i18n.changeLanguage(lng);
  // };

  const switchLang = async (lng: "de" | "en") => {
  await i18n.changeLanguage(lng);
  localStorage.setItem("i18nextLng", lng);
};

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-lg font-semibold">
            D
          </div>
          <span className="font-serif text-xl font-medium tracking-tight">Deutsch Akademie</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{i18n.language?.slice(0, 2)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLang("de")}>Deutsch</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLang("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {signedIn ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button asChild size="sm">
                <Link to="/dashboard">{t("nav.dashboard")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">{t("nav.signup")}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <div className="flex gap-2 px-1">
              <Button variant="outline" size="sm" onClick={() => switchLang("de")}>DE</Button>
              <Button variant="outline" size="sm" onClick={() => switchLang("en")}>EN</Button>
            </div>
            {signedIn ? (
              <Button asChild size="sm" className="mt-2">
                <Link to="/dashboard" onClick={() => setOpen(false)}>{t("nav.dashboard")}</Link>
              </Button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>{t("nav.login")}</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>{t("nav.signup")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
