# Hire Driver Japan · sito

Sito B2B con brand **HIRE DRIVER JAPAN** (gestito da 6株式会社, citata solo nel piede, nella privacy e sul certificato), in tre lingue (ja, zh, en): autisti dipendenti a ore per le auto delle aziende, pagina per operatori hire e taxi, formazione con certificazione, candidature autisti, verifica pubblica dei certificati e pannello di controllo. Stato al 4 ottobre 2026: costruito e collaudato in locale, **non pubblicato**.

## Struttura

| Percorso | Cosa contiene |
|---|---|
| config.mjs | Brand, nome del certificato, prezzi, indirizzo, email. Ogni valore null finisce nella checklist |
| content/ja.mjs, zh.mjs, en.mjs | Tutti i testi, scritti nativi per lingua. Il giapponese e' la versione di riferimento |
| build.mjs | Genera dist/: 18 pagine, hreflang, canonical, Open Graph, JSON-LD (Organization, Service, Course, FAQPage), sitemap, robots |
| src/assets/ | CSS, JS, favicon, immagini Open Graph (rigenerabili con make_og.py) |
| worker/worker.js | API dei form, pagina /verify/{id}, API del pannello con ruoli, cron giornaliero |
| worker/schema.sql | Le 11 tabelle D1 |
| admin/index.html | Pannello: richieste, anagrafiche, sessioni e voti, certificati con badge PNG e PDF, rinnovi, utenti, export CSV |
| texts/ | I testi completi in markdown, uno per lingua (node export_texts.mjs) |
| wrangler.toml | Un solo Worker con asset statici, database separato da DRIVEN |

## Aspetto e brand

- Brand visibile: Hire Driver Japan, marchio proprio (ottagono oro con H) in src/assets/hdj-mark.svg. Non usare il 6 di 6 Ltd.
- Palette nero e oro del gruppo: inchiostro #14110E, oro #C7A36A, avorio #F1EADC. Titoli in Cormorant Garamond, testo in Jost, serviti dal sito (src/assets/fonts). Giapponese in Mincho e cinese in Songti di sistema.
- Foto di Fulvio presa da Driven Tokyo (app/public/fulvio.jpg): testata e profilo docente della formazione, riquadro "chi forma i nostri autisti" in home. Non in testata home, perche' la Maybach farebbe pensare che l'auto la forniamo noi.
- Chi vuole auto piu' autista viene mandato a Driven Tokyo con un pulsante (ja: driventokyo.com/ja/, zh ed en: driventokyo.com).

## Pagine

| URL | Pubblico |
|---|---|
| /ja/ /zh/ /en/ | Aziende con auto propria: autista a ore, piani Standard, Spot, VIP |
| /{lang}/operators/ | Operatori hire e taxi: formazione, segnalazione clienti, preregistrazione al collocamento |
| /{lang}/training/ | Formazione VVIP di 3 giorni con esame e certificazione |
| /{lang}/drivers/ | Candidature autisti, assunzione part time da parte di 6 |
| /{lang}/verify/ e /verify/{id} | Verifica pubblica del certificato, noindex |
| /admin/ | Pannello, accesso con token |

## Comandi in locale

```
node build.mjs                                   # genera dist/ e stampa la checklist
npx wrangler d1 execute hdj-data --local --file=worker/schema.sql
npx wrangler dev --local --port 8799             # serve sito, API e pannello
```

Il token admin locale sta in .dev.vars (escluso da git). Il cron in locale si prova dal pannello con POST /api/admin/cron-run: il simulatore cron di Wrangler con gli asset statici risponde "exception" anche quando il codice funziona.

## Pubblicazione (da fare, non eseguita)

0. Account Cloudflare dedicato: dal login driventokyo, menu account in alto a sinistra, "Add account", nome per esempio "Hire Driver Japan". Wrangler su questo Mac vede subito il nuovo account: basta mettere il suo account_id in wrangler.toml. Nessuna chiave API passa dalla chat.
1. Comprare hiredriverjapan.com con Cloudflare Registrar dentro quell'account.
2. `npx wrangler d1 create hdj-data` e copiare l'id in wrangler.toml.
3. `npx wrangler d1 execute hdj-data --remote --file=worker/schema.sql`
4. Segreti: `npx wrangler secret put ADMIN_TOKEN`, `RESEND_API_KEY`, `TURNSTILE_SECRET`.
5. Verificare il dominio su Resend e compilare FROM_EMAIL e CONTACT_EMAIL in wrangler.toml.
6. `node build.mjs && npx wrangler deploy`, poi collegare il dominio al Worker.
7. Verifica dopo il deploy: le pagine live, un invio di prova per ciascun form, l'email ricevuta, una verifica certificato.

## Checklist da inserire a mano

- **Nomi:** BRAND_NAME e CERT_NAME in config.mjs e in wrangler.toml. Oggi: Hire Driver Japan e VVIP Service Certificate. Dopo il cambio: node build.mjs e python3 make_og.py.
- **Prezzi aziende:** tariffa oraria Standard, Spot e VIP in config.mjs. Finche' sono null la pagina mostra "su preventivo".
- **Prezzi formazione:** valori del brief, mostrati come "da", IVA esclusa. Da confermare.
- **Docente:** nome (Fulvio) e foto gia' inseriti. Da confermare solo anni di esperienza e 二種免許, segnati in giallo nel profilo.
- **Azienda:** indirizzo legale (COMPANY_ADDRESS).
- **Email:** CONTACT_EMAIL di destinazione e FROM_EMAIL su dominio verificato.
- **Privacy:** testo definitivo nelle tre lingue (ora c'e' una struttura segnata come bozza) e elenco dei fornitori che trattano i dati.
- **Assicurazione:** polizza di responsabilita' per la gestione di veicoli altrui, citata nella FAQ.
- **Salario autisti:** tariffa oraria nella pagina candidature.
- **Turnstile:** chiave pubblica in config.mjs e segreto nel Worker, consigliato prima del lancio.
- Tutti i segnaposto gialli: l'elenco completo lo stampa node build.mjs e lo scrive in dist/build-checklist.txt.

## Decisioni gia' prese nel codice

- La home vende solo la guida dell'auto del cliente, a ore. Niente tariffe a corsa o a chilometro. Base: linee guida del Ministero dei trasporti, Hokkaido, 7 agosto 2024, citate nella FAQ.
- Nessun testo parla di 派遣 o freelance come servizio. Il collocamento e' in preregistrazione finche' non arriva la licenza.
- La certificazione e' dichiarata privata ovunque, in tre lingue.
- Il certificato si emette solo con tre prove superate (soglia 70 su 100) e con la data del consenso scritto dell'autista.
- Chi digita il numero vede stato, lingue, livello, scadenza e iniziali. Chi scansiona il QR, che contiene un token segreto, vede nome e operatore se l'autista li ha autorizzati.
- Numerazione per anno (2026-0001), contatore che si riallinea da solo. Il rinnovo emette un certificato nuovo e chiude il vecchio.
- Ruoli: admin vede tutto, docente vede solo le sue sessioni e scrive i voti, operatore vede solo i certificati dei suoi autisti (API pronta, interfaccia minima).

## Limiti noti

- Il badge PNG e il PDF si generano nel browser dal pannello (PDF con la stampa del browser), non vengono salvati su R2.
- Le email non sono state provate: mancano chiave Resend e dominio verificato. Senza chiave il Worker salva la richiesta e lo scrive nel log.
- Peso di CSS, JS e home giapponese insieme:  36K. Nessun font esterno, nessuna immagine nelle pagine a parte le Open Graph.
