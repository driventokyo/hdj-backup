#!/usr/bin/env python3
"""Controlli sui nomi candidati: handle social (solo URL pubblico), J-PlatPat raggiungibile, dominio .com libero via RDAP,
e conteggio delle corrispondenze esatte nella prima pagina di Brave (ja/en/zh). Output: names_check.csv"""
import csv, json, re, time, warnings; warnings.filterwarnings("ignore")
import requests
from bs4 import BeautifulSoup
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
H = {"User-Agent": UA}
NAMES = ["Hire Driver Japan","Pro Driver Japan","Global Driver Japan","Driver Pool Japan","Multilingual Driver Japan",
         "Bilingual Driver Japan","Driver Link Japan","Nishu Drivers","Global Chauffeur Japan","Omotenashi Drivers"]
def handle(n): return re.sub(r"[^a-z0-9]", "", n.lower())
def domain(n): return handle(n) + ".com"
def status(url, **kw):
    try:
        r = requests.get(url, headers=H, timeout=15, allow_redirects=True, **kw); time.sleep(2)
        return r
    except Exception as e:
        time.sleep(2); return None
def rdap(dom):
    try:
        r = requests.get(f"https://rdap.verisign.com/com/v1/domain/{dom}", headers=H, timeout=15); time.sleep(1.5)
        if r.status_code == 404: return "libero"
        if r.status_code == 200: return "registrato"
        return f"non verificabile ({r.status_code})"
    except Exception as e: return "non verificabile"
def instagram(h):
    r = status(f"https://www.instagram.com/{h}/")
    if r is None: return "non verificabile"
    if r.status_code == 404: return "libero"
    if r.status_code == 200 and "login" in r.url: return "non verificabile (login wall)"
    if r.status_code == 200:
        return "occupato" if re.search(r'"username":"%s"' % re.escape(h), r.text) or f"@{h}" in r.text else "non verificabile (200 generico)"
    return f"non verificabile ({r.status_code})"
def xcom(h):
    r = status(f"https://x.com/{h}")
    if r is None: return "non verificabile"
    return "non verificabile (pagina JS)" if r.status_code == 200 else ("libero" if r.status_code == 404 else f"non verificabile ({r.status_code})")
def line(h):
    r = status(f"https://line.me/R/ti/p/@{h}")
    if r is None: return "non verificabile"
    return "non verificabile (LINE non espone l'ID via URL)" if r.status_code in (200, 302) else ("libero?" if r.status_code == 404 else f"non verificabile ({r.status_code})")
def brave_exact(n, lang):
    cc = {"ja":"jp","en":"us","zh":"cn"}[lang]
    r = status("https://search.brave.com/search", params={"q": f'"{n}"', "source":"web", "country": cc}, headers={**H, "Accept-Language": {"ja":"ja","en":"en","zh":"zh-CN"}[lang]})
    if r is None or r.status_code != 200: return "non disponibile", ""
    s = BeautifulSoup(r.text, "lxml")
    hits, urls = 0, []
    for sn in s.select(".snippet"):
        t = sn.get_text(" ", strip=True).lower()
        a = sn.select_one("a[href^='http']")
        if n.lower() in t:
            hits += 1
            if a and a["href"] not in urls: urls.append(a["href"])
    nores = bool(re.search(r"no results|Not many great matches", s.get_text(" ", strip=True), re.I))
    return hits, " ; ".join(urls[:3]) + (" [pochi risultati]" if nores else "")
rows = []
jp = status("https://www.j-platpat.inpit.go.jp/")
jp_state = f"raggiungibile http {jp.status_code}, ma la ricerca e' solo via form JS: da verificare manualmente" if jp is not None else "non raggiungibile"
for n in NAMES:
    h = handle(n)
    row = {"nome": n, "handle": h, "dominio_com": domain(n), "dominio_stato": rdap(domain(n)),
           "instagram": instagram(h), "x": xcom(h), "line_id": line(h), "wechat": "non verificabile (nessun URL pubblico)",
           "jplatpat": jp_state}
    for lang in ("ja","en","zh"):
        c, u = brave_exact(n, lang); row[f"brave_exact_{lang}"] = c; row[f"brave_urls_{lang}"] = u
    rows.append(row); print(json.dumps(row, ensure_ascii=False)[:300], flush=True)
with open("names_check.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print("saved names_check.csv")
