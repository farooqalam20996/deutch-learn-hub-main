CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

GRANT SELECT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage enrollments" ON public.enrollments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.can_access_lesson(_lesson_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    JOIN public.courses c ON c.id = m.course_id
    WHERE l.id = _lesson_id
      AND l.is_published = true
      AND c.is_published = true
      AND (
        l.is_free_preview = true
        OR c.price_cents = 0
        OR EXISTS (
          SELECT 1 FROM public.enrollments e
          WHERE e.user_id = auth.uid() AND e.course_id = c.id
        )
      )
  )
$$;

DROP POLICY IF EXISTS "Anyone can view published lessons of published courses" ON public.lessons;

CREATE POLICY "Accessible lessons are viewable" ON public.lessons
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.can_access_lesson(id)
  );

CREATE OR REPLACE VIEW public.lesson_catalog
WITH (security_invoker = false) AS
  SELECT l.id, l.module_id, l.title, l.title_en, l.sort_order,
         l.duration_minutes, l.is_free_preview, l.is_published
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.courses c ON c.id = m.course_id
  WHERE l.is_published = true AND c.is_published = true;

GRANT SELECT ON public.lesson_catalog TO anon, authenticated;
GRANT ALL ON public.lesson_catalog TO service_role;