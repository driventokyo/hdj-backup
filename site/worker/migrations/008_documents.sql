-- Libreria documenti della scuola (pannello docenti e admin): PDF su R2 hdj-academy, prefissi instructor/ e materials/
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  lang TEXT NOT NULL,                                -- en | fr | zh | ja | multi
  category TEXT NOT NULL,                            -- overview | day1 | day2 | day3 | standard | driver | vehicle | manners | confid | itin | check | client | card | full | student | other
  title TEXT NOT NULL, note TEXT,
  r2_key TEXT NOT NULL UNIQUE, bytes INTEGER, content_type TEXT NOT NULL DEFAULT 'application/pdf',
  audience TEXT NOT NULL DEFAULT 'instructor',       -- instructor | student
  uploaded_by TEXT, sort INTEGER NOT NULL DEFAULT 100
);
