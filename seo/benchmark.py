#!/usr/bin/env python3
"""Benchmark competitor: title, meta, H1, H2, termini ricorrenti, nome dell'autista, servizio per stranieri, forma contrattuale.
Uso: python3 benchmark.py sites.txt out.csv   (una URL per riga, '#' commenti). Rispetta robots.txt, 1 richiesta ogni 2 s."""
import csv, json, re, sys, time, warnings, collections
warnings.filterwarnings("ignore")
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
H = {"User-Agent": UA, "Accept-Language": "ja,en;q=0.8,zh-CN;q=0.6"}
DRIVER_TERMS = ["ドライバー","乗務員","運転手","運転士","ショーファー","司机","司機","chauffeur","driver"]
FOREIGN_TERMS = ["英語","外国人","外国語","インバウンド","多言語","English","english-speaking","bilingual","ESD","English Speaking Driver","包车","接送","英语","中文"]
CONTRACT_TERMS = ["正社員","契約社員","パート","アルバイト","嘱託","定時制","業務委託","派遣","紹介","兼業","副業","個人事業主","登録制","歩合","日給","月給","freelance","contractor","part-time","full-time","employee","兼职","全职","外包","劳务派遣"]
STOP = set("the and for with your our you are from this that will have all can more than not any was were been into about over its also only just like via per each any".split())

def fetch(url, rp):
    if rp and not rp.can_fetch("*", url):
        return None, "robots_disallow"
    try:
        r = requests.get(url, headers=H, timeout=25, allow_redirects=True)
        time.sleep(2.0)
        if r.status_code != 200: return None, f"http_{r.status_code}"
        if r.encoding is None or r.encoding.lower() in ("iso-8859-1",): r.encoding = r.apparent_encoding
        return r, "ok"
    except Exception as e:
        time.sleep(2.0); return None, f"exc_{type(e).__name__}"

def robots(base):
    rp = RobotFileParser()
    try:
        r = requests.get(urljoin(base, "/robots.txt"), headers=H, timeout=15); time.sleep(2.0)
        rp.parse(r.text.splitlines() if r.status_code == 200 else [])
    except Exception:
        rp.parse([])
    return rp

def text_of(soup):
    for t in soup(["script","style","noscript"]): t.decompose()
    return soup.get_text(" ", strip=True)

def count_terms(text, terms):
    low = text.lower()
    return {t: low.count(t.lower()) for t in terms if low.count(t.lower()) > 0}

def top_terms(text, n=15):
    ja = re.findall(r"[゠-ヿ]{3,}|[一-鿿]{2,4}", text)
    en = [w for w in re.findall(r"[A-Za-z][A-Za-z\-]{3,}", text.lower()) if w not in STOP]
    c = collections.Counter(ja + en)
    return [f"{k}:{v}" for k, v in c.most_common(n)]

def pick_subpages(soup, base, maxn=4):
    want = re.compile(r"(recruit|career|saiyo|saiyou|採用|求人|募集|乗務員|ドライバー|english|/en/|/en$|foreign|inbound|外国|多言語|司机|招聘|contract|service)", re.I)
    out, seen = [], set()
    for a in soup.select("a[href]"):
        href = urljoin(base, a["href"].split("#")[0])
        if urlparse(href).netloc != urlparse(base).netloc: continue
        if href in seen or href.rstrip("/") == base.rstrip("/"): continue
        label = (a.get_text(" ", strip=True) or "") + " " + href
        if want.search(label):
            seen.add(href); out.append(href)
        if len(out) >= maxn: break
    return out

def analyze(url):
    base = url if url.startswith("http") else "https://" + url
    row = {"url": base, "domain": urlparse(base).netloc, "status": "", "pages": 0, "title": "", "meta_description": "", "h1": "", "h2": "", "lang": "", "subpages": "",
           "driver_terms": "", "foreign_terms": "", "contract_terms": "", "top_terms": "", "note": ""}
    rp = robots(base)
    r, st = fetch(base, rp); row["status"] = st
    if r is None: return row
    soup = BeautifulSoup(r.text, "lxml")
    row["lang"] = (soup.html.get("lang") if soup.html else "") or ""
    row["title"] = (soup.title.get_text(strip=True) if soup.title else "")[:200]
    md = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    row["meta_description"] = (md.get("content", "") if md else "")[:300]
    row["h1"] = " | ".join(h.get_text(" ", strip=True)[:80] for h in soup.find_all("h1"))[:300]
    row["h2"] = " | ".join(h.get_text(" ", strip=True)[:60] for h in soup.find_all("h2")[:10])[:400]
    texts = [text_of(BeautifulSoup(r.text, "lxml"))]
    subs = pick_subpages(soup, base)
    got = []
    for s in subs:
        rs, sts = fetch(s, rp)
        if rs is not None:
            got.append(s); texts.append(text_of(BeautifulSoup(rs.text, "lxml")))
    row["pages"] = 1 + len(got); row["subpages"] = " ; ".join(got)
    full = " ".join(texts)
    row["driver_terms"] = json.dumps(count_terms(full, DRIVER_TERMS), ensure_ascii=False)
    row["foreign_terms"] = json.dumps(count_terms(full, FOREIGN_TERMS), ensure_ascii=False)
    row["contract_terms"] = json.dumps(count_terms(full, CONTRACT_TERMS), ensure_ascii=False)
    row["top_terms"] = " ".join(top_terms(full))
    return row

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    urls = [l.strip() for l in open(src, encoding="utf-8") if l.strip() and not l.startswith("#")]
    rows = []
    for u in urls:
        print("->", u, flush=True)
        try: rows.append(analyze(u))
        except Exception as e: rows.append({"url": u, "status": f"error {e}"})
    keys = ["url","domain","status","pages","title","meta_description","h1","h2","lang","subpages","driver_terms","foreign_terms","contract_terms","top_terms","note"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore"); w.writeheader(); w.writerows(rows)
    print("saved", out, len(rows))
