// Tutto cio' che cambia senza toccare i testi. Ogni valore null compare nella checklist di build.
export const CONFIG = {
  BRAND_NAME: "HIRE driver japan",          // brand in decisione: cambiare qui e ricostruire
  BRAND_KANA: "ハイヤードライバージャパン",
  BRAND_ZH: "日本专业司机",
  CERT_NAME: "VVIP Service Certificate",    // nome della certificazione: da confermare
  COMPANY_JA: "6株式会社",
  COMPANY_EN: "6 Ltd",
  COMPANY_ZH: "6株式会社",
  COMPANY_ADDRESS: "徳島県板野郡藍住町笠木字中野137",                 // come nella pagina legale di Driven Tokyo
  COMPANY_ADDRESS_EN: "137 Nakano, Kasagi, Aizumi-cho, Itano-gun, Tokushima, Japan",
  REPRESENTATIVE_JA: "代表取締役社長 コンベルシ フルビオ",                  // rappresentante legale come in visura, es. "代表取締役 ○○○○" (obbligatorio nella privacy, art. 32)
  REPRESENTATIVE_EN: "Representative Director and President, コンベルシ フルビオ",                  // es. "Representative Director ○○○○"
  PRIVACY_EMAIL: "info@hiredriverjapan.com",                      // casella per richieste privacy; se null usa CONTACT_EMAIL
  PRIVACY_DATE: "2026-10-04",                       // data di entrata in vigore, es. "2026-10-10"
  SITE_URL: "https://hiredriverjapan.com",
  CONTACT_EMAIL: "info@hiredriverjapan.com",                      // destinatario delle richieste: va anche nella variabile del Worker
  TEACHER_NAME: "Fulvio",                      // nome del docente
  // Tariffe aziende, in yen all'ora, IVA esclusa. null = "su preventivo".
  PRICES: {
    standard: { hourly: null, minHours: 3 },
    casual:   { hourly: null, minHours: 2 },
    vip:      { hourly: null, minHours: 4 },
  },
  // Formazione: valori del brief, mostrati come "da", IVA esclusa
  // Formazione, IVA esclusa. Pacchetti azienda: sessione privata in sede, fino a 5 persone (MAX_GROUP).
  TRAINING_PRICES: { day: 10000, course3: 30000, exam: 20000, full: 50000, retake: 10000, lang: 10000, renewal: 20000, pkgIntro: 45000, pkgTrain: 140000, pkgCert: 230000 },
  MAX_GROUP: 5,
  TURNSTILE_SITEKEY: null,                  // chiave pubblica Cloudflare Turnstile: se null il widget non compare
  GA4_ID: null,                            // es. "G-XXXXXXXXXX": se null lo script di Analytics non viene caricato
  GSC_VERIFICATION: null,                  // codice meta di Search Console, solo se non si verifica via DNS
  PRELAUNCH: true,                         // true = noindex su tutte le pagine finche' i segnaposto non sono completati
  LANGS: ["ja", "zh", "en"],
  DEFAULT_LANG: "ja",
};
