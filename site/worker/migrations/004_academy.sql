-- HDJ Academy: videolezioni (giorno 1 e 2), progressi, esame scritto online. Accesso degli autisti con link personale.
ALTER TABLE drivers ADD COLUMN academy_access INTEGER NOT NULL DEFAULT 0;
ALTER TABLE drivers ADD COLUMN academy_exam_extra INTEGER NOT NULL DEFAULT 0;   -- tentativi d'esame concessi in piu' (oltre ai 2 inclusi)

CREATE TABLE IF NOT EXISTS academy_keys (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
  driver_id TEXT NOT NULL REFERENCES drivers(id),
  key_hash TEXT NOT NULL UNIQUE,                     -- il link personale contiene la chiave; qui solo l'hash
  status TEXT NOT NULL DEFAULT 'active',             -- active | revoked
  last_used_at TEXT
);
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  day INTEGER NOT NULL,                              -- 1 = standard VVIP, 2 = lingua di servizio
  position INTEGER NOT NULL,
  title_ja TEXT NOT NULL, title_en TEXT, summary_ja TEXT, summary_en TEXT,
  notes_ja TEXT, notes_en TEXT,                      -- scheda di studio sotto il video
  video_key TEXT, video_type TEXT, video_bytes INTEGER, duration_s INTEGER,
  status TEXT NOT NULL DEFAULT 'draft'               -- draft | published
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  driver_id TEXT NOT NULL, lesson_id TEXT NOT NULL,
  max_pos_s REAL NOT NULL DEFAULT 0, watched_pct INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT, updated_at TEXT NOT NULL,
  PRIMARY KEY (driver_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS exam_questions (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  q_ja TEXT NOT NULL, q_en TEXT,
  options_ja TEXT NOT NULL, options_en TEXT,         -- JSON array, stesso ordine nelle due lingue
  correct INTEGER NOT NULL,                          -- indice della risposta giusta
  explain_ja TEXT, explain_en TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS exam_attempts (
  id TEXT PRIMARY KEY, driver_id TEXT NOT NULL,
  started_at TEXT NOT NULL, deadline_at TEXT NOT NULL, submitted_at TEXT,
  question_ids TEXT NOT NULL, answers TEXT,
  score INTEGER, passed INTEGER
);
CREATE INDEX IF NOT EXISTS idx_attempt_driver ON exam_attempts(driver_id, started_at);
