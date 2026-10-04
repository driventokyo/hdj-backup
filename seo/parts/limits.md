## 5. Limiti del metodo e cosa verificare in Google Keyword Planner

Cosa misurano davvero questi dati:
- I suggest di Google, Bing e Baidu dicono che una frase viene digitata abbastanza spesso da entrare nell'autocompletamento. Non dicono quante volte. Una keyword presente in piu' motori e generata da piu' seed e' piu' consolidata, e questo e' il "numero di fonti" usato come proxy. Un proxy di 2 fonti e 3 seed non vale "il doppio" di 1 fonte e 3 seed: e' un ordinamento, non una misura.
- Google Trends normalizza su 100 il picco della serie e taglia le query sotto soglia a 0. Per quasi tutte le keyword di nicchia di questo settore la serie e' fatta di zeri con qualche picco isolato: significa "poche decine di ricerche al mese o meno", non "nessuna domanda". Le related queries di Trends restano utili anche quando la serie e' piatta.
- I seed a tre parole del brief (per esempio eigo taiou haiyaa doraibaa, cioe' "英語対応 ハイヤー ドライバー") non hanno autocompletamento in nessun motore: Google risponde con lista vuota. E' un dato: nessuno digita queste frasi complete. I seed derivati a una o due parole (haiyaa doraibaa, nishu menkyo e 日本包车, cioe' "ハイヤー ドライバー", "二種免許") sono quelli che generano la lunga coda.
- Yahoo Japan non e' stato raccolto: l'endpoint pubblico risponde HTML e l'API ufficiale richiede un appid. Rakko Keyword non e' stato usato perche' robots.txt vieta /result/ a tutti gli user agent. Google Search da automazione risponde con la pagina "sorry", quindi SERP e nomi sono stati verificati su DuckDuckGo dentro Chrome, che non mostra totali di risultati.
- Baidu Suggest e' stato raccolto, ma non esiste un equivalente gratuito di Baidu Index senza account: il volume cinese resta il piu' incerto dei tre.
- La classificazione per intento e per lato della domanda (operatore, autista, turista) e' fatta con regole lessicali semplici: va bene per ordinare centinaia di righe, non per decidere una singola parola. Le liste finali del report sono curate a mano sopra i dati.

Cosa verificare in Keyword Planner quando avrai l'account:
1. Volume medio mensile e CPC per le 35 keyword del punto 1, con geolocalizzazione Giappone e lingua giapponese, inglese e cinese separate. Il CPC e' il dato che manca del tutto a questo report e dice quanto vale un lead per gli inserzionisti attuali.
2. Il rapporto fra ハイヤー ドライバー 求人 e タクシー ドライバー 求人: decide se la pagina per gli autisti deve parlare di hire o di taxi.
3. Volume reale di 二種免許 外国人 e 二種免許 英語: se supera qualche centinaio al mese, la guida alla patente per stranieri diventa la pagina di acquisizione principale lato autisti.
4. Volume di 日本司机招聘 e 日本 司机 兼职 con targeting lingua cinese in Giappone: Keyword Planner permette di isolare chi vive in Giappone e cerca in cinese, cosa che nessuna fonte gratuita fa.
5. Volume delle query B2B pure (ドライバー 紹介 会社, ドライバー 人材紹介, 乗務員 採用 代行): sono piccole per costruzione, servono a dimensionare la campagna Ads piu' che la SEO.
6. Conferma che le frasi del brand (ハイヤードライバー, hire driver japan) non abbiano volume nullo: se "hire driver japan" ha volume, il brand intercetta anche traffico turistico e la home deve smistarlo in una riga.
