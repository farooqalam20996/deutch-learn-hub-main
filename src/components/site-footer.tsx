import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-lg font-semibold">
              D
            </div>
            <span className="font-serif text-xl">Deutsch Akademie</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Deutsch lernen — vom Anfänger bis zur Meisterschaft. A1 bis C2.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-lg">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="text-muted-foreground hover:text-primary">{t("nav.courses")}</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link to="/news" className="text-muted-foreground hover:text-primary">{t("nav.news")}</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-lg">{t("footer.legal")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/impressum" className="text-muted-foreground hover:text-primary">{t("footer.impressum")}</Link></li>
            <li><Link to="/datenschutz" className="text-muted-foreground hover:text-primary">{t("footer.datenschutz")}</Link></li>
            <li><Link to="/agb" className="text-muted-foreground hover:text-primary">{t("footer.agb")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {year} Deutsch Akademie. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
