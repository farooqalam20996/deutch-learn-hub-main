
-- Grant admin role to the teacher
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'iam.farooqalam@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- MODULES
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_en text,
  description text,
  description_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT SELECT ON public.modules TO anon;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of published courses" ON public.modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.is_published = true OR public.has_role(auth.uid(), 'admin')))
  );
CREATE POLICY "Admins manage modules" ON public.modules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER modules_set_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_modules_course ON public.modules(course_id, sort_order);

-- LESSONS
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_en text,
  youtube_url text,
  youtube_video_id text,
  notes text,
  notes_en text,
  duration_minutes integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_free_preview boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published lessons of published courses" ON public.lessons
  FOR SELECT USING (
    (is_published = true AND EXISTS (
      SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND c.is_published = true
    )) OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins manage lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER lessons_set_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_lessons_module ON public.lessons(module_id, sort_order);

-- LESSON PROGRESS
CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own progress" ON public.lesson_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own progress" ON public.lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.lesson_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete own progress" ON public.lesson_progress
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
