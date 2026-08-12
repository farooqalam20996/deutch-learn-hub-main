import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/agb")({
  head: () => ({ meta: [{ title: "AGB — Deutsch Akademie" }, { name: "robots", content: "noindex" }] }),
  component: AGBPage,
});

function AGBPage() {
  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl">Allgemeine Geschäftsbedingungen</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-foreground/85">
          <h2 className="font-serif text-2xl">§ 1 Geltungsbereich</h2>
          <p>Diese AGB gelten für alle Verträge zwischen der Deutsch Akademie und ihren Kunden über die Nutzung der Online-Lernplattform.</p>

          <h2 className="font-serif text-2xl">§ 2 Vertragsschluss</h2>
          <p>Der Vertrag kommt mit der Bestätigung der Buchung durch die Deutsch Akademie zustande.</p>

          <h2 className="font-serif text-2xl">§ 3 Preise und Zahlung</h2>
          <p>Es gelten die zum Zeitpunkt der Buchung angegebenen Preise. Alle Preise verstehen sich inkl. der gesetzlichen Mehrwertsteuer.</p>

          <h2 className="font-serif text-2xl">§ 4 Widerrufsrecht</h2>
          <p>Verbraucher haben ein gesetzliches Widerrufsrecht von 14 Tagen. Hinweise zur Ausübung erhältst du nach Vertragsschluss.</p>

          <h2 className="font-serif text-2xl">§ 5 Nutzungsrechte</h2>
          <p>Die zugänglich gemachten Lerninhalte dürfen ausschließlich zum persönlichen Lerngebrauch verwendet werden.</p>

          <p className="text-sm text-muted-foreground pt-4">
            Hinweis: Dies ist ein Muster. Lasse die AGB vor Veröffentlichung von einem Juristen prüfen.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
