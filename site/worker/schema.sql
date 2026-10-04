-- Hire Driver Japan (BRAND_NAME provvisorio) · database D1 "hdj-data"
-- Convenzioni ereditate da DRIVEN: id testuali, timestamp ISO 8601 UTC, nessuna cancellazione fisica.

CREATE TABLE IF NOT EXISTS operators (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  name TEXT NOT NULL, type TEXT NOT NULL, city TEXT, lang TEXT,
  contact_name TEXT, email TEXT, phone TEXT, line_id TEXT, wechat_id TEXT, notes TEXT,
  fee_rate REAL NOT NULL DEFAULT 0.10, billing_name TEXT, billing_email TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id TEXT REFERENCES operators(id),
  full_name TEXT NOT NULL, name_kana TEXT, name_latin TEXT,
  display_mode TEXT NOT NULL DEFAULT 'initials',   -- full | initials
  show_operator INTEGER NOT NULL DEFAULT 0,
  consent_at TEXT,
  email TEXT, phone TEXT,
  nishu_menkyo INTEGER NOT NULL DEFAULT 1,
  languages TEXT,                                   -- JSON array
  employed_by_us INTEGER NOT NULL DEFAULT 0,        -- 1 = nostro dipendente (servizio aziende)
  status TEXT NOT NULL DEFAULT 'active'
);

-- Richieste dal form aziende e dal form operatori
CREATE TABLE IF NOT EXISTS leads_service (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  kind TEXT NOT NULL,                               -- corporate | operator
  site_lang TEXT NOT NULL,
  company TEXT NOT NULL, contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, line_id TEXT, wechat_id TEXT,
  plan TEXT, service_date TEXT, hours INTEGER, languages TEXT, vehicle TEXT, city TEXT,
  operator_type TEXT, fleet INTEGER, interest TEXT,
  message TEXT, consent INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',                -- new | contacted | quoted | confirmed | lost
  quote_jpy INTEGER, lost_reason TEXT, notes TEXT,
  operator_id TEXT REFERENCES operators(id),
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, referrer TEXT, landing TEXT, ip_hash TEXT, turnstile_ok INTEGER
);
CREATE INDEX IF NOT EXISTS idx_ls_stage ON leads_service(kind, stage, created_at);

-- Richieste dalla pagina formazione
CREATE TABLE IF NOT EXISTS leads_training (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  site_lang TEXT NOT NULL,
  company TEXT NOT NULL, operator_type TEXT NOT NULL,
  drivers_count INTEGER, languages TEXT, period TEXT, city TEXT,
  contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, line_id TEXT, wechat_id TEXT,
  message TEXT, consent INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',
  quote_jpy INTEGER, lost_reason TEXT, notes TEXT,
  operator_id TEXT REFERENCES operators(id),
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, referrer TEXT, landing TEXT, ip_hash TEXT, turnstile_ok INTEGER
);
CREATE INDEX IF NOT EXISTS idx_lt_stage ON leads_training(stage, created_at);

-- Candidature autisti
CREATE TABLE IF NOT EXISTS driver_applications (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  site_lang TEXT NOT NULL,
  full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, city TEXT,
  license TEXT NOT NULL, license_years INTEGER, languages TEXT, lang_level TEXT,
  residence_status TEXT NOT NULL, availability TEXT, message TEXT, consent INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',                -- new | interview | documents | hired | rejected
  notes TEXT, driver_id TEXT REFERENCES drivers(id),
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, referrer TEXT, landing TEXT, ip_hash TEXT, turnstile_ok INTEGER
);
CREATE INDEX IF NOT EXISTS idx_da_stage ON driver_applications(stage, created_at);

CREATE TABLE IF NOT EXISTS panel_users (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
  role TEXT NOT NULL,                               -- admin | teacher | operator
  name TEXT NOT NULL, email TEXT,
  token_hash TEXT NOT NULL UNIQUE,
  operator_id TEXT REFERENCES operators(id),
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id TEXT REFERENCES operators(id), lead_id TEXT,
  format TEXT NOT NULL,                             -- full3 | day1 | lang_module | renewal
  language TEXT NOT NULL,                           -- lingua di erogazione: ja | zh
  target_langs TEXT,
  day1_date TEXT, day2_date TEXT, day3_date TEXT,
  venue TEXT, venue_type TEXT,
  teacher_id TEXT REFERENCES panel_users(id),
  seats INTEGER, price_jpy INTEGER,
  status TEXT NOT NULL DEFAULT 'planned'            -- planned | confirmed | running | done | cancelled
);
CREATE INDEX IF NOT EXISTS idx_courses_date ON courses(day1_date);

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  course_id TEXT NOT NULL REFERENCES courses(id),
  driver_id TEXT NOT NULL REFERENCES drivers(id),
  operator_id TEXT REFERENCES operators(id),
  attended_d1 INTEGER, attended_d2 INTEGER, attended_d3 INTEGER,
  score_oral INTEGER, score_practical INTEGER, score_written INTEGER,
  pass_oral INTEGER, pass_practical INTEGER, pass_written INTEGER,
  result TEXT NOT NULL DEFAULT 'pending',           -- pending | pass | fail | retake
  retake_until TEXT,
  graded_by TEXT REFERENCES panel_users(id), graded_at TEXT, notes TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_enroll_unique ON enrollments(course_id, driver_id);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,                              -- 2026-0001
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  driver_id TEXT NOT NULL REFERENCES drivers(id),
  enrollment_id TEXT REFERENCES enrollments(id),
  kind TEXT NOT NULL DEFAULT 'certificate',         -- certificate (esame superato, 2 anni) | attestation (frequenza, senza scadenza)
  level TEXT NOT NULL,                              -- standard | advanced
  languages TEXT NOT NULL,
  issued_at TEXT NOT NULL, expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',            -- active | expired | revoked | superseded
  revoked_at TEXT, revoke_reason TEXT,
  verify_token TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0, last_view_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_cert_exp ON certificates(status, expires_at);

CREATE TABLE IF NOT EXISTS cert_counters ( year INTEGER PRIMARY KEY, last_no INTEGER NOT NULL );

CREATE TABLE IF NOT EXISTS renewals (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE REFERENCES certificates(id),
  course_id TEXT REFERENCES courses(id),
  new_certificate_id TEXT REFERENCES certificates(id),
  reminded_60_at TEXT, reminded_30_at TEXT,
  status TEXT NOT NULL DEFAULT 'due'                -- due | scheduled | done | lapsed
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id TEXT REFERENCES operators(id),         -- NULL finche' il lavoro e' aperto
  lead_id TEXT,
  -- visibile a tutti i partner
  job_title TEXT NOT NULL, service_date TEXT, area TEXT, job_langs TEXT, job_details TEXT,
  -- visibile solo a chi prende il lavoro
  client_name TEXT NOT NULL, client_company TEXT, client_email TEXT, client_phone TEXT, client_lang TEXT, request TEXT,
  consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',               -- open | accepted | contacted | booked | completed | lost | cancelled
  accepted_at TEXT, accepted_by TEXT,                -- utente del pannello che ha accettato
  completed_at TEXT, revenue_jpy INTEGER,
  fee_rate REAL, fee_jpy INTEGER,                    -- fee_rate fotografata al momento dell'accettazione
  statement_id TEXT, operator_note TEXT, admin_note TEXT
);
CREATE INDEX IF NOT EXISTS idx_ref_status ON referrals(status, created_at);
CREATE INDEX IF NOT EXISTS idx_ref_op ON referrals(operator_id, status, completed_at);

CREATE TABLE IF NOT EXISTS statements (
  id TEXT PRIMARY KEY,                               -- HDJ-202610-001
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id TEXT NOT NULL REFERENCES operators(id),
  period TEXT NOT NULL,                              -- YYYY-MM
  items INTEGER NOT NULL, revenue_jpy INTEGER NOT NULL, fee_jpy INTEGER NOT NULL, tax_jpy INTEGER NOT NULL, total_jpy INTEGER NOT NULL,
  issued_at TEXT NOT NULL, due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued',             -- issued | sent | paid | void
  sent_at TEXT, paid_at TEXT, note TEXT
);
-- un solo estratto valido per azienda e mese; quelli annullati non contano
CREATE UNIQUE INDEX IF NOT EXISTS idx_stmt_op_period ON statements(operator_id, period) WHERE status!='void';
