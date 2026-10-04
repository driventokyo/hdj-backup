-- Link di pagamento /p/CODE (Stripe Checkout creato a ogni apertura, come driventokyo.com)
CREATE TABLE IF NOT EXISTS payments (
  code TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL, description TEXT,
  base_jpy INTEGER NOT NULL,                        -- importo richiesto, IVA inclusa, senza fee carta
  amount_jpy INTEGER NOT NULL,                      -- importo addebitato (base x 1.05 salvo eccezione)
  fee_applied INTEGER NOT NULL DEFAULT 1,
  email TEXT, ref TEXT,                             -- ref = id della richiesta del sito (LB-/LC-/LO-), se c'e'
  status TEXT NOT NULL DEFAULT 'open',              -- open | paid | void
  opened INTEGER NOT NULL DEFAULT 0, last_session TEXT,
  paid_at TEXT, stripe_payment_intent TEXT, paid_amount_jpy INTEGER, payer_email TEXT,
  note TEXT
);
