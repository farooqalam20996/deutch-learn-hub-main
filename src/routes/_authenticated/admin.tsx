import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { BookOpen, LayoutDashboard } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Deutsch Akademie" }] }),
  // Authorization is decided on the server with the caller's verified token.
  beforeLoad: async () => {
    let isAdmin = false;
    try {
      isAdmin = await checkIsAdmin();
    } catch {
      isAdmin = false;
    }
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="px-2 font-serif text-lg">Admin</h2>
          <nav className="mt-3 flex flex-col">
            <AdminLink to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Übersicht" exact />
            <AdminLink to="/admin/courses" icon={<BookOpen className="h-4 w-4" />} label="Kurse & Lektionen" />
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function AdminLink({ to, icon, label, exact }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground/75 hover:bg-accent"
      activeProps={{ className: "bg-primary/10 text-primary" }}
      activeOptions={{ exact }}
    >
      {icon} {label}
    </Link>
  );
}
