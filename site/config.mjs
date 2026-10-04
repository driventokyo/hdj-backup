// Tutto cio' che cambia senza toccare i testi. Ogni valore null compare nella checklist di build.
export const CONFIG = {
  BRAND_NAME: "HIRE driver japan",          // brand in decisione: cambiare qui e ricostruire
  BRAND_KANA: "ハイヤードライバージャパン",
  BRAND_ZH: "日本专业司机",
  CERT_NAME: "VVIP Service Certificate",    // nome della certificazione: da confermare
  COMPANY_JA: "6株式会社",
  COMPANY_EN: "6 Ltd",
  COMPANY_ZH: "6株式会社",
  COMPANY_ADDRESS: null,                    // indirizzo legale: da inserire
  SITE_URL: "https://hiredriverjapan.com",
  CONTACT_EMAIL: null,                      // destinatario delle richieste: va anche nella variabile del Worker
  TEACHER_NAME: "Fulvio",                      // nome del docente
  // Tariffe aziende, in yen all'ora, IVA esclusa. null = "su preventivo".
  PRICES: {
    standard: { hourly: null, minHours: 3 },
    casual:   { hourly: null, minHours: 2 },
    vip:      { hourly: null, minHours: 4 },
  },
  // Formazione: valori del brief, mostrati come "da", IVA esclusa
  TRAINING_PRICES: { pack6: 600000, extra: 100000, day1: 150000, lang: 40000, renewal: 20000 },
  TURNSTILE_SITEKEY: null,                  // chiave pubblica Cloudflare Turnstile: se null il widget non compare
  PRELAUNCH: true,                         // true = noindex su tutte le pagine finche' i segnaposto non sono completati
  LANGS: ["ja", "zh", "en"],
  DEFAULT_LANG: "ja",
};
