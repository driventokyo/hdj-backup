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

Query di scoperta: per "ドライバー 紹介 会社 ハイヤー" la prima pagina e' fatta di articoli comparativi (nikko-yokohama, fiit.jp, colorful-career, x-work) e dalla pagina ドライバー派遣 di 日本交通; per "タクシー 乗務員 転職 エージェント" e' tutta di agenzie e comparatori (タク助NEXT, P-CHAN TAXI, asiro, crexgroup). Nessuno dei due spazi ha un attore specializzato in autisti multilingue.

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

- Parola per l'autista: in giapponese ドライバー nel marketing, 乗務員 nel recruiting e nei documenti, 運転手 solo nei title "per i clienti" (km, Driven). In inglese "chauffeur" per il premium B2C, "driver" per il resto; "English-speaking driver" e' la formula ricorrente, e la sigla ESD esiste gia' (Kokusai). In cinese 司机, mai 司機 semplificato a parte easytraveljapan.
- Nome del servizio per stranieri: 英語対応ドライバー (la formula piu' usata in meta description), 外国語対応, バイリンガルタクシー (km), 多言語対応 (Driven, NASH). "インバウンド対応" non compare in nessun title della prima pagina: e' linguaggio da convegno, non da ricerca.
- Forma contrattuale: nessun sito di servizio la dichiara al cliente. I due leader vendono "ドライバー派遣" ai clienti aziendali ma lo strutturano come 運行管理請負 (appalto), e lo dicono nella meta description: e' il segnale che il mercato sa che il termine 派遣 e' delicato. I siti di recruiting dichiarano 正社員 e 月給保証; il part time compare poco e il 兼業 mai.
- Spazio vuoto: nessun sito in prima pagina, in nessuna delle tre lingue, offre autisti multilingue con 二種 a operatori hire o taxi. Le query B2B esistono (ドライバー 紹介 会社 ハイヤー ha 10 risultati competitivi) ma sono servite da articoli comparativi e da un solo operatore.
