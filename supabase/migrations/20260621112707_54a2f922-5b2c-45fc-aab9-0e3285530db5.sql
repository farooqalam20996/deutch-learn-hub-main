
-- Roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'de',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile + default student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Courses (Phase 2 schema prepped now)
CREATE TYPE public.cefr_level AS ENUM ('A1','A2','B1','B2','C1','C2');

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level cefr_level NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  is_subscription BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- News
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_en TEXT,
  body TEXT NOT NULL,
  body_en TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed 6 CEFR-level courses
INSERT INTO public.courses (level, title, title_en, description, description_en, price_cents) VALUES
  ('A1', 'Deutsch A1 – Anfänger', 'German A1 – Beginner', 'Erste Schritte in der deutschen Sprache. Lerne, dich vorzustellen und einfache Gespräche zu führen.', 'Take your first steps in German. Learn to introduce yourself and hold simple conversations.', 19900),
  ('A2', 'Deutsch A2 – Grundlagen', 'German A2 – Elementary', 'Erweitere deinen Wortschatz und kommuniziere in alltäglichen Situationen.', 'Expand your vocabulary and communicate in everyday situations.', 22900),
  ('B1', 'Deutsch B1 – Mittelstufe', 'German B1 – Intermediate', 'Verstehe Hauptpunkte klarer Standardsprache und drücke dich zu vertrauten Themen aus.', 'Understand main points in clear standard speech and express yourself on familiar topics.', 26900),
  ('B2', 'Deutsch B2 – Gute Mittelstufe', 'German B2 – Upper Intermediate', 'Komplexere Texte verstehen und fließend mit Muttersprachlern sprechen.', 'Understand complex texts and speak fluently with native speakers.', 29900),
  ('C1', 'Deutsch C1 – Fortgeschritten', 'German C1 – Advanced', 'Sprachgebrauch für Beruf und Studium auf hohem Niveau.', 'High-level language use for professional and academic settings.', 34900),
  ('C2', 'Deutsch C2 – Meisterschaft', 'German C2 – Mastery', 'Nahezu muttersprachliches Niveau in Wort und Schrift.', 'Near-native fluency in speech and writing.', 39900);
