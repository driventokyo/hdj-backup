# Branca formazione: wireframe della pagina e schema dati (passo 1, da approvare)

Data: 4 ottobre 2026. Sito: hiredriverjapan.com (provvisorio). Variabili: BRAND_NAME, CERT_NAME, CONTACT_EMAIL, TEACHER_NAME. Nessun nome fisso nei testi.

## 0. Rischi e punti da decidere prima di costruire

1. Ordine di lancio e licenza di collocamento. La home principale del sito vende il collocamento di autisti, che senza la kyoka (許可) di yuuryou shokugyou shoukai (有料職業紹介) non si puo' pubblicizzare a pagamento (shokugyou anteihou, 職業安定法). La pagina formazione invece non ha requisiti di licenza. Proposta: lanciare il sito con la pagina formazione e una home che raccoglie interesse di operatori e autisti senza promettere intermediazione a pagamento, e attivare la vendita del collocamento quando arriva la kyoka. Lo stesso dominio puo' ospitare le due branche, ma i testi della home vanno scritti in quest'ordine.
2. Parole per la certificazione. Userei shuuryou ninshou (修了認証) per il badge e "minkan shikaku (民間資格) rilasciato da 6 Ltd" in chiaro. Evito nintei (認定), kounin (公認), kokka shikaku (国家資格) e qualunque formula che richiami un ente pubblico, anche nel cinese (niente 国家认证, 官方认证; uso 企业认证, 私营机构认证) e nell'inglese (niente "accredited", "official", "licensed by"; uso "private certification issued by 6 Ltd").
3. Contributo pubblico jinzai kaihatsu shien joseikin (人材開発支援助成金). Il piano di formazione va depositato dall'operatore prima dell'inizio del corso, con un mese di anticipo, e il corso deve avere almeno 10 ore di formazione fuori produzione. Il nostro corso di 3 giorni rientra, ma il ciclo di vendita deve prevedere almeno 6 settimane fra firma e prima giornata. Lo scrivo nella pagina come "verifichiamo con il vostro sharoushi (社労士)", senza percentuali, come chiesto.
4. Prezzi e imposta sui consumi. In Giappone i prezzi mostrati devono dichiarare se sono zeinuki (税別) o zeikomi (税込): propongo "da 600.000 yen, zeinuki" su tutta la pagina.
5. Giorno 3 in vettura. Gli autisti guidano i mezzi dell'operatore con il docente come passeggero nel ruolo del cliente: in contratto va scritto che il mezzo e' usato fuori servizio, con assicurazione dell'operatore, e che il docente non guida mai il mezzo con targa verde. La guida evasiva su pista con partner esterno resta un rimando senza nome del partner finche' non c'e' un accordo firmato.
6. Pagina di verifica e dati personali. Mostra dati di una persona fisica: serve il consenso scritto dell'autista al momento dell'esame, con scelta fra nome completo e iniziali e con autorizzazione separata per mostrare l'operatore di appartenenza. Quando l'autista cambia operatore, il campo va azzerato dal pannello. Da prevedere la revoca e la durata di conservazione dei dati.
7. Infrastruttura separata da DRIVEN. Nuovo progetto Pages, nuovo Worker, nuovo database D1 e nuovo dominio email, copiando il codice del pannello DRIVEN. DRIVEN e' il front di un altro operatore e qui l'emittente e' 6 Ltd: tenere separati database e credenziali evita commistioni legali e contabili.
8. Tokyo Taxi Center. Il centro eroga le formazioni obbligatorie per i nuovi autisti di Tokyo e corsi di accoglienza per clienti stranieri. La FAQ deve posizionare il nostro corso come complementare, mai come sostitutivo o equivalente, e senza commenti sulla qualita' dei loro corsi.
9. Keyword della formazione. Nei dati SEO raccolti oggi (circa 2.500 keyword uniche in tre lingue) nessuna frase con kenshuu (研修), 培训 o "training" legata ad autisti VIP compare nei suggerimenti dei motori. La pagina formazione non portera' traffico organico proprio nel breve periodo: i clienti arriveranno dalle pagine operatori del sito, dall'outreach e dal passaparola. Le keyword del brief restano come provvisorie nei title.
10. Profilo del docente. I dati biografici (20 anni, 5 lingue, nishu menkyo, servizio VIP a Tokyo) entrano come placeholder [DA CONFERMARE] finche' non me li confermi per iscritto, perche' diventano una dichiarazione commerciale.
11. Capienza del gruppo. Con un solo docente, il giorno 3 in vettura regge 6 autisti, al massimo 8 con scenari in coppia. Lo scrivo nella FAQ come "minimo 4, massimo 8".
12. Anti spam del form. Turnstile di Cloudflare sul form, come sul resto dello stack, piu' honeypot.

## 1. Wireframe testuale della pagina /{lang}/training

Layout a colonna singola, larghezza massima 1100 px, mobile first. Font di sistema. Immagini WebP con dimensioni dichiarate. Nessun carosello, nessuna animazione.

Barra superiore: logo BRAND_NAME (testo per ora), menu: Formazione, Verifica certificato, Contatti, selettore lingua (日本語, 中文, English) con link hreflang alle tre URL.

Blocco 1. Hero
- H1: CERT_NAME
- Sottotitolo: corso aziendale per autisti che servono clienti VVIP stranieri. 3 giorni, esame, certificazione con badge verificabile.
- Riga docente: "Docente: TEACHER_NAME, [20 anni fra Europa, Nord America e Giappone, 5 lingue, nishu menkyo, servizio VIP a Tokyo: DA CONFERMARE]"
- CTA primaria: "Richiedi il programma e il preventivo" (ancora al form). CTA secondaria: "Verifica un certificato".
- Immagine: placeholder 1200x800, autista in uniforme che apre la porta, nessun volto riconoscibile.

Blocco 2. Il problema
- Titolo: le corse premium si perdono prima di partire.
- Tre paragrafi brevi: hotel e agenzie estere chiedono un autista che parli inglese e sappia stare davanti a un cliente VVIP; l'operatore ha le auto e la licenza ma non quell'autista; la corsa va a un concorrente o a una piattaforma estera. Nessun numero. Spazio opzionale per un dato con [DATO DA VERIFICARE].

Blocco 3. Il corso in 3 giorni
- Tre card affiancate su desktop, in colonna su mobile. Ogni card: numero del giorno, titolo, lista puntata degli argomenti, durata (7 ore), lingua di erogazione.
- Card giorno 1, standard VVIP: profilo del cliente occidentale e mediorientale; protocollo (accoglienza, porte, posti, bagagli, quando parlare); riservatezza e NDA; foto e social; rapporto con assistenti, bodyguard e family office; vettura e uniforme a livello hotel 5 stelle; kit di bordo; gestione degli imprevisti. Erogato in giapponese o cinese.
- Card giorno 2, lingua di servizio: le 60 frasi che coprono il 90 per cento delle situazioni; pronuncia; role play registrati (aeroporto, hotel, ristorante, shopping, emergenza); uso corretto delle app di traduzione; messaggi scritti di conferma, ritardo e scuse. Riga finale: moduli opzionali italiano, francese, spagnolo.
- Card giorno 3, pratica in vettura: scenari reali con il docente nel ruolo del cliente; coordinamento con la security; itinerari alternativi; soste discrete; basi di guida difensiva. Nota in piccolo: guida evasiva su pista disponibile come livello avanzato con partner esterno.

Blocco 4. Esame e certificazione
- Tre colonne: prova orale in lingua; scenario pratico valutato; test scritto sul protocollo.
- Paragrafo badge: badge digitale con QR verso la pagina pubblica dell'autista, validita' 2 anni, rinnovo con una giornata di aggiornamento.
- Riquadro evidenziato: "CERT_NAME e' una certificazione privata rilasciata da 6 Ltd (minkan shikaku). Non e' una qualifica statale e non sostituisce le formazioni obbligatorie di legge."
- Immagine: mockup del badge con numero 2026-0001 e QR.

Blocco 5. Formati e prezzi (zeinuki)
- Tabella a 4 righe: Pacchetto operatore 6 autisti 3 giorni, da 600.000 yen, autista aggiuntivo 100.000; Giorno 1 singolo, da 150.000 yen per operatore; Modulo seconda lingua, da 40.000 yen per autista; Rinnovo biennale, da 20.000 yen per autista.
- Riga sotto: trasferta fuori Tokyo a parte. Riga contributi: "La formazione del personale puo' rientrare nel jinzai kaihatsu shien joseikin. Lo verifichiamo insieme al vostro sharoushi; il piano va depositato prima dell'inizio del corso."

Blocco 6. Per chi
- Quattro chip: operatori hire, operatori taxi, societa' di yakuin sougei (役員送迎), hotel con flotta propria e DMC.
- Tre esempi d'uso in card: delegazione aziendale di 3 giorni con 4 vetture; evento sportivo o fiera con turni e punti di raccolta; charter di una settimana per una famiglia straniera con bambini e staff.

Blocco 7. Chi insegna
- Foto placeholder 600x600, nome TEACHER_NAME, 5 righe di profilo con placeholder, lingue in chip. Nessun riferimento a DRIVEN Tokyo.

Blocco 8. FAQ (8 domande, accordion accessibile, markup FAQPage una sola volta per pagina)
1. In cosa differisce dai corsi del Tokyo Taxi Center. 2. Chi puo' partecipare (nishu menkyo richiesta; eccezione per neoassunti in formazione che la stanno ottenendo, con esame rinviato al rilascio). 3. In quali lingue si tiene il corso. 4. Dove si tiene (sede dell'operatore o sala a Tokyo). 5. Dimensione del gruppo (minimo 4, massimo 8). 6. Cosa succede se un autista non passa l'esame (una ripetizione gratuita della prova entro 60 giorni, poi a listino). 7. Come un hotel verifica un badge. 8. Se il corso e' finanziabile.

Blocco 9. Form di richiesta
- Campi: ragione sociale*, tipo di operatore* (hire, taxi, yakuin sougei, hotel, altro), numero di autisti da formare*, lingue richieste (checkbox: inglese, cinese, italiano, francese, spagnolo, altro), periodo desiderato, citta'*, referente*, email*, telefono, LINE ID, WeChat ID, messaggio, consenso privacy* (testo da fornire), Turnstile.
- Dopo l'invio: messaggio di conferma nella lingua della pagina ed email automatica al referente con copia a CONTACT_EMAIL.

Blocco 10. Verifica un certificato
- Campo "numero del badge" (formato AAAA-NNNN) con pulsante Verifica, piu' pulsante "Scansiona il QR" che apre la fotocamera su mobile. Entrambi portano a /verify/{id}.
- Pagina /verify/{id}: stato (attivo, scaduto, revocato) in evidenza, nome o iniziali, lingue certificate, livello, data di emissione e di scadenza, operatore di appartenenza se autorizzato, numero badge, emittente 6 Ltd con la riga "certificazione privata". Nessun altro dato. Indicizzazione vietata (noindex).

Piede: 6 Ltd, indirizzo, email, link privacy, link alle altre lingue.

URL e SEO: /ja/training, /zh/training, /en/training, hreflang reciproco piu' x-default su /en/training. Title e meta distinti per lingua (testi al passo 2). Schema.org: Organization (6 Ltd) e Course (CERT_NAME, provider 6 Ltd, hasCourseInstance con modalita' onsite). Open Graph per lingua con immagine 1200x630 dedicata. Sitemap con le tre URL e la pagina verifica generica, non le /verify/{id}.

## 2. Schema dati (D1, database nuovo: hdj-data)

Convenzioni ereditate da DRIVEN: id testuali, timestamp ISO 8601 in UTC, stati come stringhe, nessuna cancellazione fisica (campo status o deleted_at).

```sql
-- Clienti (operatori) e autisti: le due anagrafiche a cui tutto si aggancia
CREATE TABLE operators (
  id            TEXT PRIMARY KEY,          -- OP-XXXXXX
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  name          TEXT NOT NULL,             -- ragione sociale
  type          TEXT NOT NULL,             -- hire | taxi | yakuin_sougei | hotel | dmc | other
  city          TEXT, lang TEXT,           -- lingua di contatto: ja | zh | en
  contact_name  TEXT, email TEXT, phone TEXT, line_id TEXT, wechat_id TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'active'
);
CREATE TABLE drivers (
  id            TEXT PRIMARY KEY,          -- DRV-XXXXXX
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id   TEXT REFERENCES operators(id),
  full_name     TEXT NOT NULL, name_kana TEXT, name_latin TEXT,
  display_mode  TEXT NOT NULL DEFAULT 'initials',  -- full | initials  (scelta dell'autista per /verify)
  show_operator INTEGER NOT NULL DEFAULT 0,        -- consenso a mostrare l'operatore
  consent_at    TEXT,                               -- data del consenso scritto
  email TEXT, phone TEXT,
  nishu_menkyo  INTEGER NOT NULL DEFAULT 1,         -- 0 = neoassunto in formazione
  languages     TEXT,                               -- JSON: ["en","zh"]
  status        TEXT NOT NULL DEFAULT 'active'
);

-- Richieste dalla pagina (form del blocco 9)
CREATE TABLE leads_training (
  id            TEXT PRIMARY KEY,          -- LT-XXXXXX
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  site_lang     TEXT NOT NULL,             -- ja | zh | en
  company       TEXT NOT NULL, operator_type TEXT NOT NULL,
  drivers_count INTEGER, languages TEXT,   -- JSON
  period        TEXT, city TEXT,
  contact_name  TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, line_id TEXT, wechat_id TEXT,
  message       TEXT,
  consent       INTEGER NOT NULL DEFAULT 0,
  stage         TEXT NOT NULL DEFAULT 'new',   -- new | contacted | quoted | confirmed | lost
  quote_jpy     INTEGER, lost_reason TEXT,
  operator_id   TEXT REFERENCES operators(id),  -- valorizzato quando il lead diventa cliente
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, referrer TEXT, landing TEXT,
  ip_hash TEXT, turnstile_ok INTEGER
);
CREATE INDEX idx_leads_stage ON leads_training(stage, created_at);

-- Sessioni di corso
CREATE TABLE courses (
  id            TEXT PRIMARY KEY,          -- CRS-2026-001
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  operator_id   TEXT REFERENCES operators(id),
  lead_id       TEXT REFERENCES leads_training(id),
  format        TEXT NOT NULL,             -- full3 | day1 | lang_module | renewal
  language      TEXT NOT NULL,             -- lingua di erogazione: ja | zh
  target_langs  TEXT,                      -- JSON lingue insegnate
  day1_date TEXT, day2_date TEXT, day3_date TEXT,
  venue         TEXT, venue_type TEXT,     -- operator_site | tokyo_room
  teacher_id    TEXT REFERENCES panel_users(id),
  seats         INTEGER, price_jpy INTEGER,
  status        TEXT NOT NULL DEFAULT 'planned'  -- planned | confirmed | running | done | cancelled
);

-- Iscrizioni e voti
CREATE TABLE enrollments (
  id            TEXT PRIMARY KEY,          -- ENR-XXXXXX
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  course_id     TEXT NOT NULL REFERENCES courses(id),
  driver_id     TEXT NOT NULL REFERENCES drivers(id),
  operator_id   TEXT REFERENCES operators(id),
  attended_d1 INTEGER, attended_d2 INTEGER, attended_d3 INTEGER,
  score_oral    INTEGER, score_practical INTEGER, score_written INTEGER,   -- 0..100
  pass_oral INTEGER, pass_practical INTEGER, pass_written INTEGER,
  result        TEXT,                      -- pending | pass | fail | retake
  retake_until  TEXT,                      -- 60 giorni dalla prima prova
  graded_by     TEXT REFERENCES panel_users(id), graded_at TEXT,
  notes         TEXT
);
CREATE UNIQUE INDEX idx_enroll_unique ON enrollments(course_id, driver_id);

-- Certificati (il badge pubblico)
CREATE TABLE certificates (
  id            TEXT PRIMARY KEY,          -- numero pubblico: 2026-0001
  created_at    TEXT NOT NULL, updated_at TEXT NOT NULL,
  driver_id     TEXT NOT NULL REFERENCES drivers(id),
  enrollment_id TEXT REFERENCES enrollments(id),
  level         TEXT NOT NULL,             -- standard | advanced
  languages     TEXT NOT NULL,             -- JSON lingue certificate
  issued_at     TEXT NOT NULL, expires_at TEXT NOT NULL,   -- 2 anni
  status        TEXT NOT NULL DEFAULT 'active',  -- active | expired | revoked
  revoked_at TEXT, revoke_reason TEXT,
  verify_token  TEXT NOT NULL,             -- parte segreta nell'URL del QR, per evitare l'enumerazione
  pdf_key TEXT, png_key TEXT,              -- chiavi R2 del badge generato
  views         INTEGER NOT NULL DEFAULT 0, last_view_at TEXT
);
CREATE TABLE cert_counters ( year INTEGER PRIMARY KEY, last_no INTEGER NOT NULL );

-- Rinnovi
CREATE TABLE renewals (
  id            TEXT PRIMARY KEY,          -- RNW-XXXXXX
  created_at    TEXT NOT NULL,
  certificate_id TEXT NOT NULL REFERENCES certificates(id),
  course_id     TEXT REFERENCES courses(id),      -- la giornata di aggiornamento
  new_certificate_id TEXT REFERENCES certificates(id),
  reminded_60_at TEXT, reminded_30_at TEXT,
  status        TEXT NOT NULL DEFAULT 'due'  -- due | scheduled | done | lapsed
);

-- Utenti del pannello e ruoli
CREATE TABLE panel_users (
  id            TEXT PRIMARY KEY,          -- USR-XXXXXX
  created_at    TEXT NOT NULL,
  role          TEXT NOT NULL,             -- admin | teacher | operator
  name          TEXT NOT NULL, email TEXT,
  token_hash    TEXT NOT NULL,             -- SHA-256 del token, mai il token in chiaro
  operator_id   TEXT REFERENCES operators(id),   -- solo per role = operator
  status        TEXT NOT NULL DEFAULT 'active'
);
```

Decisioni incorporate: il numero del badge e' progressivo per anno tramite cert_counters; l'URL del QR e' /verify/{id}?t={verify_token}, cosi' chi digita solo il numero nel campo di verifica ottiene stato e dati minimi e chi scansiona il QR ottiene la scheda completa; i voti stanno in enrollments e il certificato nasce solo quando i tre pass sono veri; il rinnovo crea un nuovo certificato e chiude il vecchio, cosi' lo storico resta leggibile.

## 3. API e viste del pannello

Worker (hdj-api), route su hiredriverjapan.com:
- POST /api/training/lead: valida, verifica Turnstile, scrive leads_training, invia due email con Resend (al referente nella sua lingua, a CONTACT_EMAIL con il riepilogo), risponde 200 con l'id.
- GET /verify/{id}: pagina HTML pubblica, noindex, cache 0; GET /api/verify/{id}: JSON per integrazioni degli hotel; incrementa views.
- /api/admin/training/*: leads (lista per stage, cambio stage, nota, conversione in operator), operators, drivers, courses (crea, calendario, stato), enrollments (iscrivi, voti per modulo, esito), certificates (emetti, revoca, rigenera badge, export CSV), renewals (in scadenza a 60 e 30 giorni).
- Autenticazione: header X-Panel-Token; il Worker calcola lo SHA-256 e cerca in panel_users; il ruolo teacher vede solo courses.teacher_id = suo e puo' scrivere solo i voti; il ruolo operator vede solo certificates dei suoi drivers (predisposto, non esposto in UI nella prima versione).
- Cron giornaliero: segna expired i certificati scaduti, crea renewals due a 60 giorni dalla scadenza, manda a CONTACT_EMAIL la lista dei rinnovi in scadenza.

Viste del pannello (app statica, stesso impianto di DRIVEN):
1. Pipeline lead: colonne new, contacted, quoted, confirmed, lost; card con azienda, tipo, numero autisti, lingue, data; trascinamento o menu per cambiare stage; campo preventivo.
2. Calendario sessioni: mese e lista; filtro per docente e stato.
3. Sessione: anagrafica, elenco iscritti con presenze e tre voti, pulsante "emetti certificati" attivo solo per chi ha i tre pass.
4. Certificati: ricerca per numero, autista, operatore; stato; azioni emetti PDF e PNG, revoca, copia link di verifica.
5. Rinnovi: in scadenza a 60 giorni e a 30, con stato promemoria.
6. Export CSV per ciascuna lista.

Badge: generato nel Worker come PNG (canvas via libreria leggera) e PDF (pdf-lib, compatibile con Workers), salvati su R2, con QR verso l'URL di verifica; layout scuro coerente con il brand quando ci sara' il nome.

## 4. Cosa mi serve da te per passare al passo 2

- Approvazione o modifiche a wireframe e schema.
- Risposta ai punti 1, 2 e 7 della sezione 0 (ordine di lancio, parola per la certificazione, infrastruttura separata).
- Conferma della capienza 4 a 8 e della regola di ripetizione dell'esame.
