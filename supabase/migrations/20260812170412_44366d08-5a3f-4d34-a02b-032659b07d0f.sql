DROP VIEW IF EXISTS public.lesson_catalog;

CREATE OR REPLACE FUNCTION public.lesson_catalog(_course_id uuid)
RETURNS TABLE (
  id uuid,
  module_id uuid,
  title text,
  title_en text,
  sort_order integer,
  duration_minutes integer,
  is_free_preview boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, l.module_id, l.title, l.title_en, l.sort_order,
         l.duration_minutes, l.is_free_preview
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.courses c ON c.id = m.course_id
  WHERE m.course_id = _course_id
    AND l.is_published = true
    AND c.is_published = true
  ORDER BY l.sort_order
$$;

REVOKE ALL ON FUNCTION public.lesson_catalog(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lesson_catalog(uuid) TO anon, authenticated, service_role;