-- Bacheca dei lavori: l'ordine va a tutte le aziende partner, la prima che accetta lo prende.
-- Finche' nessuno accetta, i partner vedono solo i dati anonimi del lavoro (titolo, data, zona, lingue, dettagli senza nomi).
-- Nome e contatti del cliente li vede solo l'azienda che ha preso il lavoro. Tabella vuota al momento della migrazione.
DROP TABLE IF EXISTS referrals;
CREATE TABLE referrals (
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
