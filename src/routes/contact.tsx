import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — Deutsch Akademie" },
      { name: "description", content: "Kontaktiere die Deutsch Akademie für Fragen zu Kursen und Anmeldung." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success(t("contact.send") + " ✓");
      (e.target as HTMLFormElement).reset();
      setSending(false);
    }, 600);
  };

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl sm:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("contact.body")}</p>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <Label htmlFor="name">{t("contact.name")}</Label>
            <Input id="name" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">{t("contact.email")}</Label>
            <Input id="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="msg">{t("contact.message")}</Label>
            <Textarea id="msg" required rows={5} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} className="h-11 w-full">
            {sending ? "..." : t("contact.send")}
          </Button>
        </form>
      </section>
      <SiteFooter />
    </>
  );
}
