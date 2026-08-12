import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/impressum")({
  head: () => ({ meta: [{ title: "Impressum — Deutsch Akademie" }, { name: "robots", content: "noindex" }] }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl">Impressum</h1>
        <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <p><strong>Angaben gemäß § 5 TMG</strong></p>
          <p>
            [Vorname Nachname]<br />
            [Straße Hausnummer]<br />
            [PLZ Stadt]<br />
            Deutschland
          </p>
          <p>
            <strong>Kontakt</strong><br />
            Telefon: [Telefonnummer]<br />
            E-Mail: [kontakt@deutsch-akademie.de]
          </p>
          <p>
            <strong>Umsatzsteuer-ID</strong><br />
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: [DE123456789]
          </p>
          <p>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</strong><br />
            [Vorname Nachname], [Adresse wie oben]
          </p>
          <p className="text-sm text-muted-foreground">
            Hinweis: Bitte ersetze die Platzhalter mit deinen tatsächlichen Angaben.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
