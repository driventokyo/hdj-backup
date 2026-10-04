-- Segnalazioni di clienti alle aziende HIRE partner e estratti conto mensili delle provvigioni.
-- HDJ presenta soltanto: preventivo, contratto e incasso restano tra l'azienda e il cliente.
ALTER TABLE operators ADD COLUMN fee_rate REAL NOT NULL DEFAULT 0.10;   -- provvigione sul fatturato al cliente, IVA esclusa
ALTER TABLE operators ADD COLUMN billing_name TEXT;                      -- intestazione della fattura, es. "株式会社○○"
ALTER TABLE operators ADD COLUMN billing_email TEXT;

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id TEXT NOT NULL REFERENCES operators(id),
  lead_id TEXT,                                      -- richiesta del sito da cui nasce, se c'e'
  client_name TEXT NOT NULL, client_company TEXT, client_email TEXT, client_phone TEXT, client_lang TEXT,
  service_date TEXT, request TEXT,                   -- cosa chiede il cliente, senza prezzi
  consent_at TEXT NOT NULL,                          -- data del consenso del cliente a passare i dati all'azienda
  status TEXT NOT NULL DEFAULT 'sent',               -- sent | contacted | booked | completed | lost
  completed_at TEXT,                                 -- data del servizio concluso (determina il mese dell'estratto)
  revenue_jpy INTEGER,                               -- fatturato dell'azienda al cliente, IVA esclusa, dichiarato dall'azienda
  fee_rate REAL NOT NULL,                            -- fotografia della percentuale al momento della segnalazione
  fee_jpy INTEGER,
  statement_id TEXT,                                 -- una volta in un estratto non si modifica piu'
  operator_note TEXT, admin_note TEXT
);
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
