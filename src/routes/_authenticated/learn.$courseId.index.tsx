import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/learn/$courseId/")({
  component: () => (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
      Wähle links eine Lektion aus, um zu starten.
    </div>
  ),
});
