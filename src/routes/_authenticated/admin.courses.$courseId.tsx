import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ArrowLeft, Video } from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";

export const Route = createFileRoute("/_authenticated/admin/courses/$courseId")({
  component: AdminCourseEditor,
});

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  title_en: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  notes: string | null;
  notes_en: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_free_preview: boolean;
  is_published: boolean;
};

type ModuleRow = {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  sort_order: number;
};

function AdminCourseEditor() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Course
  const courseQ = useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const modulesQ = useQuery({
    queryKey: ["admin-course-modules", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", courseId)
        .order("sort_order");
      if (error) throw error;
      return data as (ModuleRow & { lessons: Lesson[] })[];
    },
  });

  const refetch = () => {
    qc.invalidateQueries({ queryKey: ["admin-course-modules", courseId] });
    qc.invalidateQueries({ queryKey: ["admin-course", courseId] });
    qc.invalidateQueries({ queryKey: ["admin-courses"] });
  };

  // Course update
  const [editingCourse, setEditingCourse] = useState(false);
  const updateCourse = useMutation({
    mutationFn: async (patch: Partial<{ title: string; title_en: string; description: string; description_en: string; price_cents: number; is_published: boolean }>) => {
      const { error } = await supabase.from("courses").update(patch).eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      setEditingCourse(false);
      toast.success("Kurs aktualisiert");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Module CRUD
  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; mod?: ModuleRow }>({ open: false });
  const saveModule = useMutation({
    mutationFn: async (m: Partial<ModuleRow>) => {
      if (m.id) {
        const { error } = await supabase.from("modules").update(m).eq("id", m.id);
        if (error) throw error;
      } else {
        const next = (modulesQ.data?.length ?? 0) + 1;
        const { error } = await supabase.from("modules").insert({
          course_id: courseId,
          title: m.title!,
          title_en: m.title_en ?? null,
          description: m.description ?? null,
          description_en: m.description_en ?? null,
          sort_order: next,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => { refetch(); setModuleDialog({ open: false }); toast.success("Modul gespeichert"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const [deleteModule, setDeleteModule] = useState<ModuleRow | null>(null);
  const removeModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); setDeleteModule(null); toast.success("Modul gelöscht"); },
    onError: (e: Error) => toast.error(e.message),
  });

  // Lesson CRUD
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; moduleId?: string; lesson?: Lesson }>({ open: false });
  const saveLesson = useMutation({
    mutationFn: async (l: Partial<Lesson> & { module_id?: string }) => {
      const video_id = l.youtube_url ? extractYouTubeId(l.youtube_url) : null;
      if (l.id) {
        const { error } = await supabase.from("lessons").update({
          title: l.title,
          title_en: l.title_en ?? null,
          youtube_url: l.youtube_url ?? null,
          youtube_video_id: video_id,
          notes: l.notes ?? null,
          notes_en: l.notes_en ?? null,
          duration_minutes: l.duration_minutes ?? null,
          is_free_preview: l.is_free_preview ?? false,
          is_published: l.is_published ?? true,
        }).eq("id", l.id);
        if (error) throw error;
      } else {
        const mod = modulesQ.data?.find((m) => m.id === l.module_id);
        const next = (mod?.lessons.length ?? 0) + 1;
        const { error } = await supabase.from("lessons").insert({
          module_id: l.module_id!,
          title: l.title!,
          title_en: l.title_en ?? null,
          youtube_url: l.youtube_url ?? null,
          youtube_video_id: video_id,
          notes: l.notes ?? null,
          notes_en: l.notes_en ?? null,
          duration_minutes: l.duration_minutes ?? null,
          is_free_preview: l.is_free_preview ?? false,
          is_published: l.is_published ?? true,
          sort_order: next,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => { refetch(); setLessonDialog({ open: false }); toast.success("Lektion gespeichert"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);
  const removeLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetch(); setDeleteLesson(null); toast.success("Lektion gelöscht"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (courseQ.isLoading) return <div className="text-muted-foreground">Lädt …</div>;
  if (!courseQ.data) return <div>Kurs nicht gefunden. <Button asChild variant="link"><Link to="/admin/courses">Zurück</Link></Button></div>;

  const c = courseQ.data;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/admin/courses"><ArrowLeft className="mr-1 h-4 w-4" /> Alle Kurse</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex h-8 items-center rounded-md bg-primary/10 px-3 font-serif text-base font-semibold text-primary">{c.level}</span>
          <h1 className="mt-2 font-serif text-3xl">{c.title}</h1>
          {c.description && <p className="mt-2 max-w-2xl text-muted-foreground">{c.description}</p>}
          <p className="mt-2 text-sm text-muted-foreground">
            {(c.price_cents / 100).toLocaleString("de-DE", { style: "currency", currency: c.currency })}
            {c.is_subscription ? " / Monat" : ""} · {c.is_published ? "veröffentlicht" : "Entwurf"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: "/learn/$courseId", params: { courseId } })}>
            Vorschau
          </Button>
          <Button onClick={() => setEditingCourse(true)}><Pencil className="mr-2 h-4 w-4" /> Kursdetails</Button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-serif text-2xl">Module</h2>
        <Button onClick={() => setModuleDialog({ open: true })}><Plus className="mr-2 h-4 w-4" /> Neues Modul</Button>
      </div>

      <div className="mt-4 space-y-4">
        {modulesQ.data?.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            Noch keine Module. Lege das erste Modul an, um Lektionen hinzuzufügen.
          </p>
        )}
        {modulesQ.data?.map((m, mi) => {
          const lessons = [...(m.lessons ?? [])].sort((a, b) => a.sort_order - b.sort_order);
          return (
            <section key={m.id} className="rounded-xl border border-border bg-card p-5">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Modul {mi + 1}</div>
                  <h3 className="mt-0.5 font-serif text-xl">{m.title}</h3>
                  {m.description && <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setLessonDialog({ open: true, moduleId: m.id })}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Lektion
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setModuleDialog({ open: true, mod: m })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteModule(m)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </header>

              {lessons.length > 0 && (
                <ul className="mt-4 divide-y divide-border rounded-md border border-border">
                  {lessons.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <Video className={`h-4 w-4 flex-none ${l.youtube_video_id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{l.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {l.is_published ? "veröffentlicht" : "Entwurf"}
                            {l.is_free_preview ? " · gratis Vorschau" : ""}
                            {l.duration_minutes ? ` · ${l.duration_minutes} min` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-none gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setLessonDialog({ open: true, lesson: l })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteLesson(l)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Course details dialog */}
      <Dialog open={editingCourse} onOpenChange={setEditingCourse}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Kursdetails bearbeiten</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              updateCourse.mutate({
                title: String(f.get("title") || ""),
                title_en: String(f.get("title_en") || ""),
                description: String(f.get("description") || ""),
                description_en: String(f.get("description_en") || ""),
                price_cents: Math.round(Number(f.get("price") || 0) * 100),
                is_published: f.get("is_published") === "on",
              });
            }}
            className="space-y-3"
          >
            <Field label="Titel (DE)" name="title" defaultValue={c.title} required />
            <Field label="Titel (EN)" name="title_en" defaultValue={c.title_en ?? ""} />
            <Field label="Beschreibung (DE)" name="description" defaultValue={c.description ?? ""} textarea />
            <Field label="Beschreibung (EN)" name="description_en" defaultValue={c.description_en ?? ""} textarea />
            <Field label={`Preis (${c.currency})`} name="price" defaultValue={String(c.price_cents / 100)} type="number" step="0.01" />
            <label className="flex items-center gap-3 pt-1">
              <input type="checkbox" name="is_published" defaultChecked={c.is_published} className="h-4 w-4" />
              <span className="text-sm">Veröffentlicht</span>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingCourse(false)}>Abbrechen</Button>
              <Button type="submit" disabled={updateCourse.isPending}>Speichern</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Module dialog */}
      <Dialog open={moduleDialog.open} onOpenChange={(o) => setModuleDialog({ open: o, mod: o ? moduleDialog.mod : undefined })}>
        <DialogContent>
          <DialogHeader><DialogTitle>{moduleDialog.mod ? "Modul bearbeiten" : "Neues Modul"}</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              saveModule.mutate({
                id: moduleDialog.mod?.id,
                title: String(f.get("title") || ""),
                title_en: String(f.get("title_en") || ""),
                description: String(f.get("description") || ""),
                description_en: String(f.get("description_en") || ""),
              });
            }}
            className="space-y-3"
          >
            <Field label="Titel (DE)" name="title" defaultValue={moduleDialog.mod?.title ?? ""} required />
            <Field label="Titel (EN)" name="title_en" defaultValue={moduleDialog.mod?.title_en ?? ""} />
            <Field label="Beschreibung (DE)" name="description" defaultValue={moduleDialog.mod?.description ?? ""} textarea />
            <Field label="Beschreibung (EN)" name="description_en" defaultValue={moduleDialog.mod?.description_en ?? ""} textarea />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModuleDialog({ open: false })}>Abbrechen</Button>
              <Button type="submit" disabled={saveModule.isPending}>Speichern</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lesson dialog */}
      <Dialog open={lessonDialog.open} onOpenChange={(o) => setLessonDialog({ open: o })}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{lessonDialog.lesson ? "Lektion bearbeiten" : "Neue Lektion"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const dur = Number(f.get("duration_minutes") || 0);
              saveLesson.mutate({
                id: lessonDialog.lesson?.id,
                module_id: lessonDialog.lesson?.module_id ?? lessonDialog.moduleId,
                title: String(f.get("title") || ""),
                title_en: String(f.get("title_en") || ""),
                youtube_url: String(f.get("youtube_url") || ""),
                notes: String(f.get("notes") || ""),
                notes_en: String(f.get("notes_en") || ""),
                duration_minutes: dur > 0 ? dur : null,
                is_free_preview: f.get("is_free_preview") === "on",
                is_published: f.get("is_published") === "on",
              });
            }}
            className="max-h-[70vh] space-y-3 overflow-y-auto pr-1"
          >
            <Field label="Titel (DE)" name="title" defaultValue={lessonDialog.lesson?.title ?? ""} required />
            <Field label="Titel (EN)" name="title_en" defaultValue={lessonDialog.lesson?.title_en ?? ""} />
            <Field label="YouTube URL oder Video-ID" name="youtube_url" defaultValue={lessonDialog.lesson?.youtube_url ?? ""} placeholder="https://youtube.com/watch?v=…" />
            <Field label="Dauer (Minuten)" name="duration_minutes" type="number" defaultValue={String(lessonDialog.lesson?.duration_minutes ?? "")} />
            <Field label="Notizen (DE)" name="notes" defaultValue={lessonDialog.lesson?.notes ?? ""} textarea rows={5} />
            <Field label="Notizen (EN)" name="notes_en" defaultValue={lessonDialog.lesson?.notes_en ?? ""} textarea rows={5} />
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_published" defaultChecked={lessonDialog.lesson?.is_published ?? true} className="h-4 w-4" />
                <span className="text-sm">Veröffentlicht</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_free_preview" defaultChecked={lessonDialog.lesson?.is_free_preview ?? false} className="h-4 w-4" />
                <span className="text-sm">Gratis-Vorschau</span>
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLessonDialog({ open: false })}>Abbrechen</Button>
              <Button type="submit" disabled={saveLesson.isPending}>Speichern</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deletes */}
      <AlertDialog open={!!deleteModule} onOpenChange={(o) => !o && setDeleteModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modul löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dadurch werden auch alle zugehörigen Lektionen gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteModule && removeModule.mutate(deleteModule.id)}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteLesson} onOpenChange={(o) => !o && setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lektion löschen?</AlertDialogTitle>
            <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteLesson && removeLesson.mutate(deleteLesson.id)}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
  rows,
  required,
  type,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  type?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      {textarea ? (
        <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows ?? 3} className="mt-1.5" />
      ) : (
        <Input id={name} name={name} defaultValue={defaultValue} required={required} type={type} step={step} placeholder={placeholder} className="mt-1.5" />
      )}
    </div>
  );
}
