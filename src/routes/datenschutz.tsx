import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [{ title: "Datenschutz — Deutsch Akademie" }, { name: "robots", content: "noindex" }] }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-serif text-4xl">Datenschutzerklärung</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-foreground/85">
          <h2 className="font-serif text-2xl">1. Verantwortlicher</h2>
          <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum genannte Anbieter.</p>

          <h2 className="font-serif text-2xl">2. Erfasste Daten</h2>
          <p>
            Bei der Registrierung erfassen wir deine E-Mail-Adresse und deinen Namen.
            Beim Besuch der Website werden serverseitig Logdaten (IP-Adresse, Datum/Uhrzeit) gespeichert.
          </p>

          <h2 className="font-serif text-2xl">3. Zweck der Verarbeitung</h2>
          <p>
            Die Verarbeitung erfolgt zur Bereitstellung der Lernplattform, zur Authentifizierung,
            zur Abwicklung von Zahlungen sowie zur Kommunikation mit dir.
          </p>

          <h2 className="font-serif text-2xl">4. Rechte der Betroffenen</h2>
          <p>
            Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
            der Verarbeitung sowie auf Datenübertragbarkeit. Wende dich dazu bitte an die im Impressum angegebene Kontaktadresse.
          </p>

          <h2 className="font-serif text-2xl">5. Cookies</h2>
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies zur Aufrechterhaltung der Anmeldesitzung.
          </p>

          <p className="text-sm text-muted-foreground pt-4">
            Hinweis: Diese Datenschutzerklärung ist ein Muster und sollte vor der Veröffentlichung
            durch einen Datenschutzexperten geprüft werden.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
