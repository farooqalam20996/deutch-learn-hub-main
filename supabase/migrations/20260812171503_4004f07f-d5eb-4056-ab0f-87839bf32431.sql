
-- Curriculum seed: 3 modules per course, 4 lessons per module
DO $$
DECLARE
  c RECORD;
  m_id uuid;
  mi int;
  li int;
  mod_titles text[][] := ARRAY[
    ARRAY['Grundlagen & Aussprache','Foundations & Pronunciation','Laute, Betonung und die ersten Sätze.','Sounds, stress and your first sentences.'],
    ARRAY['Grammatik-Werkstatt','Grammar Workshop','Die Strukturen der Sprache klar erklärt.','The structures of the language, clearly explained.'],
    ARRAY['Sprechen & Prüfungstraining','Speaking & Exam Training','Freies Sprechen und gezielte Prüfungsvorbereitung.','Free speaking and focused exam preparation.']
  ];
  les_titles text[][] := ARRAY[
    ARRAY['Einführung und Lernziele','Introduction and learning goals'],
    ARRAY['Wortschatz im Alltag','Everyday vocabulary'],
    ARRAY['Grammatik in der Praxis','Grammar in practice'],
    ARRAY['Übung, Dialog und Wiederholung','Practice, dialogue and review']
  ];
BEGIN
  FOR c IN SELECT id, level FROM public.courses LOOP
    IF EXISTS (SELECT 1 FROM public.modules WHERE course_id = c.id) THEN
      CONTINUE;
    END IF;
    FOR mi IN 1..3 LOOP
      INSERT INTO public.modules (course_id, title, title_en, description, description_en, sort_order)
      VALUES (
        c.id,
        c.level || ' · ' || mod_titles[mi][1],
        c.level || ' · ' || mod_titles[mi][2],
        mod_titles[mi][3],
        mod_titles[mi][4],
        mi
      )
      RETURNING id INTO m_id;

      FOR li IN 1..4 LOOP
        INSERT INTO public.lessons (module_id, title, title_en, notes, notes_en, sort_order, duration_minutes, is_published, is_free_preview)
        VALUES (
          m_id,
          'Lektion ' || mi || '.' || li || ' — ' || les_titles[li][1],
          'Lesson ' || mi || '.' || li || ' — ' || les_titles[li][2],
          'In dieser Lektion arbeiten wir auf Niveau ' || c.level || ' an ' || lower(mod_titles[mi][1]) ||
            '. Du bekommst klare Erklärungen, Beispielsätze und eine kurze Übung zum Mitmachen.',
          'In this lesson we work at level ' || c.level || ' on ' || lower(mod_titles[mi][2]) ||
            '. You get clear explanations, example sentences and a short exercise to follow along.',
          li,
          12 + li * 3,
          true,
          (mi = 1 AND li = 1)
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- News seed
INSERT INTO public.news (slug, title, title_en, body, body_en, is_published, published_at)
SELECT * FROM (VALUES
  ('neue-kursstarts-a1-b2',
   'Neue Kursstarts: A1 bis B2 ab kommendem Monat',
   'New course starts: A1 to B2 from next month',
   E'Ab dem kommenden Monat starten neue Gruppen auf den Niveaus A1, A2, B1 und B2.\n\nJede Gruppe umfasst maximal acht Teilnehmende, damit jede und jeder ausreichend Sprechzeit bekommt. Der Unterricht kombiniert Videolektionen zum eigenständigen Lernen mit wöchentlichen Live-Terminen für Konversation und Feedback.\n\nDie Plätze werden in der Reihenfolge der Anmeldungen vergeben.',
   E'New groups start next month at levels A1, A2, B1 and B2.\n\nEach group holds a maximum of eight participants so that everyone gets enough speaking time. Teaching combines video lessons for independent study with weekly live sessions for conversation and feedback.\n\nSeats are allocated in order of registration.',
   true, now() - interval '2 days'),
  ('telc-pruefungsvorbereitung',
   'Intensive Prüfungsvorbereitung für telc und Goethe',
   'Intensive exam preparation for telc and Goethe',
   E'Für alle, die in diesem Jahr eine Prüfung ablegen möchten, bieten wir ein kompaktes Vorbereitungsmodul an.\n\nInhalte: Prüfungsformate im Detail, Zeitmanagement, Musterlösungen für den schriftlichen Ausdruck sowie simulierte mündliche Prüfungen mit direktem Feedback.\n\nDas Modul ist für die Niveaus B1, B2 und C1 verfügbar.',
   E'For everyone planning to take an exam this year, we offer a compact preparation module.\n\nContents: exam formats in detail, time management, model answers for written expression and simulated oral exams with direct feedback.\n\nThe module is available for levels B1, B2 and C1.',
   true, now() - interval '9 days'),
  ('lerngruppen-konversation',
   'Neue Konversationsgruppen am Abend',
   'New evening conversation groups',
   E'Sprechen lernt man nur durch Sprechen. Deshalb gibt es ab sofort zusätzliche Konversationsgruppen am Abend.\n\nJede Sitzung folgt einem Thema aus dem Alltag oder Berufsleben — vom Arztbesuch bis zum Bewerbungsgespräch. Korrekturen erfolgen behutsam und im Anschluss als schriftliche Zusammenfassung.',
   E'You only learn to speak by speaking. That is why additional evening conversation groups are now available.\n\nEach session follows a topic from everyday or professional life — from a doctor visit to a job interview. Corrections are gentle and are summarised in writing afterwards.',
   true, now() - interval '21 days'),
  ('fachsprache-pflege-it',
   'Fachsprache Deutsch für Pflege, IT und Ingenieurwesen',
   'Professional German for nursing, IT and engineering',
   E'Viele Lernende kommen mit einem klaren beruflichen Ziel nach Deutschland. Für sie gibt es nun spezialisierte Einheiten mit Fachwortschatz, typischen Gesprächssituationen und schriftlicher Dokumentation.\n\nDie Einheiten bauen auf Niveau B1 auf und lassen sich mit jedem laufenden Kurs kombinieren.',
   E'Many learners come to Germany with a clear professional goal. For them there are now specialised units with technical vocabulary, typical conversation situations and written documentation.\n\nThe units build on level B1 and can be combined with any ongoing course.',
   true, now() - interval '34 days')
) AS v(slug, title, title_en, body, body_en, is_published, published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.news n WHERE n.slug = v.slug);
