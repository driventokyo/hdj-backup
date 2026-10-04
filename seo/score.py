# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Da keywords_raw.csv a keywords_scored.csv: dedup, intento, flag legale, numero fonti (proxy volume), join Trends."""
import csv, re, os, collections, json
import pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
raw = pd.read_csv(os.path.join(HERE, "keywords_raw.csv"), dtype=str).fillna("")
raw["keyword"] = raw["keyword"].str.strip()
raw = raw[raw["keyword"] != ""]
HIRE = re.compile(r"(募集|求人|採用|転職|招聘|招募|求职|jobs?|hiring|career|vacanc|年収|給料|工资|薪)", re.I)
BUY = re.compile(r"(料金|依頼|紹介|予約|手配|値段|相場|費用|価格|包车|包車|租车|接送|价格|多少钱|hire|booking|book|price|cost|rent|charter|service|手配)", re.I)
INFO = re.compile(r"(とは|違い|なり方|なるには|取り方|取得|方法|怎么|怎样|什么|如何|how|what|requirements|guide|意味|読み方|試験|教習)", re.I)
LEGAL = re.compile(r"(派遣|外注|业务外包|業務委託|労務|劳务|freelance|freelancer|contractor|個人事業主|白タク|黑车)", re.I)
# pertinenza al servizio: deve parlare di autisti di persone in Giappone, non di cacciaviti, docenti, treni o camion
CORE = re.compile(r"(ハイヤー|タクシー|運転手|乗務員|送迎|二種|ショーファー|chauffeur|driver|司机|司機|包车|包車|接送|专车|出租车|计程车|租车.*司机|送迎)", re.I)
NOISE = re.compile(r"(工具|六角|十字|マイナス|プラス|ラチェット|ネジ|スクリュー|トルクス|精密|教員|教諭|小学校|中学校|高校|幼稚園|保育|養護|栄養|列車|電車|新幹線|鉄道|レース|レーシング|ラリー|f1|formula|宅配|トラック|大型|中型|配送|物流|バス|dentist|doctor|teacher|teachers|nurse|golf|screwdriver|printer|drivers? (update|download|software)|nvidia|usb|license test|driving test|driving school|driver'?s? licen[cs]e|international driv|駕駛|driving in japan|drive in japan|mft|乙肝|人口|速写|午餐|电车司机|地铁|公交|货车|卡车|滴滴|人力车|左舵|右舵|哪边驾驶|怎么说|英语叫什么|英語翻訳|翻译|客室乗務員|キャビン|航空|英語 ?で$|英語 ?で |英語 ?では|英語 ?スペル|英語 ?挨拶|掛け声|英語 ?意味|英語 ?表記|英語 ?発音|英語 ?説明|英語 ?訳|セルフ英語|英語 ?言い|英語 ?何|英語 ?とは|英語表現|英語意味|英語発音|英語表記|英語説明|英語訳|言い方|英文$|how to say|如何说|怎么说|怎么翻译|英文怎么|介绍视频|jaipur|delhi|in kl|ltd|equipment|is true|是真的吗)", re.I)
NEED_JAPAN = {"en", "zh"}
JAPAN = re.compile(r"(japan|tokyo|日本|東京|东京|大阪|osaka|kyoto|京都|成田|羽田|narita|haneda)", re.I)
LANGW = re.compile(r"(英語|外国語|多言語|バイリンガル|english|bilingual|multilingual|英语|英文|双语|多语|中文|外语|外国人|インバウンド|foreign)", re.I)
def pertinente(k, lang="ja"):
    if lang in NEED_JAPAN and not JAPAN.search(k): return False
    return bool(CORE.search(k)) and not NOISE.search(k)
def aderenza(k, lang="ja"):
    if not pertinente(k, lang): return 0
    a = 1
    if LANGW.search(k): a += 1
    if re.search(r"(ハイヤー|二種|乗務員|chauffeur|hire|出租车|包车|专车|タクシー|taxi)", k, re.I): a += 1
    return min(a, 3)
OPER = re.compile(r"(紹介|派遣|人材|採用|不足|手配|依頼|請負|委託|会社|業者|法人|agency|staffing|recruit|supplier|outsourc|招司机|司机团队|人才|劳务|招募)", re.I)
AUT = re.compile(r"(求人|募集|転職|年収|給料|月給|兼業|副業|働|なるには|取得|取り方|試験|教習|費用|資格|招聘|工资|收入|待遇|条件|兼职|全职|怎么样|做司机|当司机|jobs?|salary|hiring|career|vacanc|work as|become)", re.I)
TUR = re.compile(r"(料金|予約|相場|一日|1日|観光|空港|送迎|チャーター|貸切|多少钱|价格|平台|一天|攻略|机场|接送|租车|包车|private|rent|hire a|charter|tour|airport|booking|book a|service)", re.I)
def lato(k):
    if OPER.search(k): return "operatore"
    if AUT.search(k): return "autista"
    if TUR.search(k): return "turista"
    return "indefinito"
def intent(k):
    if HIRE.search(k): return "assunzione"
    if BUY.search(k): return "acquisto_servizio"
    if INFO.search(k): return "informativo"
    return "generico"
g = raw.groupby(["keyword","lingua"]).agg(n_fonti=("fonte", lambda s: len(set(s))), fonti=("fonte", lambda s: "|".join(sorted(set(s)))),
                                          n_seed=("seed", lambda s: len(set(s))), seeds=("seed", lambda s: "|".join(sorted(set(s))[:4]))).reset_index()
g["intento"] = g["keyword"].map(intent)
g["legale_rischio"] = g["keyword"].map(lambda k: bool(LEGAL.search(k)))
g["pertinente"] = [pertinente(k, l) for k, l in zip(g["keyword"], g["lingua"])]
g["aderenza"] = [aderenza(k, l) for k, l in zip(g["keyword"], g["lingua"])]
g["lato"] = g["keyword"].map(lato)
# proxy di domanda: fonti distinte + seed distinti (una keyword che compare da piu' seed e piu' motori e' piu' consolidata)
g["punteggio_proxy"] = g["n_fonti"] * 2 + g["n_seed"]
g["punteggio_finale"] = g["punteggio_proxy"] * g["aderenza"]
tp = os.path.join(HERE, "trends.csv"); rp = os.path.join(HERE, "related.csv")
if os.path.exists(tp):
    t = pd.read_csv(tp, dtype=str).fillna("")
    g = g.merge(t[["keyword","media_12m","max_12m","ultimo_mese_vs_media"]], on="keyword", how="left")
else:
    g["media_12m"] = ""; g["max_12m"] = ""; g["ultimo_mese_vs_media"] = ""
if os.path.exists(rp):
    r = pd.read_csv(rp, dtype=str).fillna("")
    g = g.merge(r[["keyword","related_top5"]], on="keyword", how="left")
else:
    g["related_top5"] = ""
for c in ("media_12m","max_12m","ultimo_mese_vs_media","related_top5"):
    g[c] = g[c].fillna("non disponibile") if c != "related_top5" else g[c].fillna("")
g = g.rename(columns={"media_12m":"trend_media_12m","max_12m":"trend_max_12m","ultimo_mese_vs_media":"trend_ultimo_mese_vs_media"})
g = g.sort_values(["lingua","punteggio_finale","punteggio_proxy"], ascending=[True, False, False])
g.to_csv(os.path.join(HERE, "keywords_scored.csv"), index=False, encoding="utf-8")
print(g.groupby("lingua").size().to_dict(), "righe totali", len(g))
print(g.groupby(["lingua","intento"]).size().to_dict())
print("flag legale:", int(g["legale_rischio"].sum()), "| pertinenti:", int(g["pertinente"].sum()))
print(g[g.pertinente].groupby(["lingua","lato"]).size().to_dict())
