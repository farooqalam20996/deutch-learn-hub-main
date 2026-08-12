import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learn/$courseId/$lessonId")({
  head: () => ({ meta: [{ title: "Lektion — Deutsch Akademie" }] }),
  component: LessonPlayer,
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Lektion nicht gefunden</div>,
});

function LessonPlayer() {
  const { courseId, lessonId } = Route.useParams();
  const { i18n } = useTranslation();
  const en = i18n.language === "en";
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data: lesson, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .maybeSingle();
      if (error) throw error;
      const { data: u } = await supabase.auth.getUser();
      let isDone = false;
      if (u.user && lesson) {
        const { data: prog } = await supabase
          .from("lesson_progress")
          .select("id")
          .eq("user_id", u.user.id)
          .eq("lesson_id", lesson.id)
          .maybeSingle();
        isDone = !!prog;
      }
      return { lesson, userId: u.user?.id, isDone };
    },
  });

  const toggle = useMutation({
    mutationFn: async () => {
      if (!data?.userId || !data.lesson) return;
      if (data.isDone) {
        const { error } = await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", data.userId)
          .eq("lesson_id", data.lesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("lesson_progress")
          .insert({ user_id: data.userId, lesson_id: data.lesson.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lesson", lessonId] });
      qc.invalidateQueries({ queryKey: ["learn-course", courseId] });
      toast.success(en ? "Progress updated" : "Fortschritt gespeichert");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Lädt …</div>;
  if (!data?.lesson) return <div className="p-10 text-center">Lektion nicht gefunden</div>;
  const l = data.lesson;
  const title = en && l.title_en ? l.title_en : l.title;
  const notes = en && l.notes_en ? l.notes_en : l.notes;

  return (
    <article>
      <h1 className="font-serif text-3xl">{title}</h1>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
        {l.youtube_video_id ? (
          <iframe
            className="h-full w-full"
            src={youtubeEmbedUrl(l.youtube_video_id)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{en ? "No video yet" : "Noch kein Video"}</div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => toggle.mutate()} disabled={toggle.isPending} variant={data.isDone ? "outline" : "default"}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {data.isDone ? (en ? "Completed — undo" : "Erledigt — rückgängig") : en ? "Mark as complete" : "Als erledigt markieren"}
        </Button>
      </div>

      {notes && (
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground">
          {notes}
        </div>
      )}
    </article>
  );
}
