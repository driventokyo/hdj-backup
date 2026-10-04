# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Assembla report.md dalle parti, aggiunge romaji ai termini giapponesi nella prosa, elimina em dash ed en dash, genera l'appendice."""
import re, os, csv, collections
import pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: open(os.path.join(HERE, "parts", n), encoding="utf-8").read()

# termini giapponesi -> romaji (ordine: prima i termini lunghi)
ROMAJI = [
 ("運行管理請負","unkou kanri ukeoi"),("旅客自動車運送事業運輸規則","ryokaku jidousha unsou jigyou unyu kisoku"),("有料職業紹介","yuuryou shokugyou shoukai"),
 ("労働者派遣","roudousha haken"),("ドライバー派遣","doraibaa haken"),("ハイヤードライバー","haiyaa doraibaa"),("バイリンガルタクシー","bairingaru takushii"),
 ("英語対応ドライバー","eigo taiou doraibaa"),("外国語対応","gaikokugo taiou"),("多言語対応","tagengo taiou"),("英語対応","eigo taiou"),("インバウンド対応","inbaundo taiou"),
 ("人材紹介","jinzai shoukai"),("空港送迎","kuukou sougei"),("役員車","yakuinsha"),("二種免許","nishu menkyo"),("一種免許","isshu menkyo"),("二種","nishu"),
 ("ハイヤー","haiyaa"),("タクシー","takushii"),("ドライバー","doraibaa"),("乗務員","joumuin"),("運転手","untenshu"),("ショーファー","shoofaa"),
 ("派遣","haken"),("紹介","shoukai"),("求人","kyuujin"),("募集","boshuu"),("採用","saiyou"),("転職","tenshoku"),("兼業","kengyou"),("副業","fukugyou"),
 ("正社員","seishain"),("契約社員","keiyaku shain"),("月給","gekkyuu"),("歩合","buai"),("業務委託","gyoumu itaku"),("個人事業主","kojin jigyounushi"),
 ("外国人","gaikokujin"),("外国語","gaikokugo"),("多言語","tagengo"),("英語","eigo"),("中国語","chuugokugo"),("インバウンド","inbaundo"),("送迎","sougei"),
 ("貸切","kashikiri"),("観光","kankou"),("料金","ryoukin"),("白タク","shirotaku"),("名義貸し","meigi gashi"),("選任","sennin"),("おもてなし","omotenashi"),
 ("東京","Toukyou"),("日本交通","Nihon Koutsuu"),("国際ハイヤー","Kokusai Haiyaa"),("国際自動車","Kokusai Jidousha"),("日の丸","Hinomaru"),
]
JP = re.compile(r"[\u3040-\u30ff\u4e00-\u9fff]")
JPC = "\u3040-\u30ff\u4e00-\u9fff"
def romanize_segment(seg):
    marks = []
    for kanji, roma in sorted(ROMAJI, key=lambda x: -len(x[0])):
        pat = re.compile(r"(?<![%s(])%s(?![%s)])" % (JPC, re.escape(kanji), JPC))
        def rep(m, roma=roma, kanji=kanji):
            marks.append(f"{roma} ({kanji})"); return f"\u0001{len(marks)-1}\u0002"
        seg = pat.sub(rep, seg)
    return re.sub(r"\u0001(\d+)\u0002", lambda m: marks[int(m.group(1))], seg)
def romanize_line(line):
    # solo prosa: niente tabelle, codice, righe quasi tutte in giapponese, frasi tra virgolette
    if line.startswith("|") or line.startswith("```") or line.startswith("    "): return line
    jp = len(JP.findall(line))
    if jp and jp / max(1, len(line.strip())) > 0.4: return line
    parts = re.split(r'("[^"]*"|「[^」]*」)', line)
    return "".join(x if (x.startswith('"') or x.startswith("「")) else romanize_segment(x) for x in parts)
def romanize(text):
    return "\n".join(romanize_line(l) for l in text.split("\n"))

def summary():
    raw = pd.read_csv(os.path.join(HERE, "keywords_raw.csv"), dtype=str).fillna("")
    sc = pd.read_csv(os.path.join(HERE, "keywords_scored.csv"), dtype=str).fillna("")
    by_src = raw.groupby("fonte").size().to_dict()
    by_lang = sc.groupby("lingua").size().to_dict()
    pert = sc[sc.pertinente == "True"].groupby("lingua").size().to_dict()
    prog = sum(1 for _ in open(os.path.join(HERE, "progress.log"), encoding="utf-8")) if os.path.exists(os.path.join(HERE, "progress.log")) else 0
    lines = ["Sommario della raccolta:", "",
             "| Fonte | Suggerimenti raccolti (righe grezze) |", "|---|---|"]
    for k, v in sorted(by_src.items()): lines.append(f"| {k} | {v} |")
    lines += ["| yahoo_jp | non disponibile (endpoint pubblico risponde HTML, API con appid) |", "| rakko (related-keywords.com) | non usato, robots.txt vieta /result/ |", "",
              f"Query inviate ai suggest: {prog}. Keyword uniche dopo normalizzazione: " + ", ".join(f"{l} {n}" for l, n in sorted(by_lang.items())) +
              ". Di queste, pertinenti al servizio dopo il filtro: " + ", ".join(f"{l} {n}" for l, n in sorted(pert.items())) + "."]
    return "\n".join(lines)

def appendix():
    sc = pd.read_csv(os.path.join(HERE, "keywords_scored.csv"), dtype=str).fillna("")
    sc = sc[sc.pertinente == "True"].copy()
    sc["pf"] = sc["punteggio_finale"].astype(int)
    out = ["## Appendice A. Prime 40 keyword pertinenti per lingua (ordinate per punteggio proxy per aderenza)", "",
           "Legenda: fonti = numero di motori distinti in cui compare; seed = numero di seed distinti che la generano; lato = a chi appartiene la ricerca secondo le regole lessicali; Trends = media 12 mesi (relativa al gruppo di 5 in cui e' stata misurata) oppure non disponibile.", ""]
    for lang, name in (("ja","Giapponese"),("zh","Cinese"),("en","Inglese")):
        d = sc[sc.lingua == lang].sort_values(["pf","n_fonti"], ascending=False).head(40)
        out += [f"### {name}", "", "| Keyword | Intento | Lato | Flag legale | Fonti | Seed | Trends 12m |", "|---|---|---|---|---|---|---|"]
        for _, r in d.iterrows():
            tr = r["trend_media_12m"] if r["trend_media_12m"] not in ("", "nan") else "non disponibile"
            out.append(f"| {r.keyword} | {r.intento} | {r.lato} | {'si' if r.legale_rischio=='True' else ''} | {r.n_fonti} | {r.n_seed} | {tr} |")
        out.append("")
    leg = sc[sc.legale_rischio == "True"]
    allsc = pd.read_csv(os.path.join(HERE, "keywords_scored.csv"), dtype=str).fillna("")
    leg = allsc[allsc.legale_rischio == "True"]
    out += ["### Keyword con flag legale (tutte, anche non pertinenti)", "", "| Keyword | Lingua | Intento | Fonti |", "|---|---|---|---|"]
    for _, r in leg.iterrows(): out.append(f"| {r.keyword} | {r.lingua} | {r.intento} | {r.n_fonti} |")
    return "\n".join(out)

parts = [P("intro.md").replace("{{SOMMARIO_RACCOLTA}}", summary()), P("keywords.md"), P("limits.md"), P("benchmark.md"), P("names.md"), appendix()]
text = "\n\n".join(parts)
text = romanize(text)
text = text.replace("—", ",").replace("–", ",").replace(" ,", ",")
open(os.path.join(HERE, "report.md"), "w", encoding="utf-8").write(text)
print("report.md", len(text.split()), "parole; dash residui:", text.count("—") + text.count("–"))
