# hiredriverjapan.com: ricerca keyword, benchmark e nome

Data: 4 ottobre 2026. Sito: B2B, autisti con nishu menkyo (二種免許) che parlano inglese e altre lingue. Il brief iniziale li offriva agli operatori hire e taxi; dal 4 ottobre il servizio principale e' l'autista dipendente di 6 che guida l'auto dell'azienda cliente a ore, con agli operatori formazione e, dopo la licenza, collocamento. Mai haken (派遣). Tutto raccolto da terminale con fonti gratuite, senza account Google Ads.

File prodotti in seo/:
- keywords_raw.csv: ogni suggerimento con lingua, fonte e seed di origine
- keywords_scored.csv: keyword uniche con intento, flag legale, pertinenza, lato della domanda, numero di fonti, Trends e related queries
- seeds.csv: seed originali del brief e seed derivati
- trends.csv e related.csv: Google Trends 12 mesi, geo Giappone, per le 20 keyword scelte
- serp_top10.csv: prime 10 posizioni per le query del brief e di scoperta (DuckDuckGo in Chrome)
- benchmark.csv: 42 URL analizzati (title, meta, H1, H2, termini, posizioni)
- names_ddg_exact.csv e names_check.csv: verifiche sui nomi candidati
- errors.log, errors_run1.log, progress.log: errori e avanzamento della raccolta
- collect.py, score.py, trends.py, benchmark.py, names_check.py: script riutilizzabili

Sommario della raccolta:

| Fonte | Suggerimenti raccolti (righe grezze) |
|---|---|
| baidu | 920 |
| bing_en-JP | 628 |
| bing_ja-JP | 1384 |
| bing_zh-CN | 159 |
| google_en_jp | 670 |
| google_ja_jp | 1090 |
| google_zh-CN_cn | 311 |
| google_zh-CN_jp | 307 |
| yahoo_jp | non disponibile (endpoint pubblico risponde HTML, API con appid) |
| rakko (related-keywords.com) | non usato, robots.txt vieta /result/ |

Query inviate ai suggest: 6497. Keyword uniche dopo normalizzazione: en 934, ja 1931, zh 1070. Di queste, pertinenti al servizio dopo il filtro: en 294, ja 1104, zh 719.


## 1. Keyword migliori per rapporto fra domanda stimata e aderenza al servizio

Come leggere le tabelle: "Fonti" e' il numero di motori in cui la frase compare nei suggerimenti, "Seed" il numero di frasi di partenza diverse che la generano. Sono un ordinamento, non un volume. Il servizio di riferimento e' quello del sito costruito: autisti dipendenti di 6 che guidano l'auto del cliente a ore, piu' reclutamento di autisti e formazione per operatori. Il 4 ottobre il modello e' passato dagli operatori alle aziende con auto propria, quindi ho fatto un giro aggiuntivo di suggerimenti sul lato aziende (8 seed, 71 frasi nuove).

### Giapponese (15)

| # | Keyword | Lato | Fonti | Seed | Pagina | Perche' |
|---|---|---|---|---|---|---|
| 1 | yakuin untenshu (役員運転手) | aziende | 1 | 1 | home ja | Il nome con cui le aziende cercano il servizio; genera 料金, 相場, 英語, 派遣 料金 |
| 2 | yakuin untenshu ryoukin (役員運転手 料金) | aziende | 1 | 1 | home ja, tabella piani | Intento d'acquisto puro |
| 3 | yakuin untenshu souba (役員運転手 相場) | aziende | 1 | 1 | home ja | Chi confronta prezzi: serve la tariffa oraria pubblicata |
| 4 | senzoku untenshu ryoukin (専属運転手 料金) | aziende e privati | 1 | 1 | home ja | Compare anche 専属運転手 1日 e 個人: c'e' domanda dei privati con auto propria |
| 5 | untenshu supotto (運転手 スポット) | aziende | 1 | 1 | home ja, piano Spot | Coincide con il piano Spot; esiste anche 運転手 スポット契約 |
| 6 | yakuin untenshu eigo (役員運転手 英語) | aziende | 1 | 1 | home ja | Aderenza massima: e' esattamente il servizio |
| 7 | senzoku untenshu eigo (専属運転手 英語) | aziende | 1 | 1 | home ja | Come sopra |
| 8 | haiyaa eigo (ハイヤー 英語) | misto | 2 | 1 | home ja, operatori | Due motori; Trends 0,1 di media: domanda piccola ma reale |
| 9 | haiyaa doraibaa eigo (ハイヤー ドライバー 英語) | misto | 1 | 3 | home ja, candidature | Tre seed diversi la generano |
| 10 | haiyaa eigo kyuujin (ハイヤー 英語 求人) | autisti | 2 | 1 | candidature ja | Reclutamento, che e' il collo di bottiglia |
| 11 | takushii eigo kyuujin (タクシー 英語 求人) | autisti | 2 | 1 | candidature ja | Trends 2,0 di media con un picco a 100: la piu' viva del lato autisti |
| 12 | haiyaa doraibaa kyuujin (ハイヤー ドライバー 求人) | autisti | 2 | 2 | candidature ja | Coincide con il brand ハイヤードライバー |
| 13 | nishu menkyo eigo (二種免許 英語) | autisti | 2 | 2 | guida patente (da fare) | Punteggio piu' alto di tutta la lista giapponese |
| 14 | nishu menkyo gaikokujin (二種免許 外国人) | autisti | 2 | 1 | guida patente (da fare) | Bacino degli stranieri residenti |
| 15 | nishu menkyo fukugyou (二種免許 副業) | autisti | 2 | 1 | candidature ja, FAQ | Il part time come secondo lavoro e' il nostro modello di assunzione |

Contesto da Trends (12 mesi, Giappone): nishu menkyo (二種免許) ha una serie piena, media 40 su 100; tutte le frasi composte con eigo o haiyaa restano sotto 1. eigo takushii (英語 タクシー) ha media 79 ma e' gonfiata da turisti e studenti (英語 タクシーを呼ぶ, 行き先): non e' il nostro pubblico.

### Cinese (10)

| # | Keyword | Lato | Fonti | Seed | Pagina | Perche' |
|---|---|---|---|---|---|---|
| 1 | 在日本东京请一位全职司机多少钱 | aziende e privati | 1 | 6 | home zh | Generata da sei seed: e' la domanda d'acquisto piu' consolidata in cinese |
| 2 | 日本出租车司机招聘条件 | autisti | 1 | 5 | candidature zh | Requisiti per lavorare: la pagina li elenca |
| 3 | 日本司机工资一般多少 | autisti | 1 | 6 | candidature zh | Serve il salario orario pubblicato |
| 4 | 去日本做司机工资高吗 | autisti | 1 | 6 | candidature zh | Da trattare con cautela: chi cerca dall'estero non ha il permesso di lavoro |
| 5 | 日本招中国司机要求 | autisti | 1 | 4 | candidature zh, FAQ visto | Domanda esplicita sui requisiti |
| 6 | 东京 英语司机 兼职招聘 | autisti | 1 | 1 | candidature zh | Aderenza massima lato autisti |
| 7 | 日本 包车 司机 英语 兼职招聘 | autisti | 1 | 1 | candidature zh | Come sopra, dal mondo 包车 |
| 8 | 日本包车公司 | operatori | 2 | 1 | operatori zh | Due motori; e' come i cinesi chiamano il nostro cliente operatore |
| 9 | 日本包商务车的出租车公司有哪些 | operatori | 1 | 3 | operatori zh | Chi cerca un operatore: possibile segnalazione ai partner |
| 10 | 日本二种驾照申请条件 | autisti | 1 | 1 | guida patente zh (da fare) | Equivalente cinese di 二種免許 外国人 |

日本包车一天多少钱 e le altre frasi di prezzo del 包车 hanno il punteggio piu' alto in cinese, ma sono turisti che cercano auto piu' autista: noi non vendiamo trasporto, quindi al massimo vanno girati a un operatore partner.

### Inglese (10)

| # | Keyword | Lato | Fonti | Seed | Pagina | Perche' |
|---|---|---|---|---|---|---|
| 1 | english speaking driver japan | misto | 1 | 2 | home en | La formula del settore, gia' nel title di tutti i concorrenti |
| 2 | english speaking driver tokyo | misto | 1 | 1 | home en | Come sopra, con la citta' |
| 3 | personal driver in japan | aziende e privati | 2 | 3 | home en | Due motori, intento vicino al nostro "driver for your car" |
| 4 | private driver in tokyo | aziende e privati | 1 | 3 | home en | Title della home costruito su questa |
| 5 | cost to hire a driver in japan | aziende e privati | 1 | 1 | home en, tabella piani | Intento di prezzo |
| 6 | hire driver japan | misto | 1 | 1 | brand | Coincide con il brand: protegge la ricerca del nome |
| 7 | japan driver for hire | misto | 1 | 2 | home en | Variante del brand |
| 8 | driver jobs japan | autisti | Trends | | candidature en | L'unica inglese con serie Trends non nulla, media 18,6 |
| 9 | japan driver jobs for foreigners | autisti | 1 | 1 | candidature en | Aderenza massima lato autisti |
| 10 | taxi driver job japan | autisti | 1 | 1 | candidature en | Chi arriva dal mondo taxi |

In inglese quasi tutte le frasi con chauffeur e private driver sono di turisti (tour, airport, Mt Fuji). La home inglese le intercetta ma dichiara subito che serve un'auto propria e indica l'operatore partner per chi non ce l'ha.

## 2. Keyword da evitare o da trattare solo in una FAQ

| Keyword | Lingua | Fonti | Trattamento |
|---|---|---|---|
| yakuin untenshu haken (役員運転手派遣), 役員運転手 派遣 料金, 役員運転手派遣会社 | ja | 1 | **La scoperta piu' importante.** Il mercato chiama "派遣" proprio il servizio che vendiamo, anche quando i leader lo strutturano come appalto. Mai in title, H1 o testi di vendita. Si tratta nella FAQ "人材派遣とは違うのですか", gia' presente nella home, che permette alla pagina di comparire anche per queste ricerche senza dichiararsi 派遣 |
| shayousha untenshu haken (社用車 運転手派遣), 役員車 運転手 派遣 | ja | 1 | Come sopra |
| haiyaa doraibaa haken (ハイヤー ドライバー 派遣, ハイヤードライバー派遣) | ja | 1 | Come sopra; e' anche il nome del servizio di 日本交通 |
| haiyaa doraibaa gyoumu itaku (ハイヤー ドライバー 業務 委託) | ja | 1 | Evitare: il contratto con gli autisti e' di lavoro dipendente; la FAQ candidature lo dice esplicitamente |
| doraibaa shoukai yotei haken (ドライバー 紹介予定派遣) | ja | 1 | Evitare: richiede la licenza di 派遣 |
| 大阪 派遣 トラック運転手 | ja | 1 | Fuori tema (logistica) |
| 日本劳务司机招聘网站 | zh | 1 | Evitare: 劳务 evoca l'invio di manodopera dalla Cina, che non facciamo e che attira candidati senza permesso di lavoro |

Nota: nishu menkyo fukugyou (二種免許 副業) e haiyaa doraibaa fukugyou (ハイヤー doraibaa (ドライバー) 副業) erano marcate dal filtro automatico ma non sono un rischio: il secondo lavoro di un dipendente e' legale. Le ho tolte dal flag e usate nella pagina candidature.

## 3. Title tag, meta description e H1

Applicati nel sito costruito (HIREDRIVERJAPAN/site); i testi completi sono in site/texts/ja.md, zh.md, en.md.

| Pagina | Title | H1 |
|---|---|---|
| Home ja | 役員運転手・専属運転手を1時間から｜英語対応・二種免許｜Hire Driver Japan | 御社の車に、外国語で接客できるプロのドライバーを。 |
| Home zh | 东京专职司机按小时服务｜会英语中文，驾驶您的车｜Hire Driver Japan | 贵公司的车，由会外语的专业司机来开。 |
| Home en | Private English-Speaking Driver for Your Car in Tokyo \| Hire Driver Japan | A professional, multilingual driver for your own car. |
| Candidature ja | 英語を活かすハイヤードライバー求人｜第二種免許｜Hire Driver Japan | 第二種免許と語学を、いちばん活きる仕事に。 |
| Candidature zh | 日本司机招聘｜二种驾照，外语接待，时薪制｜Hire Driver Japan | 二种驾照加外语，用在最值钱的地方。 |
| Candidature en | Driver Jobs in Tokyo for Bilinguals, Class 2 Licence \| Hire Driver Japan | Your Class 2 licence and your languages, in one job. |
| Formazione ja | VIP送迎・外国語対応の乗務員研修（認証付き）｜Hire Driver Japan | CERT_NAME |

Meta description della home giapponese: 役員運転手・専属運転手を、必要な日に1時間単位で。第二種免許を持ち英語で接客できる当社雇用のドライバーが、御社の車両を運転します。専属運転手の休暇、海外VIPの来日、国際会議のスポット対応に。料金は時間制です。

## 4. Cluster di contenuti (una pagina per cluster)

| # | Pagina | Stato | Keyword principale | Secondarie |
|---|---|---|---|---|
| 1 | Home aziende ja | costruita | 役員運転手 | 役員運転手 料金, 役員運転手 相場, 専属運転手 料金, 運転手 スポット, 役員運転手 英語 |
| 2 | Home aziende zh | costruita | 在日本东京请一位全职司机多少钱 | 东京 专职司机, 日本 私人司机 英语, 东京 公司车 司机 |
| 3 | Home aziende en | costruita | private driver in tokyo | personal driver in japan, english speaking driver tokyo, cost to hire a driver in japan, hire driver japan |
| 4 | Candidature ja | costruita | ハイヤー ドライバー 求人 | ハイヤー 英語 求人, タクシー 英語 求人, 二種免許 副業, 英語 タクシー ドライバー 年収 |
| 5 | Candidature zh | costruita | 日本司机招聘 | 日本出租车司机招聘条件, 日本司机工资一般多少, 东京 英语司机 兼职招聘, 日本招中国司机要求 |
| 6 | Candidature en | costruita | driver jobs japan | japan driver jobs for foreigners, taxi driver job japan, bilingual driver jobs japan |
| 7 | Guida: la 二種免許 per stranieri, ja | da fare | 二種免許 外国人 | 二種免許 英語, 二種免許 取得条件, 二種免許 一発試験 費用, 二種免許 いくら |
| 8 | Guida: 二种驾照, zh | da fare | 日本二种驾照申请条件 | 日本二种驾照 考试, 日本二种驾照 费用, 日本招中国司机要求 |
| 9 | Operatori e formazione, ja zh en | costruite | ハイヤー ドライバー 採用 / 日本包车公司 | タクシー ドライバー 紹介, VIP 送迎 会社, 日本包商务车的出租车公司有哪些 |
| 10 | Articolo: 役員運転手の手配方法と料金の考え方, ja | da fare | 役員運転手 料金 | 役員運転手 相場, 専属運転手 1日, 運転手 スポット契約, 役員運転手 派遣 料金 (trattato come confronto con il 派遣) |

Ordine consigliato per le prossime pagine: 7 e 8 (guide alla patente, l'unica domanda con volume Trends misurabile, e portano candidati), poi 10 (prende la domanda 役員運転手 haken (派遣) ryoukin (料金) spiegando perche' noi non siamo 派遣).


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
2. Il rapporto fra haiyaa (ハイヤー) doraibaa (ドライバー) kyuujin (求人) e takushii (タクシー) doraibaa (ドライバー) kyuujin (求人): decide se la pagina per gli autisti deve parlare di hire o di taxi.
3. Volume reale di nishu menkyo (二種免許) gaikokujin (外国人) e nishu menkyo (二種免許) eigo (英語): se supera qualche centinaio al mese, la guida alla patente per stranieri diventa la pagina di acquisizione principale lato autisti.
4. Volume di 日本司机招聘 e 日本 司机 兼职 con targeting lingua cinese in Giappone: Keyword Planner permette di isolare chi vive in Giappone e cerca in cinese, cosa che nessuna fonte gratuita fa.
5. Volume delle query B2B pure (ドライバー shoukai (紹介) 会社, doraibaa (ドライバー) jinzai shoukai (人材紹介), joumuin (乗務員) saiyou (採用) 代行): sono piccole per costruzione, servono a dimensionare la campagna Ads piu' che la SEO.
6. Conferma che le frasi del brand (ハイヤードライバー, hire driver japan) non abbiano volume nullo: se "hire driver japan" ha volume, il brand intercetta anche traffico turistico e la home deve smistarlo in una riga.


## 6. Benchmark dei competitor

Metodo: 42 URL scansionati con requests e BeautifulSoup il 4 ottobre 2026, robots.txt rispettato, una richiesta ogni 2 secondi, home page più fino a 4 sottopagine (recruiting, inglese, servizio stranieri). Le posizioni in SERP vengono da DuckDuckGo aperto in Chrome (locale jp-jp per il giapponese, cn-zh per il cinese), non da Google: Google dall'automazione risponde con la pagina "sorry" e html.duckduckgo.com da curl risponde con la sfida anti-bot. Dati completi in benchmark.csv e serp_top10.csv.

Nota sul conteggio dei termini contrattuali: il conteggio e' testuale, quindi "紹介" include anche "ご紹介" generico e "パート" include "パートナー". Vanno letti come indizi, non come dichiarazioni.

### 6.1 Chi si posiziona per le quattro query del brief

| Query | Chi domina la prima pagina | Tipo di pagina che vince |
|---|---|---|
| english speaking driver tokyo (DDG, jp-jp) | tokyo-chauffeur-service.jp, driverjapanservice.com, hiretaxijapan.com, outech.co.jp/en, tokyo-car-service.com, singhcarservice.com, hirecarjapan.com | Operatori B2C per turisti e corporate, tutti con "English-speaking driver" o "chauffeur" nel title. Nessuna agenzia di autisti, nessuna pagina B2B verso operatori |
| 英語対応 ハイヤー 東京 (DDG, jp-jp) | daiwaj.com (Tokyo Chauffeur Service), tokyo-chauffeur-service.jp, outech.co.jp, km-taxi.tokyo/about/bilingual.php, citycab-taxi.com, kokusai-hire.tokyo, driventokyo.com (7 e 8), tokyomk.jp, 24limousine.com | Pagine servizio ハイヤー con "英語対応ドライバー" nella meta description. Solo km ha una pagina dedicata all'autista bilingue |
| 外国人 送迎 ハイヤー (DDG, jp-jp) | airport-taxi.tokyo, kokusai-hire.tokyo (2 e 3), vip-hire.com, hiremitsumori.com, outech, 24limousine, nash-japan-limo.jp, tokyomk | Pagine di 空港送迎; la parola 外国人 non compare quasi mai nei title: la query e' servita da pagine generiche |
| 日本 包车 司机 英语 (DDG, cn-zh) | Klook (2 schede), easytraveljapan.com/cn, funliday.com, suntaxijp.com/ch, daxiangbaoche.com, piu' 3 risultati di dizionario (taobao fanyi, kuku) | Marketplace e operatori 包车 con 中文司机; l'intento "英语" non e' servito da nessuno: i siti cinesi vendono autisti che parlano cinese |

Query di scoperta: per "ドライバー 紹介 会社 ハイヤー" la prima pagina e' fatta di articoli comparativi (nikko-yokohama, fiit.jp, colorful-career, x-work) e dalla pagina doraibaa haken (ドライバー派遣) di Nihon Koutsuu (日本交通); per "タクシー 乗務員 転職 エージェント" e' tutta di agenzie e comparatori (タク助NEXT, P-CHAN TAXI, asiro, crexgroup). Nessuno dei due spazi ha un attore specializzato in autisti multilingue.

### 6.2 Siti di partenza del brief

| Sito | Title | Come chiama l'autista | Servizio per stranieri | Forma contrattuale dichiarata |
|---|---|---|---|---|
| mk-group.co.jp | MKグループ | ドライバー (87 occorrenze), 乗務員 2 | 外国語 17, 中文 9, English 6. Il programma ESD non compare nelle 5 pagine scansionate: e' sulle pagine locali (Tokyo MK, Kyoto MK), da leggere a mano | 紹介 25 (per lo piu' "ご紹介"), 派遣 10, 正社員 5, パート 2 |
| hinomaru.co.jp | 日の丸リムジングループ | ドライバー 1 (home quasi vuota, gruppo con siti separati per divisione) | non rilevato in home | non rilevato |
| nihon-kotsu.co.jp | 日本交通株式会社 | 乗務員 29, ドライバー 18. Nel recruiting usano 乗務員 | non rilevato nelle pagine corporate | 派遣 13, パート 3, 月給 3 |
| nihon-kotsu-hire.jp e /drivers/ | ドライバー派遣トップ, ハイヤー業界シェアNo1 | ドライバー 60, 乗務員 36, 運転手 2 | English 9 | 派遣 36. Vendono "ドライバー派遣 (運行管理請負)": autista sull'auto del cliente aziendale, strutturato come appalto di gestione operativa, non come 労働者派遣 |
| km-taxi.tokyo e /about/bilingual.php | タクシードライバー（運転手）の英語・外国語対応（バイリンガルタクシー） | ドライバー 38, 運転手 8, 乗務員 3 | 外国語 20, English 15, 英語 10. Chiamano il servizio "バイリンガルタクシー" e "外国語対応" | 紹介 29 (generico), パート 5, 派遣 5 |
| kokusai-hire.tokyo (国際ハイヤー, gruppo km) | 東京のハイヤー会社・予約・役員車・定期送迎・ドライバー派遣・ショーファーサービス | ドライバー 102, 運転手 56, ショーファー 1 | English 11, ESD 3: usano la sigla ESD (English Speaking Driver) | 派遣 74: "ドライバー派遣（委託・運行管理請負）" in meta description |
| kurotokyo.com (al posto di tokyo-blacklimo.com, dominio non attivo) | Private Car & Chauffeur Service in Tokyo | chauffeur 124, driver 13 | English 27, bilingual 2 | non dichiarata |
| blacklane.com, savoya.com (black limousine tokyo, posizioni 1 a 3) | Tokyo Limousine Service, Black Car Service in Tokyo | chauffeur esclusivo | "professional chauffeurs", "vetted chauffeurs" | non dichiarata (piattaforme con partner locali) |

### 6.3 Operatori a gestione cinese (trovati con 日本 包车 公司 东京 e 东京 华人 包车)

| Sito | Title | Autista | Servizio | Note |
|---|---|---|---|---|
| daxiangbaoche.com (大象包车) | 东京包车带司机｜机场接送・富士山箱根一日游 | 司机 48 | 包车 197, 接送 29, 中文 4 | Solo cinese, zero inglese: il mercato 包车 vende "中文司机" |
| tokyodd.com (Tokyo DD) | 高端商务车｜东京包车服务｜中文司机｜机场接送 | 司机 4 | 包车 9, 接送 9, 中文 6, 英语 1 | "正规日本车辆" come argomento di fiducia |
| japantripcore.com (江戸国際) | 日本包车・接送机・定制旅行服务（在日华人旅行社） | nessun termine in home | 包车 6, 接送 4 | Si presenta come agenzia viaggi di cinesi residenti; "自有车辆与司机团队" |
| tokyotransit.co.jp (東京交通) | 商务・旅游专属包车 | 司机 6, driver 7 | 英语 5, English 4 | L'unico dei cinesi che cita l'inglese piu' volte |
| gtc-jp-travel.com | GTC株式会社｜日本包车与机场接送 | driver 1 | "正规绿牌运营", 4 lingue | La targa verde (绿牌) usata come prova di legalita' |
| funliday.com (comparatore) | 日本合法包车｜东京包车・大阪包车 | 司机 48 | 包车 94, 接送 51, 中文 25 | "合法包车" nel title: il mercato cinese ha paura del 白タク (黑车) |

Lettura: in cinese l'autista e' sempre 司机, il servizio e' 包车 o 接送, la lingua richiesta e' 中文. Le parole "合法", "正规", "绿牌" sono argomenti di vendita ricorrenti: un sito che certifica autisti con 二种驾照 regolari parla direttamente a questa paura. Nessuno di questi siti ha una pagina "cerchiamo autisti" in cinese indicizzata su DuckDuckGo: il canale di reclutamento e' WeChat, non il web aperto.

### 6.4 Agenzie di collocamento e dispatch di autisti

| Sito | Title | Autista | Forma contrattuale | Note |
|---|---|---|---|---|
| nihon-kotsu-hire.jp/drivers/ | ドライバー派遣トップ | ドライバー 60, 乗務員 32 | 派遣 34: "運行管理請負" | Il leader vende gia' l'autista sull'auto del cliente, ma a clienti corporate con 役員車, non ad altri operatori hire |
| takusuke-next.net (タク助NEXT) | タクシー転職エージェント | ドライバー 1 | 紹介 6 | 300 societa' taxi convenzionate, candidati giapponesi |
| p-chan.jp/taxi (P-CHAN TAXI) | 未経験・タクシードライバーの求人・転職情報サイト | ドライバー 27, 運転手 7 | 月給 65, 正社員 23, 紹介 13, 歩合 6 | Parla di 外国人 6 volte: inizia a reclutare stranieri; argomenti 月給保証, 寮完備, 保証人なし |
| nikko-yokohama.com (articolo) | ドライバー派遣の会社一覧 | ドライバー 126 | 派遣 153 | Contenuto SEO di un operatore hire di Yokohama: posizione 1 per la query del brief |
| colorful-career.jp (articolo) | ハイヤー・ドライバー派遣とは？ | ドライバー 165, 運転手 23 | 派遣 73, 紹介 23 | Confronta hire e dispatch per 役員車; cita "法的リスク" |
| fiit.jp (articolo) | ドライバー人材紹介会社の選び方とおすすめ8選【2026年版】 | ドライバー 49 | 紹介 102, 派遣 17, 業務委託 6 | Parla a 採用担当者 (HR): e' il lettore giusto per il nostro sito |

### 6.5 Cosa dice il benchmark al nostro sito

- Parola per l'autista: in giapponese doraibaa (ドライバー) nel marketing, joumuin (乗務員) nel recruiting e nei documenti, untenshu (運転手) solo nei title "per i clienti" (km, Driven). In inglese "chauffeur" per il premium B2C, "driver" per il resto; "English-speaking driver" e' la formula ricorrente, e la sigla ESD esiste gia' (Kokusai). In cinese 司机, mai 司機 semplificato a parte easytraveljapan.
- Nome del servizio per stranieri: eigo taiou doraibaa (英語対応ドライバー) (la formula piu' usata in meta description), gaikokugo taiou (外国語対応), bairingaru takushii (バイリンガルタクシー) (km), tagengo taiou (多言語対応) (Driven, NASH). "インバウンド対応" non compare in nessun title della prima pagina: e' linguaggio da convegno, non da ricerca.
- Forma contrattuale: nessun sito di servizio la dichiara al cliente. I due leader vendono "ドライバー派遣" ai clienti aziendali ma lo strutturano come unkou kanri ukeoi (運行管理請負) (appalto), e lo dicono nella meta description: e' il segnale che il mercato sa che il termine haken (派遣) e' delicato. I siti di recruiting dichiarano seishain (正社員) e 月給保証; il part time compare poco e il kengyou (兼業) mai.
- Spazio vuoto: nessun sito in prima pagina, in nessuna delle tre lingue, offre autisti multilingue con nishu (二種) a operatori hire o taxi. Le query B2B esistono (ドライバー shoukai (紹介) 会社 haiyaa (ハイヤー) ha 10 risultati competitivi) ma sono servite da articoli comparativi e da un solo operatore.


## 7. Scelta del nome

Metodo: per ciascun candidato ho cercato la frase esatta tra virgolette su DuckDuckGo aperto in Chrome, nelle tre localizzazioni (us-en, jp-jp, cn-zh), sia in alfabeto latino sia nella forma katakana e hanzi proposta. DuckDuckGo non mostra un totale di risultati: il numero riportato e' quello dei risultati organici della prima pagina che contengono la frase esatta, e 0 significa che il motore risponde "nessun risultato". Google da automazione risponde con la pagina "sorry" e non e' stato usato. Domini verificati via RDAP Verisign. Handle verificati solo sull'URL pubblico. Dati in names_ddg_exact.csv e names_check.csv.

Avviso sul dominio: RDAP Verisign il 4 ottobre 2026 da' hiredriverjapan.com e prodriverjapan.com come NON registrati. Se hai gia' comprato hiredriverjapan.com nelle ultime ore e' propagazione; altrimenti registralo adesso, e con lui prodriverjapan.com come difesa. driverjapan.com e' invece registrato e driverjapanservice.com ("DRIVER Japan") e' un servizio chauffeur attivo a Tokyo, secondo in prima pagina per "english speaking driver tokyo": qualunque nome del tipo "... Driver Japan" convive con quel marchio.

### 7.1 Lettura nelle tre lingue

| Candidato | Katakana e come suona a un giapponese | Nome cinese (senso) e trascrizione fonetica, con controllo omofoni | Inglese e pronunciabilita' |
|---|---|---|---|
| Hire Driver Japan | ハイヤードライバージャパン. Un giapponese legge ハイヤー solo nel senso di haiyaa (auto con autista), mai come "assumere". ハイヤードライバー e' un titolo di lavoro esistente: i suggest restituiscono ハイヤードライバー 求人, 年収, とは. Aiuta: il brand coincide con una query reale. Confonde solo chi legge in inglese e capisce "hire a driver" (intento turistico) | Senso: 日本专业司机 (rìběn zhuānyè sījī, autisti professionisti del Giappone); la traduzione letterale 日本包车司机 esiste come frase generica (2 risultati, pagine di annunci) ma 包车 significa noleggio turistico, non B2B. Fonetica: 海尔德赖弗 da evitare, 海尔 e' il marchio Haier. Mandarino e cantonese: 专业 e 司机 sono parole di uso commerciale, nessun omofono negativo (controllo mio, non di un madrelingua) | "Hire Driver Japan", tre parole piane, facile al telefono. Ambiguo tra "autisti per hire car" e "assumi un autista", ambiguita' utile per la SEO B2B |
| Pro Driver Japan | プロドライバージャパン. プロドライバー e' termine corrente per autisti professionisti di camion, bus e taxi: lettura immediata e positiva, ma allarga al trasporto merci | Senso: 日本专业司机 (identico al precedente, e' la traduzione naturale di "pro driver"). Fonetica: 普罗德赖弗, inutile. Pulito in mandarino e cantonese | Facile, corto, generico |
| Global Driver Japan | グローバルドライバージャパン. Lettura neutra da azienda; グローバル e' abusato e non evoca la lingua | Senso: 日本国际司机 (guójì, internazionale) o 环球司机. Fonetica 格洛宝 inutile. Pulito | Facile, anonimo |
| Driver Pool Japan | ドライバープールジャパン. プール per il pubblico e' la piscina; nelle risorse umane 人材プール esiste, quindi i responsabili HR capiscono, gli autisti no | Senso: 日本司机库 (kù, bacino; 人才库 e' termine HR standard). Fonetica 德赖弗普尔 inutile. 库 fu3 in cantonese pulito | Facile; "pool" dice bene il modello B2B |
| Multilingual Driver Japan | マルチリンガルドライバージャパン. 16 more, troppo lungo; マルチリンガル e' capito ma la query reale e' 多言語, non マルチリンガル | Senso: 日本多语司机, piu' naturale 日本多语种司机. Pulito | Lungo, 8 sillabe prima di "Japan" |
| Bilingual Driver Japan | バイリンガルドライバージャパン. バイリンガル e' parola comune; km chiama il suo servizio バイリンガルタクシー. Dice "due lingue", limita | Senso: 日本双语司机 (shuāngyǔ): naturale, 双 e' carattere di buon augurio. Il piu' pulito dei dieci in cinese | Facile |
| Driver Link Japan | ドライバーリンクジャパン. Neutro, non dice niente del servizio | Senso: 日本司机连线 (liánxiàn). Fonetica 林克 (e' il nome di Link di Zelda, innocuo). Pulito ma vuoto | Facile; la ricerca esatta porta a Link ECU (centraline), rumore |
| Nishu Drivers (二種ドライバーズ) | 二種ドライバーズ. Chi lavora nel settore capisce all'istante (二種免許); il pubblico no; in romaji "Nishu" e' illeggibile per uno straniero | Senso: 日本二种司机. Fuori dal Giappone 二种 non significa nulla, e 二 da solo nel parlato del nord vale "sciocco" (你很二): rischio di lettura negativa | Difficile da pronunciare per anglofoni e cinesi |
| Global Chauffeur Japan | グローバルショーファージャパン. ショーファー e' raro in giapponese (lo usa Driven), suona premium ma la query reale e' ドライバー | Senso: 日本国际礼宾司机 (lǐbīn, di protocollo): premium e pulito, ma lungo | "Chauffeur" si scrive male al telefono |
| Omotenashi Drivers | おもてなしドライバーズ. Caldo, turistico, abusato nel marketing inbound. "Omotenashi Drivers" e' gia' usato in modo generico (Fujikyu taxi, tabiiro) | Senso: 待客司机 (dàikè, ospitalita'); 待 da solo e' "aspettare", lettura un po' ambigua. Cantonese doi6 haak3 pulito | Pronunciabile ma lungo; sapore B2C, non B2B |

### 7.2 Verifiche

| Candidato | DDG esatto en / ja romaji / ja kana / zh romaji / zh hanzi | Marchio nei trasporti in Giappone | Dominio .com (RDAP) | Instagram / X / LINE ID / WeChat |
|---|---|---|---|---|
| Hire Driver Japan | 0 / 0 / 0 / 0 / 2 (日本包车司机, annunci generici) | J-PlatPat raggiungibile ma solo via form JavaScript: da verificare manualmente. Sul web nessun marchio con questo nome; vicini: Hire Taxi Japan, Hire Car Japan, DRIVER Japan | hiredriverjapan.com non registrato alla data | non verificabile / libero (x.com risponde 404) / non verificabile / non verificabile |
| Pro Driver Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente; nessuna traccia web | prodriverjapan.com non registrato | non verificabile / libero / non verificabile / non verificabile |
| Global Driver Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente | libero | come sopra |
| Driver Pool Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente | libero | come sopra |
| Multilingual Driver Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente | libero | come sopra |
| Bilingual Driver Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente | libero | come sopra |
| Driver Link Japan | 0 / 0 / 0 / 0 / 0 (risultati parziali verso linkecu.co.jp) | da verificare manualmente | libero | come sopra |
| Nishu Drivers | 0 / 0 / 0 / 0 / 0 (un post Instagram con corrispondenza parziale) | da verificare manualmente | nishudrivers.com libero | come sopra |
| Global Chauffeur Japan | 0 / 0 / 0 / 0 / 0 | da verificare manualmente | libero | come sopra |
| Omotenashi Drivers | 2 / 2 / 0 / 2 / 0 (uso generico su fujiq-taxi.jp e tabiiro.travel) | da verificare manualmente; il termine おもてなしドライバー e' usato da associazioni taxi | libero | come sopra |

Nota sugli handle: Instagram risponde 200 con una pagina generica sia per profili esistenti sia per inesistenti, quindi non e' verificabile senza login; X risponde 404 per tutti e dieci, segno che l'handle e' libero, ma X serve la pagina via JavaScript e il 404 va confermato a mano; LINE e WeChat non espongono l'ID via URL pubblico.

### 7.3 Punteggi

| Candidato | SEO | Lettura giapponese | Lettura cinese | Memorabilita' | Totale |
|---|---|---|---|---|---|
| Hire Driver Japan | 5 | 5 | 3 | 4 | 17 |
| Pro Driver Japan | 4 | 5 | 4 | 3 | 16 |
| Bilingual Driver Japan | 4 | 4 | 5 | 3 | 16 |
| Nishu Drivers | 3 | 5 | 2 | 4 | 14 |
| Global Driver Japan | 3 | 3 | 4 | 2 | 12 |
| Omotenashi Drivers | 2 | 4 | 3 | 3 | 12 |
| Driver Pool Japan | 3 | 2 | 3 | 3 | 11 |
| Global Chauffeur Japan | 3 | 2 | 4 | 2 | 11 |
| Multilingual Driver Japan | 3 | 2 | 3 | 2 | 10 |
| Driver Link Japan | 2 | 3 | 3 | 2 | 10 |

Criteri: SEO premia la coincidenza con query reali (ハイヤードライバー, プロドライバー, english speaking driver) e penalizza il rumore (Link ECU, uso generico di Omotenashi); lettura giapponese premia i termini gia' in uso nel settore; lettura cinese premia caratteri commerciali comuni e penalizza 二 e la confusione con 包车; memorabilita' penalizza la lunghezza.

### 7.4 Raccomandazione

Nome del brand: Hire Driver Japan. E' l'unico candidato in cui la lettura giapponese e' una query di lavoro reale (ハイヤードライバー) e la lettura inglese descrive il servizio dal lato dell'operatore che assume. Il punto debole e' il cinese, e si risolve non traducendo il nome ma affiancandogli un descrittore.

- Dominio: hiredriverjapan.com, da registrare o confermare subito, piu' prodriverjapan.com come difesa e redirect.
- Forma katakana per il logo: ハイヤードライバージャパン, con la riga latina "Hire Driver Japan" come elemento principale e il katakana sotto, cosi' la pagina giapponese contiene la query esatta nel brand.
- Forma hanzi per il logo e per Baidu: 日本专业司机, senza 包车. Nel title cinese aggiungere 二种驾照 e 双语, che sono le parole che il lettore cinese in Giappone cerca.
- Marchio: il nome e' descrittivo, quindi la registrazione in classe 35 e 39 proteggera' soprattutto il logo; la ricerca su J-PlatPat resta da fare a mano.

Tagline:
- EN: Licensed multilingual drivers for Japan's hire and taxi operators.
- JA: 外国語で接客できる二種免許ドライバーを、ハイヤー会社とタクシー会社へ。
- ZH: 为日本的包车与出租车公司输送持二种驾照的多语司机。

Seconda scelta se vuoi partire dal mercato cinese: Bilingual Driver Japan, 日本双语司机, バイリンガルドライバージャパン.


## Appendice A. Prime 40 keyword pertinenti per lingua (ordinate per punteggio proxy per aderenza)

Legenda: fonti = numero di motori distinti in cui compare; seed = numero di seed distinti che la generano; lato = a chi appartiene la ricerca secondo le regole lessicali; Trends = media 12 mesi (relativa al gruppo di 5 in cui e' stata misurata) oppure non disponibile.

### Giapponese

| Keyword | Intento | Lato | Flag legale | Fonti | Seed | Trends 12m |
|---|---|---|---|---|---|---|
| 二種免許 英語 | generico | indefinito |  | 2 | 2 | non disponibile |
| タクシー go 英語 | generico | indefinito |  | 2 | 1 | non disponibile |
| タクシー 英語 求人 | assunzione | autista |  | 2 | 1 | 2.0 |
| ハイヤー 英語 | generico | indefinito |  | 2 | 1 | 0.1 |
| ハイヤー 英語 求人 | assunzione | autista |  | 2 | 1 | non disponibile |
| 二種免許 外国人 | generico | indefinito |  | 2 | 1 | 0.0 |
| 英語 タクシー | generico | indefinito |  | 2 | 1 | 79.2 |
| 英語 タクシー 求人 | assunzione | autista |  | 2 | 1 | non disponibile |
| 英語 タクシー 行き先 | generico | indefinito |  | 2 | 1 | non disponibile |
| 英語 タクシーに乗る | generico | indefinito |  | 2 | 1 | non disponibile |
| 英語 タクシーを呼ぶ | generico | indefinito |  | 2 | 1 | non disponibile |
| 英語 タクシーを呼んでください | generico | indefinito |  | 2 | 1 | non disponibile |
| タクシー ドライバー 英語 求人 | assunzione | autista |  | 1 | 3 | non disponibile |
| ハイヤー ドライバー 英語 | generico | indefinito |  | 1 | 3 | non disponibile |
| 大丈夫です、タクシーに乗ります 英語 | generico | indefinito |  | 1 | 3 | non disponibile |
| ハイヤー ドライバー 求人 | assunzione | autista |  | 2 | 2 | non disponibile |
| ハイヤー・アンド・ハイヤー | generico | indefinito |  | 1 | 4 | non disponibile |
| タクシー ドライバー 英語 フレーズ | generico | indefinito |  | 1 | 2 | non disponibile |
| タクシー ドライバー 英語 勉強 法 | generico | indefinito |  | 1 | 2 | non disponibile |
| タクシー 英語 対応 求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| タクシー 運転 手 英語 求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| タクシー求人英語 | assunzione | autista |  | 1 | 2 | non disponibile |
| ハイヤー タクシー 英語 | generico | indefinito |  | 1 | 2 | non disponibile |
| ハイヤー 運転手 英語 | generico | indefinito |  | 1 | 2 | non disponibile |
| ハイヤー英語求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| 京都 タクシー 求人 英語 | assunzione | autista |  | 1 | 2 | non disponibile |
| 東京 タクシー 英語 求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| 英語 タクシー ドライバー 年収 | assunzione | autista |  | 1 | 2 | non disponibile |
| 英語ハイヤー求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| 観光 タクシー 英語 求人 | assunzione | autista |  | 1 | 2 | non disponibile |
| ハイヤー ドライバー | generico | indefinito |  | 2 | 1 | 0.7 |
| ハイヤー 乗務員 | generico | indefinito |  | 2 | 1 | non disponibile |
| ハイヤー 乗務員証 | generico | indefinito |  | 2 | 1 | non disponibile |
| ハイヤー 求人 | assunzione | autista |  | 2 | 1 | 0.9 |
| ハイヤー 求人 千葉 | assunzione | autista |  | 2 | 1 | non disponibile |
| ハイヤー 求人 大阪 | assunzione | autista |  | 2 | 1 | non disponibile |
| ハイヤー 求人 東京 | assunzione | autista |  | 2 | 1 | non disponibile |
| 二種免許 at限定 | generico | indefinito |  | 2 | 1 | non disponibile |
| 二種免許 at限定解除 | generico | indefinito |  | 2 | 1 | non disponibile |
| 二種免許 mt | generico | indefinito |  | 2 | 1 | non disponibile |

### Cinese

| Keyword | Intento | Lato | Flag legale | Fonti | Seed | Trends 12m |
|---|---|---|---|---|---|---|
| 日本包车 | acquisto_servizio | turista |  | 4 | 4 | 0.0 |
| 日本包车一天多少钱 | acquisto_servizio | turista |  | 4 | 4 | non disponibile |
| 日本出租车司机招聘条件 | assunzione | autista |  | 1 | 9 | non disponibile |
| 日本包车公司 | acquisto_servizio | turista |  | 4 | 1 | non disponibile |
| 日本包车旅游 | acquisto_servizio | turista |  | 4 | 1 | non disponibile |
| 日本包车游 | acquisto_servizio | turista |  | 3 | 2 | non disponibile |
| 日本包车游哪个平台好 | acquisto_servizio | turista |  | 2 | 4 | non disponibile |
| 日本旅游包车 | acquisto_servizio | turista |  | 2 | 4 | non disponibile |
| 东京 包车 中文 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| 日本 包车 中文 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| 东京包车服务 | acquisto_servizio | turista |  | 3 | 1 | non disponibile |
| 日本包车推荐 | acquisto_servizio | turista |  | 3 | 1 | non disponibile |
| 日本包车服务 | acquisto_servizio | turista |  | 3 | 1 | non disponibile |
| 日本包车自由行 | acquisto_servizio | turista |  | 3 | 1 | non disponibile |
| 日本包车车型 | acquisto_servizio | turista |  | 3 | 1 | non disponibile |
| 东京包车 | acquisto_servizio | turista |  | 2 | 3 | non disponibile |
| 日本包车价格 | acquisto_servizio | turista |  | 2 | 3 | non disponibile |
| 日本东京包车价格 | acquisto_servizio | turista |  | 1 | 5 | non disponibile |
| 日本司机工资一般多少 | assunzione | autista |  | 2 | 9 | non disponibile |
| 东京包车一天多少钱 | acquisto_servizio | turista |  | 2 | 2 | non disponibile |
| 日本包车司机 | acquisto_servizio | turista |  | 2 | 2 | non disponibile |
| 日本包车司机小费 | acquisto_servizio | turista |  | 2 | 2 | non disponibile |
| 日本包车网站 | acquisto_servizio | turista |  | 2 | 2 | non disponibile |
| 在日本东京请一位全职司机多少钱 | acquisto_servizio | autista |  | 1 | 10 | non disponibile |
| 日本劳务司机招聘网站 | assunzione | operatore | si | 1 | 10 | non disponibile |
| 日本包车一天10小时多少钱啊 | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| 日本包车一般都是什么价格 | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| 日本包车平台 | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| 日本包车平台app | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| 日本包车联系方式 | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| 日本司机工作时间 | generico | indefinito |  | 3 | 5 | non disponibile |
| 去日本做司机工资高吗 | assunzione | autista |  | 1 | 9 | non disponibile |
| kkday 东京 包车 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| kkday 东京包车一日游 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| kkday 日本 包车 ptt | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| kkday 日本包车一日游 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| klook 东京 包车 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| klook 日本 包车 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| klook 日本 包车 评价 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| 东京 到 富士山 包车 | acquisto_servizio | turista |  | 2 | 1 | non disponibile |

### Inglese

| Keyword | Intento | Lato | Flag legale | Fonti | Seed | Trends 12m |
|---|---|---|---|---|---|---|
| private car hire with driver japan | acquisto_servizio | turista |  | 1 | 6 | non disponibile |
| best chauffeur tours in tokyo | generico | turista |  | 1 | 4 | non disponibile |
| high end chauffeur tours of tokyo | generico | turista |  | 1 | 4 | non disponibile |
| driver of the day japan | generico | indefinito |  | 2 | 7 | non disponibile |
| personal driver in japan | generico | indefinito |  | 2 | 7 | non disponibile |
| tokyo chauffeur service | acquisto_servizio | turista |  | 2 | 1 | non disponibile |
| hiring a private driver in japan | assunzione | autista |  | 1 | 8 | non disponibile |
| private driver in tokyo | generico | turista |  | 1 | 8 | non disponibile |
| uk driver in japan | generico | indefinito |  | 1 | 8 | non disponibile |
| best chauffeur tours in japan | generico | turista |  | 1 | 3 | non disponibile |
| japan driver for hire | acquisto_servizio | indefinito |  | 1 | 3 | non disponibile |
| taxi driver jobs in japan for foreigners | assunzione | autista |  | 1 | 1 | non disponibile |
| private driver in japan | generico | turista |  | 1 | 6 | non disponibile |
| chauffeur service tokyo japan | acquisto_servizio | turista |  | 1 | 2 | non disponibile |
| english speaking driver in japan | generico | indefinito |  | 1 | 2 | non disponibile |
| english speaking driver japan | generico | indefinito |  | 1 | 2 | 0.0 |
| japan driver hire | acquisto_servizio | indefinito |  | 1 | 2 | non disponibile |
| japan driver jobs for foreigners | assunzione | autista |  | 1 | 2 | non disponibile |
| driver japan company limited | generico | indefinito |  | 2 | 2 | non disponibile |
| japan driver test | generico | indefinito |  | 2 | 2 | non disponibile |
| car rental with driver in japan | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| rent a car with driver in tokyo | acquisto_servizio | turista |  | 1 | 4 | non disponibile |
| average salary of taxi driver in japan | generico | autista |  | 1 | 1 | non disponibile |
| best chauffeur service tokyo | acquisto_servizio | turista |  | 1 | 1 | non disponibile |
| blacklane chauffeur japan | generico | indefinito |  | 1 | 1 | non disponibile |
| blacklane chauffeur tokyo | generico | indefinito |  | 1 | 1 | non disponibile |
| bus driver jobs in japan for foreigners | assunzione | autista |  | 1 | 1 | non disponibile |
| can you hire a driver in japan | acquisto_servizio | turista |  | 1 | 1 | non disponibile |
| can you hire a personal driver in japan | acquisto_servizio | turista |  | 1 | 1 | non disponibile |
| car driver jobs in japan for foreigners with visa sponsorship | assunzione | autista |  | 1 | 1 | non disponibile |
| chauffeur companies in japan | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur driver japan | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur driver tokyo | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur in japan | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur in japanese | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur in tokyo | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur japan | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur japanese | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur prive tokyo | generico | indefinito |  | 1 | 1 | non disponibile |
| chauffeur service in japan | acquisto_servizio | turista |  | 1 | 1 | non disponibile |

### Keyword con flag legale (tutte, anche non pertinenti)

| Keyword | Lingua | Intento | Fonti |
|---|---|---|---|
| ハイヤー ドライバー 派遣 | ja | generico | 1 |
| ハイヤー ドライバー派遣 | ja | generico | 1 |
| ハイヤードライバー派遣 | ja | generico | 1 |
| 役員車 運転手 派遣 | ja | generico | 1 |
| 役員運転手 派遣 料金 | ja | acquisto_servizio | 1 |
| 役員運転手派遣 | ja | generico | 1 |
| 役員運転手派遣 料金 | ja | acquisto_servizio | 1 |
| 役員運転手派遣会社 | ja | generico | 1 |
| 社用車 運転手 派遣 | ja | generico | 1 |
| 社用車 運転手派遣 | ja | generico | 1 |
| ドライバー 紹介 予定 派遣 | ja | acquisto_servizio | 1 |
| ドライバー 紹介予定派遣 | ja | acquisto_servizio | 1 |
| 大阪 派遣 トラック運転手 ドライバー 求人 | ja | assunzione | 1 |
| 日本劳务司机招聘网站 | zh | assunzione | 1 |