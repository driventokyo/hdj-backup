#!/usr/bin/env python3
"""Google Trends via pytrends: interest_over_time (12 mesi, geo=JP) e related_queries per le keyword in input.
Uso: python3 trends.py keywords.txt trends.csv related.csv   Retry con attesa su 429, non salta."""
import sys, time, json, csv, warnings; warnings.filterwarnings("ignore")
import pandas as pd
from pytrends.request import TrendReq
kws = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
out_t, out_r = sys.argv[2], sys.argv[3]
py = TrendReq(hl="ja-JP", tz=540, timeout=(10, 30), retries=0)
trows, rrows = [], []
def with_retry(fn, label):
    delay = 60
    for attempt in range(6):
        try: return fn()
        except Exception as e:
            msg = str(e)
            print(f"[{label}] {type(e).__name__}: {msg[:80]} attempt {attempt+1} -> sleep {delay}", flush=True)
            time.sleep(delay); delay = min(delay * 2, 600)
    return None
for i in range(0, len(kws), 5):
    batch = kws[i:i+5]
    def run():
        py.build_payload(batch, timeframe="today 12-m", geo="JP")
        iot = py.interest_over_time()
        rq = py.related_queries()
        return iot, rq
    res = with_retry(run, ",".join(batch)[:40])
    if res is None:
        for k in batch: trows.append({"keyword": k, "media_12m": "non disponibile", "max_12m": "non disponibile", "ultimo_mese_vs_media": "non disponibile", "serie": ""})
        continue
    iot, rq = res
    for k in batch:
        if iot is None or iot.empty or k not in iot.columns:
            trows.append({"keyword": k, "media_12m": 0, "max_12m": 0, "ultimo_mese_vs_media": "sotto soglia", "serie": ""}); 
        else:
            s = iot[k]
            trows.append({"keyword": k, "media_12m": round(float(s.mean()), 1), "max_12m": int(s.max()),
                          "ultimo_mese_vs_media": round(float(s.tail(4).mean()) - float(s.mean()), 1), "serie": " ".join(str(int(v)) for v in s.values)})
        top = rq.get(k, {}).get("top") if rq else None
        rising = rq.get(k, {}).get("rising") if rq else None
        rrows.append({"keyword": k,
                      "related_top5": " | ".join(f"{r.query}({r.value})" for r in top.head(5).itertuples()) if top is not None and not top.empty else "",
                      "rising_top5": " | ".join(f"{r.query}({r.value})" for r in rising.head(5).itertuples()) if rising is not None and not rising.empty else ""})
    print("ok", batch, flush=True); time.sleep(20)
pd.DataFrame(trows).to_csv(out_t, index=False, encoding="utf-8")
pd.DataFrame(rrows).to_csv(out_r, index=False, encoding="utf-8")
print("saved", out_t, out_r)
