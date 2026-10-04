# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Raccolta keyword da suggest gratuiti (Google, Baidu, Bing, Yahoo Japan).
Output: keywords_raw.csv (keyword, lingua, fonte, seed), errors.log
Una richiesta ogni 1.5~2 s per fonte, retry con backoff su 429/503."""
import csv, json, os, random, re, sys, threading, time, unicodedata
import warnings; warnings.filterwarnings("ignore")
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "keywords_raw.csv")
ERR = os.path.join(HERE, "errors.log")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"

# Seed originali del brief (prefisso nessuno) + seed derivati a 1~2 parole (gli originali a 3 parole
# non hanno autocompletamento: Google risponde [] ). I derivati sono marcati in seeds.csv.
SEEDS = {
 "ja": ["英語対応 ハイヤー ドライバー","外国語対応 乗務員","インバウンド対応 ドライバー","英語が話せる 運転手","外国人VIP 送迎","二種免許 英語","多言語 ドライバー 東京","登録ドライバー ハイヤー","ハイヤー 乗務員 兼業","ハイヤー ドライバー 紹介","外国語 ドライバー 不足","英語 タクシー 運転手 東京"],
 "zh": ["日本 包车 司机 英语","东京 英语司机","日本 二种驾照 司机","日本 专车司机 多语种","日本 高端接送 司机","日本 司机 兼职","东京 旅游 用车 司机 招聘","日本 包车 公司 招司机"],
 "en": ["english speaking driver japan","english speaking driver tokyo","professional driver japan","multilingual chauffeur tokyo","hire driver japan","bilingual driver jobs japan","chauffeur jobs tokyo english"],
}
DERIVED = {
 "ja": ["ハイヤー ドライバー","ハイヤー 乗務員","ハイヤー 英語","英語 運転手","英語 ドライバー","外国語 ドライバー","インバウンド ドライバー","二種免許","二種免許 外国人","多言語 ドライバー","外国人 送迎","VIP 送迎","英語 タクシー","ドライバー 紹介","乗務員 兼業","ハイヤー 求人","タクシー 英語 求人"],
 "zh": ["日本 包车","日本 司机","东京 司机","日本 司机 招聘","日本 包车 司机","日本 二种驾照","东京 包车","日本 专车"],
 "en": ["english driver japan","driver japan","chauffeur tokyo","chauffeur japan","driver jobs japan","driver jobs tokyo","bilingual driver"],
}
import csv as _csv
with open(os.path.join(HERE,"seeds.csv"),"w",newline="",encoding="utf-8") as _f:
    _w=_csv.writer(_f); _w.writerow(["seed","lingua","tipo"])
    for _l in SEEDS:
        for _s in SEEDS[_l]: _w.writerow([_s,_l,"originale"])
        for _s in DERIVED[_l]: _w.writerow([_s,_l,"derivato"])
for _l in SEEDS: SEEDS[_l] = SEEDS[_l] + DERIVED[_l]
HIRA = list("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん")
AZ = list("abcdefghijklmnopqrstuvwxyz")
INTENT = {
 "ja": ["募集","求人","料金","紹介","東京","英語","中国語"],
 "zh": ["招聘","价格","介绍","东京","英语","兼职","公司"],
 "en": ["jobs","hiring","price","agency","tokyo","english","chinese"],
}

def expansions(lang, seed):
    out = [seed]
    if lang == "ja":
        out += [seed + h for h in HIRA]
    out += [seed + " " + c for c in AZ]
    out += [seed + " " + w for w in INTENT[lang]]
    return out

def norm(s):
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s

lock = threading.Lock()
seen = set()
PROG = os.path.join(HERE, "progress.log")
done_q = set()
if os.path.exists(PROG):
    done_q = set(l.rstrip("\n") for l in open(PROG, encoding="utf-8"))
if os.path.exists(RAW):
    import csv as _c
    for _r in _c.DictReader(open(RAW, encoding="utf-8")):
        seen.add((_r["keyword"], _r["lingua"], _r["fonte"], _r["seed"]))
def mark(src, q):
    with lock:
        done_q.add(src + "\t" + q)
        with open(PROG, "a", encoding="utf-8") as f: f.write(src + "\t" + q + "\n")
def is_done(src, q):
    return (src + "\t" + q) in done_q
def write(rows):
    with lock:
        new = []
        for kw, lang, src, seed in rows:
            kw = norm(kw)
            if not kw: continue
            key = (kw, lang, src, seed)
            if key in seen: continue
            seen.add(key); new.append(key)
        if new:
            with open(RAW, "a", newline="", encoding="utf-8") as f:
                w = csv.writer(f); w.writerows(new)

def log(msg):
    with lock:
        with open(ERR, "a", encoding="utf-8") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + msg + "\n")

def get(url, params=None, headers=None, src=""):
    h = {"User-Agent": UA, "Accept-Language": "ja,en;q=0.8,zh-CN;q=0.6"}
    if headers: h.update(headers)
    delay = 5
    for attempt in range(6):
        try:
            r = requests.get(url, params=params, headers=h, timeout=20)
            if r.status_code in (429, 503, 502):
                log(f"{src} HTTP {r.status_code} attempt {attempt+1} url={r.url[:120]} -> sleep {delay}")
                time.sleep(delay); delay *= 2; continue
            return r
        except Exception as e:
            log(f"{src} EXC {type(e).__name__}: {e} attempt {attempt+1} -> sleep {delay}")
            time.sleep(delay); delay *= 2
    log(f"{src} GAVE UP url={url} params={params}")
    return None

def pause():
    time.sleep(random.uniform(1.5, 2.0))

# ---------- Google Suggest ----------
def google_worker(combos, seed_slice=None):
    total = sum(len(expansions(l, s)) for l,_,_ in combos for s in SEEDS[l])
    done = 0
    for lang, hl, gl in combos:
        src = f"google_{hl}_{gl}"
        seeds = SEEDS[lang] if seed_slice is None else SEEDS[lang][seed_slice]
        for seed in seeds:
            for q in expansions(lang, seed):
                if is_done(src, q): done += 1; continue
                r = get("https://suggestqueries.google.com/complete/search",
                        {"client":"firefox","hl":hl,"gl":gl,"q":q}, src=src)
                done += 1
                if r is not None and r.status_code == 200:
                    try:
                        data = r.json()
                        write([(k, lang, src, seed) for k in data[1]])
                    except Exception as e:
                        log(f"{src} PARSE {e} q={q}")
                elif r is not None:
                    log(f"{src} HTTP {r.status_code} q={q}")
                if r is not None: mark(src, q)
                if done % 100 == 0: print(f"[google] {done}/{total}", flush=True)
                pause()
    print("[google] done", flush=True)

# ---------- Baidu Suggest ----------
def baidu_worker():
    src = "baidu"
    for seed in SEEDS["zh"]:
        for q in expansions("zh", seed):
            if is_done(src, q): continue
            r = get("https://suggestion.baidu.com/su", {"wd": q, "cb": "cb"}, src=src)
            if r is not None and r.status_code == 200:
                try:
                    txt = r.content.decode("gbk", errors="ignore")
                    m = re.search(r's:\[(.*?)\]', txt)
                    items = re.findall(r'"(.*?)"', m.group(1)) if m else []
                    write([(k, "zh", src, seed) for k in items])
                except Exception as e:
                    log(f"{src} PARSE {e} q={q}")
            if r is not None: mark(src, q)
            pause()
    print("[baidu] done", flush=True)

# ---------- Bing Suggest ----------
def bing_expansions(lang, seed):
    # Bing: seed + a-z + parole di intento (l'espansione hiragana e' prevista dal brief solo per Google)
    return [seed] + [seed + " " + c for c in AZ] + [seed + " " + w for w in INTENT[lang]]

def bing_worker(langs=("ja","en","zh"), seed_slice=None):
    markets = {"ja":"ja-JP","en":"en-JP","zh":"zh-CN"}
    for lang in langs:
        src = f"bing_{markets[lang]}"
        seeds = SEEDS[lang] if seed_slice is None else SEEDS[lang][seed_slice]
        for seed in seeds:
            for q in bing_expansions(lang, seed):
                if is_done(src, q): continue
                r = get("https://www.bing.com/osjson.aspx", {"query": q, "market": markets[lang]}, src=src)
                if r is not None and r.status_code == 200:
                    try:
                        data = r.json()
                        write([(k, lang, src, seed) for k in data[1]])
                    except Exception as e:
                        log(f"{src} PARSE {e} q={q}")
                if r is not None: mark(src, q)
                pause()
    print("[bing] done", flush=True)

# ---------- Yahoo Japan Suggest ----------
def yahoo_worker():
    src = "yahoo_jp"
    ok = 0
    if os.path.exists(os.path.join(HERE, "errors_run1.log")):
        log(f"{src} SKIPPED: endpoint gia' verificato non disponibile nel run 1 (risponde HTML; l'API ufficiale richiede appid)"); return
    for seed in SEEDS["ja"]:
        r = get("https://search.yahoo.co.jp/ac", {"p": seed, "o": "json"}, src=src,
                headers={"Accept":"application/json"})
        if r is not None and r.status_code == 200 and r.headers.get("content-type","").startswith("application/json"):
            try:
                data = r.json()
                items = [x.get("Suggest") if isinstance(x,dict) else x for x in data.get("Result",[])]
                write([(k, "ja", src, seed) for k in items if k]); ok += 1
            except Exception as e:
                log(f"{src} PARSE {e}")
        else:
            log(f"{src} FAILED status={getattr(r,'status_code',None)} ctype={getattr(r,'headers',{}).get('content-type','') if r is not None else ''} seed={seed} (endpoint risponde HTML o richiede appid)")
        pause()
    print(f"[yahoo] done ok={ok}", flush=True)

if __name__ == "__main__":
    if not os.path.exists(RAW):
        with open(RAW, "w", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow(["keyword","lingua","fonte","seed"])
    nja = len(SEEDS["ja"]); q1, q2, q3 = nja // 4, nja // 2, (3 * nja) // 4
    ts = [threading.Thread(target=google_worker, args=([("ja","ja","jp")], slice(0, q1)), daemon=True),
          threading.Thread(target=google_worker, args=([("ja","ja","jp")], slice(q1, q2)), daemon=True),
          threading.Thread(target=google_worker, args=([("ja","ja","jp")], slice(q2, q3)), daemon=True),
          threading.Thread(target=google_worker, args=([("ja","ja","jp")], slice(q3, nja)), daemon=True),
          threading.Thread(target=google_worker, args=([("en","en","jp"),("zh","zh-CN","jp")],), daemon=True),
          threading.Thread(target=google_worker, args=([("zh","zh-CN","cn")],), daemon=True)]
    ts += [threading.Thread(target=bing_worker, args=(("ja",), slice(0, q2)), daemon=True),
           threading.Thread(target=bing_worker, args=(("ja",), slice(q2, nja)), daemon=True),
           threading.Thread(target=bing_worker, args=(("en","zh"),), daemon=True)]
    ts += [threading.Thread(target=f, daemon=True) for f in (baidu_worker, yahoo_worker)]
    for t in ts: t.start()
    for t in ts: t.join()
    print("ALL DONE", flush=True)
