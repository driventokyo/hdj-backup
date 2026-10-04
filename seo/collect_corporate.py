# -*- coding: utf-8 -*-
"""Giro aggiuntivo lato aziende (il modello e' cambiato il 4/10): Google ja suggest, seed + hiragana + intento. Accoda a keywords_raw.csv."""
import csv, random, threading, time, requests, warnings; warnings.filterwarnings("ignore")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36"
SEEDS = ["役員運転手", "社用車 運転手", "専属運転手", "運転手 スポット", "運転手 派遣 法人", "役員車 運転", "運転業務 委託", "英語 運転手 派遣"]
HIRA = list("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ")
INT = ["料金", "相場", "東京", "英語", "時間", "1日", "会社", "求人"]
lock = threading.Lock(); rows = []
def work(seeds):
    for s in seeds:
        for q in [s] + [s + h for h in HIRA] + [s + " " + w for w in INT]:
            for a in range(4):
                try:
                    r = requests.get("https://suggestqueries.google.com/complete/search", params={"client": "firefox", "hl": "ja", "gl": "jp", "q": q}, headers={"User-Agent": UA}, timeout=15)
                    if r.status_code in (429, 503): time.sleep(5 * (a + 1)); continue
                    with lock: rows.extend((k.strip().lower(), "ja", "google_ja_jp", s) for k in r.json()[1])
                    break
                except Exception: time.sleep(3)
            time.sleep(random.uniform(1.5, 2.0))
ts = [threading.Thread(target=work, args=(SEEDS[i::4],)) for i in range(4)]
[t.start() for t in ts]; [t.join() for t in ts]
uniq = sorted(set(rows))
with open("keywords_raw.csv", "a", newline="", encoding="utf-8") as f: csv.writer(f).writerows(uniq)
with open("seeds.csv", "a", newline="", encoding="utf-8") as f: csv.writer(f).writerows([(s, "ja", "derivato_aziende") for s in SEEDS])
print("aggiunte", len(uniq))
