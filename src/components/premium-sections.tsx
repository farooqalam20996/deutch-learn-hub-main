import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import teacherImg from "@/assets/teacher-portrait.jpg";

const copy = {
  de: {
    statsTitle: "Vertrauen, das man messen kann",
    stats: [
      { v: "15+", l: "Jahre Unterrichtserfahrung" },
      { v: "2.400+", l: "Lernende begleitet" },
      { v: "96 %", l: "Prüfungserfolgsquote" },
      { v: "A1–C2", l: "Vollständiger CEFR-Pfad" },
    ],
    methodEyebrow: "Die Methode",
    methodTitle: "Vier Schritte zu sicherem Deutsch",
    method: [
      { t: "Einstufung", b: "Ein kurzer Einstufungstest bestimmt dein exaktes Niveau — kein verlorenes Semester." },
      { t: "Struktur", b: "Jede Woche: Videolektion, Grammatikwerkstatt, Wortschatzblock und Sprechtraining." },
      { t: "Live-Gruppe", b: "Kleine Lerngruppen (max. 8 Personen) für echte Konversation statt Frontalunterricht." },
      { t: "Prüfungsreife", b: "Gezielte Vorbereitung auf Goethe-, telc- und TestDaF-Prüfungen." },
    ],
    teacherEyebrow: "Dein Lehrer",
    teacherTitle: "Präzision, Geduld und echte Alltagssprache",
    teacherBody:
      "Ich unterrichte Deutsch als Fremdsprache seit über fünfzehn Jahren — an Sprachschulen, in Unternehmen und online. Mein Unterricht verbindet klare Grammatikarchitektur mit lebendiger Sprache, wie sie in Berlin, München oder Wien wirklich gesprochen wird.",
    teacherPoints: [
      "Zertifizierter DaF-Dozent (Goethe-Institut)",
      "Prüfungstrainer für telc B1–C1 und TestDaF",
      "Fachsprache für Pflege, IT und Ingenieurwesen",
    ],
    testimonialsTitle: "Stimmen unserer Lernenden",
    testimonials: [
      { q: "Nach acht Monaten habe ich mein B2-Zertifikat bestanden und arbeite jetzt als Pflegefachkraft in Hamburg.", n: "Priya S.", r: "Pflegefachkraft, Hamburg" },
      { q: "Die Struktur ist unglaublich klar. Zum ersten Mal habe ich deutsche Grammatik wirklich verstanden.", n: "Ahmed K.", r: "Softwareentwickler, Berlin" },
      { q: "Kleine Gruppen, echtes Sprechen, persönliches Feedback. Genau das hat mir überall sonst gefehlt.", n: "Elena M.", r: "Studentin, Wien" },
    ],
    ctaTitle: "Beginne noch heute deinen Weg zu fließendem Deutsch",
    ctaBody: "Wähle dein Niveau, sichere dir deinen Platz und lerne mit einem Lehrplan, der dich wirklich ans Ziel bringt.",
    ctaBtn: "Kurse ansehen",
  },
  en: {
    statsTitle: "Trust you can measure",
    stats: [
      { v: "15+", l: "Years of teaching" },
      { v: "2,400+", l: "Learners guided" },
      { v: "96%", l: "Exam pass rate" },
      { v: "A1–C2", l: "Complete CEFR path" },
    ],
    methodEyebrow: "The method",
    methodTitle: "Four steps to confident German",
    method: [
      { t: "Placement", b: "A short placement test pinpoints your exact level — no wasted semester." },
      { t: "Structure", b: "Every week: video lesson, grammar workshop, vocabulary block and speaking drill." },
      { t: "Live group", b: "Small study groups (max. 8 people) built for real conversation, not lectures." },
      { t: "Exam ready", b: "Focused preparation for Goethe, telc and TestDaF examinations." },
    ],
    teacherEyebrow: "Your teacher",
    teacherTitle: "Precision, patience and real everyday German",
    teacherBody:
      "I have taught German as a foreign language for over fifteen years — in language schools, inside companies and online. My teaching combines a clear grammar architecture with the living language actually spoken in Berlin, Munich and Vienna.",
    teacherPoints: [
      "Certified DaF instructor (Goethe-Institut)",
      "Exam trainer for telc B1–C1 and TestDaF",
      "Professional German for nursing, IT and engineering",
    ],
    testimonialsTitle: "Voices from our learners",
    testimonials: [
      { q: "After eight months I passed my B2 certificate and now work as a nurse in Hamburg.", n: "Priya S.", r: "Nurse, Hamburg" },
      { q: "The structure is incredibly clear. For the first time I truly understood German grammar.", n: "Ahmed K.", r: "Software engineer, Berlin" },
      { q: "Small groups, real speaking, personal feedback. Exactly what I was missing everywhere else.", n: "Elena M.", r: "Student, Vienna" },
    ],
    ctaTitle: "Start your path to fluent German today",
    ctaBody: "Choose your level, secure your seat and learn with a curriculum built to actually get you there.",
    ctaBtn: "Browse courses",
  },
} as const;

function useCopy() {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith("en") ? copy.en : copy.de;
}

export function StatsStrip() {
  const c = useCopy();
  return (
    <section className="border-y border-border/70 bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        {c.stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-serif text-4xl font-semibold text-primary sm:text-5xl">{s.v}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MethodSection() {
  const c = useCopy();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-[var(--gold)]">
          <Sparkles className="h-3.5 w-3.5" /> {c.methodEyebrow}
        </span>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{c.methodTitle}</h2>
      </div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {c.method.map((m, i) => (
          <div key={m.t} className="bg-card p-8">
            <span className="font-serif text-sm tracking-[0.3em] text-[var(--gold)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-serif text-xl">{m.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TeacherSection() {
  const c = useCopy();
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div className="relative">
          <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-[var(--gold)]/40" />
          <img
            src={teacherImg}
            alt="Deutschlehrer in seinem Arbeitszimmer"
            width={1024}
            height={1280}
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-xl ring-1 ring-border"
          />
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--gold)]">
            {c.teacherEyebrow}
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{c.teacherTitle}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{c.teacherBody}</p>
          <ul className="mt-7 space-y-3">
            {c.teacherPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const c = useCopy();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <h2 className="text-center font-serif text-3xl sm:text-4xl">{c.testimonialsTitle}</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {c.testimonials.map((t) => (
          <figure
            key={t.n}
            className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg"
          >
            <Quote className="h-6 w-6 text-[var(--gold)]" />
            <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed">"{t.q}"</blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <div className="text-sm font-medium">{t.n}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ClosingCta() {
  const c = useCopy();
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-24">
        <h2 className="font-serif text-3xl sm:text-4xl">{c.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-primary-foreground/85">{c.ctaBody}</p>
        <Button asChild size="lg" variant="secondary" className="mt-9 h-12 px-8 text-base">
          <Link to="/courses">{c.ctaBtn}</Link>
        </Button>
      </div>
    </section>
  );
}
