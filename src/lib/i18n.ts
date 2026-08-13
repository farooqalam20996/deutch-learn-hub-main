import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  de: {
    translation: {
      nav: {
        home: "Startseite",
        courses: "Kurse",
        about: "Über mich",
        news: "Aktuelles",
        contact: "Kontakt",
        login: "Anmelden",
        signup: "Registrieren",
        dashboard: "Dashboard",
        logout: "Abmelden",
      },
      home: {
        eyebrow: "Deutsch lernen mit System",
        title: "Deine Reise zur deutschen Sprache",
        subtitle:
          "Strukturierte Online-Kurse von A1 bis C2, geleitet von einem erfahrenen Muttersprachler. Lerne im eigenen Tempo, in deiner Gruppe, mit zertifizierten Materialien.",
        ctaCourses: "Kurse ansehen",
        ctaSignup: "Kostenlos registrieren",
        levelsTitle: "Alle Niveaustufen — vom Anfänger bis zur Meisterschaft",
        levelsSubtitle: "Folge dem europäischen Referenzrahmen (CEFR).",
        featuresTitle: "Warum mit uns lernen?",
        f1Title: "Videotutorials",
        f1Body: "Hochwertige Videolektionen, jederzeit abrufbar.",
        f2Title: "Lerngruppen",
        f2Body: "Lerne mit Gleichgesinnten in deiner Niveaugruppe.",
        f3Title: "Persönliche Betreuung",
        f3Body: "Direkter Kontakt zum Lehrer für Fragen und Feedback.",
        f4Title: "Zertifikat",
        f4Body: "Erhalte ein Teilnahmezertifikat nach jedem Kurs.",
        teacherTitle: "Dein Lehrer",
        teacherBody:
          "Mit über 15 Jahren Erfahrung im Sprachunterricht begleite ich dich Schritt für Schritt zu fließendem Deutsch.",
      },
      courses: {
        title: "Unsere Deutschkurse",
        subtitle: "Vom ersten Wort bis zur Meisterschaft — finde deinen Kurs.",
        enroll: "Jetzt einschreiben",
        details: "Mehr erfahren",
        from: "ab",
      },
      about: {
        title: "Über mich",
        body:
          "Willkommen! Ich unterrichte seit vielen Jahren Deutsch als Fremdsprache. Meine Mission ist es, die deutsche Sprache verständlich, lebendig und alltagsnah zu vermitteln.",
      },
      news: {
        title: "Aktuelles",
        empty: "Bald gibt es hier Neuigkeiten.",
      },
      contact: {
        title: "Kontakt",
        body: "Hast du Fragen? Schreib mir gerne eine Nachricht.",
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        send: "Senden",
      },
      auth: {
        loginTitle: "Willkommen zurück",
        signupTitle: "Konto erstellen",
        email: "E-Mail",
        password: "Passwort",
        fullName: "Vollständiger Name",
        login: "Anmelden",
        signup: "Registrieren",
        google: "Mit Google anmelden",
        toggleToSignup: "Noch kein Konto? Registrieren",
        toggleToLogin: "Bereits ein Konto? Anmelden",
        loggedIn: "Erfolgreich angemeldet",
        signedUp: "Konto erstellt — bitte E-Mail bestätigen",
      },
      footer: {
        rights: "Alle Rechte vorbehalten.",
        legal: "Rechtliches",
        impressum: "Impressum",
        datenschutz: "Datenschutz",
        agb: "AGB",
        explore: "Entdecken",
      },
      common: {
        loading: "Lädt …",
        error: "Etwas ist schiefgelaufen.",
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        courses: "Courses",
        about: "About",
        news: "News",
        contact: "Contact",
        login: "Log in",
        signup: "Sign up",
        dashboard: "Dashboard",
        logout: "Log out",
      },
      home: {
        eyebrow: "Learn German systematically",
        title: "Your journey to the German language",
        subtitle:
          "Structured online courses from A1 to C2, taught by an experienced native speaker. Learn at your own pace, in your group, with certified materials.",
        ctaCourses: "Browse courses",
        ctaSignup: "Sign up free",
        levelsTitle: "Every level — from beginner to mastery",
        levelsSubtitle: "Following the Common European Framework (CEFR).",
        featuresTitle: "Why learn with us?",
        f1Title: "Video tutorials",
        f1Body: "High-quality video lessons, available anytime.",
        f2Title: "Study groups",
        f2Body: "Learn together with peers at your level.",
        f3Title: "Personal guidance",
        f3Body: "Direct teacher contact for questions and feedback.",
        f4Title: "Certificate",
        f4Body: "Receive a participation certificate for each course.",
        teacherTitle: "Your teacher",
        teacherBody:
          "With over 15 years of language teaching experience, I'll guide you step by step to fluent German.",
      },
      courses: {
        title: "Our German Courses",
        subtitle: "From your first word to mastery — find your course.",
        enroll: "Enroll now",
        details: "Learn more",
        from: "from",
      },
      about: {
        title: "About me",
        body:
          "Welcome! I've been teaching German as a foreign language for many years. My mission is to make German understandable, lively, and practical.",
      },
      news: {
        title: "News",
        empty: "News will appear here soon.",
      },
      contact: {
        title: "Contact",
        body: "Have questions? Send me a message.",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send",
      },
      auth: {
        loginTitle: "Welcome back",
        signupTitle: "Create account",
        email: "Email",
        password: "Password",
        fullName: "Full name",
        login: "Log in",
        signup: "Sign up",
        google: "Continue with Google",
        toggleToSignup: "No account yet? Sign up",
        toggleToLogin: "Already have an account? Log in",
        loggedIn: "Logged in successfully",
        signedUp: "Account created — please confirm your email",
      },
      footer: {
        rights: "All rights reserved.",
        legal: "Legal",
        impressum: "Imprint",
        datenschutz: "Privacy",
        agb: "Terms",
        explore: "Explore",
      },
      common: {
        loading: "Loading …",
        error: "Something went wrong.",
      },
    },
  },
};

if (!i18n.isInitialized) {
  const isBrowser = typeof window !== "undefined";
  const chain = isBrowser ? i18n.use(LanguageDetector).use(initReactI18next) : i18n.use(initReactI18next);
  chain.init({
    resources,
    fallbackLng: "de",
    // lng: isBrowser ? undefined : "de",
    supportedLngs: ["de", "en"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });
}

export default i18n;


// New code ----->>>>> 13th of August
// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     fallbackLng: "de",
//     supportedLngs: ["de", "en"],

//     interpolation: {
//       escapeValue: false,
//     },

//     react: {
//       useSuspense: false,
//     },

//     detection: {
//       order: ["localStorage", "navigator"],
//       caches: ["localStorage"],
//     },
//   });

// export default i18n;
