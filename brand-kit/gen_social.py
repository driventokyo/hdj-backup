# -*- coding: utf-8 -*-
"""HIRE driver japan · kit social. Genera in social/: avatar, copertine (X, LinkedIn, Facebook, YouTube), post 4:5 e storie 9:16
in ja zh en, copertine Xiaohongshu 3:4, icone per le storie in evidenza. Testo in tracciati, resa con rsvg-convert.
Uso: python3 gen_social.py"""
import base64, io, os, subprocess
from PIL import Image
from hdjtype import face, text, width, glyph_bounds
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "social")
INK, PANEL, GOLD, GOLD2, IVORY, SOFT, MUT, LACQ = "#14110E", "#1C1814", "#C7A36A", "#E3C893", "#F1EADC", "#D9D0C0", "#A39A8A", "#6E2A25"
CORM, JOST3, JOST4, JOST5 = face("CormorantGaramond", 600), face("Jost", 300), face("Jost", 400), face("Jost", 500)
MINCHO, GOTHIC, SC = face("NotoSerifJP", 600), face("NotoSansJP", 400), face("NotoSansSC", 500)
SC4 = face("NotoSansSC", 400)
HEAD = {"ja": MINCHO, "zh": SC, "en": CORM}; BODY = {"ja": GOTHIC, "zh": SC4, "en": JOST4}

def mark(x, y, s, gold=GOLD, inner=True):
    k = s / 64; P = lambda pts: " ".join(f"{x + a * k:.2f},{y + b * k:.2f}" for a, b in pts)
    o = f'<polygon points="{P([(20,2.5),(44,2.5),(61.5,20),(61.5,44),(44,61.5),(20,61.5),(2.5,44),(2.5,20)])}" fill="none" stroke="{gold}" stroke-width="{2.2*k:.2f}"/>'
    if inner: o += f'<polygon points="{P([(22.6,8.6),(41.4,8.6),(55.4,22.6),(55.4,41.4),(41.4,55.4),(22.6,55.4),(8.6,41.4),(8.6,22.6)])}" fill="none" stroke="{gold}" stroke-opacity=".45" stroke-width="{0.8*k:.2f}"/>'
    (x0, y0, x1, y1), upem = glyph_bounds(CORM, "H"); size = 26 * k * upem / (y1 - y0)
    gw, gh = (x1 - x0) * size / upem, (y1 - y0) * size / upem
    d, _ = text(CORM, "H", size, x + 32 * k - gw / 2 - x0 * size / upem, y + 32 * k + gh / 2)
    return o + f'<g fill="{gold}">{d}</g>'
def wordmark(x, base, cap, anchor="start"):
    _, wa = text(CORM, "HIRE", cap, 0, 0, tracking=0.10); gap = cap * 0.22; _, wb = text(JOST3, "driver japan", cap * 0.70, 0, 0, tracking=0.10)
    tot = wa + gap + wb
    if anchor == "middle": x -= tot / 2
    a, _ = text(CORM, "HIRE", cap, x, base, tracking=0.10); b, _ = text(JOST3, "driver japan", cap * 0.70, x + wa + gap, base, tracking=0.10)
    return f'<g fill="{GOLD}">{a}</g><g fill="{IVORY}">{b}</g>', tot
def lockup(x, y, h, anchor="start"):
    """marchio + scritta su una riga; h = altezza del marchio; (x,y) angolo alto sinistro (o centro alto se middle)."""
    cap = h * 0.47; _, ww = wordmark(0, 0, cap); tot = h + h * 0.34 + ww
    if anchor == "middle": x -= tot / 2
    wm, _ = wordmark(x + h + h * 0.34, y + h / 2 + cap * 0.35, cap)
    return mark(x, y, h) + wm, tot
def lines(f, txt, size, x, y, lh, fill, anchor="start", tracking=0.0):
    out = []
    for i, ln in enumerate(txt.split("\n")):
        d, _ = text(f, ln, size, x, y + i * size * lh, tracking=tracking, anchor=anchor); out.append(d)
    return f'<g fill="{fill}">{"".join(out)}</g>'
def photo_uri(path, w):
    im = Image.open(path).convert("RGB"); im.thumbnail((w, 10000)); b = io.BytesIO(); im.save(b, "JPEG", quality=86)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
def svg(w, h, body, bg=INK):
    return f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>'
def render(name, s):
    p = os.path.join(OUT, name); os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p[:-4] + ".svg"; open(tmp, "w").write(s); subprocess.run(["rsvg-convert", tmp, "-o", p], check=True); os.remove(tmp)
def frame(w, h, m):  # filetto sottile del brand
    return f'<rect x="{m}" y="{m}" width="{w-2*m}" height="{h-2*m}" fill="none" stroke="{GOLD}" stroke-opacity=".28" stroke-width="2"/>'
def glow(w, h):
    return f'<defs><radialGradient id="g" cx="85%" cy="0%" r="90%"><stop offset="0" stop-color="{GOLD}" stop-opacity=".13"/><stop offset=".6" stop-color="{GOLD}" stop-opacity="0"/></radialGradient></defs><rect width="{w}" height="{h}" fill="url(#g)"/>'
def octagons(cx, cy, rs, op=.18):
    o = ""
    for r in rs:
        k = r / 32; pts = " ".join(f"{cx + (a-32)*k:.1f},{cy + (b-32)*k:.1f}" for a, b in [(20,2.5),(44,2.5),(61.5,20),(61.5,44),(44,61.5),(20,61.5),(2.5,44),(2.5,20)])
        o += f'<polygon points="{pts}" fill="none" stroke="{GOLD}" stroke-opacity="{op}" stroke-width="2"/>'
    return o

FULVIO = os.path.join(HERE, "../site/src/assets/fulvio-1100.webp")
COPY = {
 "intro": {
  "ja": ("役員運転手・専属運転手を1時間から", "御社の車に、\n外国語で接客できる\nプロのドライバーを。", "第二種免許 ・ 当社雇用 ・ 英語対応"),
  "zh": ("东京专职司机 按小时计费", "贵公司的车，\n由会外语的\n专业司机来开。", "二种驾照 · 正式雇用 · 英语与中文"),
  "en": ("PRIVATE DRIVERS BY THE HOUR · TOKYO", "A multilingual,\nlicensed driver\nfor your own car.", "Class 2 licence · Our employees · English and more")},
 "training": {
  "ja": ("VIPサービス研修", "海外VIPを担当する\n乗務員のための3日間。", "修了証と VVIP Service Certificate を発行"),
  "zh": ("贵宾服务培训", "为接待海外贵宾的\n司机设计的三天课程。", "颁发结业证明与 VVIP Service Certificate"),
  "en": ("VIP SERVICE TRAINING", "Three days for drivers\nwho serve foreign VIPs.", "Attestation and certification by HIRE driver japan")},
 "hiring": {
  "ja": ("ドライバー募集", "第二種免許と語学を、\nいちばん活きる仕事に。", "当社雇用 ・ 時給制 ・ 勤務日は相談"),
  "zh": ("司机招聘", "二种驾照加外语，\n用在最值钱的地方。", "正式雇用 · 时薪制 · 排班可商量"),
  "en": ("DRIVER JOBS · TOKYO", "Your Class 2 licence\nand your languages,\nin one job.", "Part-time employment · Hourly pay · Flexible days")},
}
HSIZE = {"ja": 76, "zh": 76, "en": 96}

# ---------------- avatar
render("profile/hdj-avatar-1080.png", svg(1080, 1080, mark(1080/2 - 330, 1080/2 - 330, 660)))
render("profile/hdj-avatar-400.png", svg(400, 400, mark(200 - 122, 200 - 122, 244)))
render("profile/hdj-avatar-light-1080.png", svg(1080, 1080, mark(210, 210, 660, gold="#9C7A3C"), bg="#F6F1E6"))

# ---------------- copertine
def cover(name, w, h, safe_w=None, safe_h=None, tag=True):
    sw, sh = safe_w or w, safe_h or h; ox, oy = (w - sw) / 2, (h - sh) / 2
    lh = sh * 0.34; lk, tot = lockup(ox + sw * 0.06, oy + sh / 2 - lh / 2 - (sh * 0.06 if tag else 0), lh)
    body = glow(w, h) + octagons(ox + sw * 0.86, oy + sh / 2, [sh * 0.22, sh * 0.34, sh * 0.46], .2) + lk
    if tag:
        d, _ = text(JOST4, "LICENSED DRIVERS · VIP SERVICE TRAINING · TOKYO", sh * 0.06, ox + sw * 0.06, oy + sh / 2 + lh / 2 + sh * 0.1, tracking=0.3); body += f'<g fill="{GOLD}">{d}</g>'
    render(f"covers/{name}", svg(w, h, body))
cover("x-header-1500x500.png", 1500, 500, 1500, 360)          # X ritaglia sopra e sotto e copre a sinistra con l'avatar
cover("linkedin-company-1128x191.png", 1128, 191, tag=False)
cover("linkedin-personal-1584x396.png", 1584, 396, 1584, 300)
cover("facebook-cover-1640x624.png", 1640, 624, 1640, 460)
cover("youtube-banner-2560x1440.png", 2560, 1440, 1546, 423)  # area sicura di YouTube al centro

# ---------------- post 4:5, storie 9:16, Xiaohongshu 3:4
def post(kind, lang, w, h, folder):
    k, hd, ft = COPY[kind][lang]; m = w * 0.074; body = glow(w, h) + frame(w, h, w * 0.03)
    hs = HSIZE[lang] * w / 1080 * (1.18 if folder == "stories" else 1)
    if kind == "training":
        ph_h = h * 0.46
        body += f'<clipPath id="c"><rect x="{w*0.03+2}" y="{w*0.03+2}" width="{w - 2*w*0.03 - 4}" height="{ph_h}"/></clipPath><image clip-path="url(#c)" x="{w*0.03}" y="{w*0.03}" width="{w - 2*w*0.03}" height="{ph_h+20}" preserveAspectRatio="xMidYMid slice" xlink:href="{photo_uri(FULVIO, 1100)}"/>'
        top = w * 0.03 + ph_h + h * 0.07
    else:
        body += octagons(w * 0.8, h * 0.2, [w * 0.12, w * 0.19, w * 0.26], .16)
        top = h * 0.36 if folder != "stories" else h * 0.46
    kf = JOST5 if lang == "en" else BODY[lang]
    ks = w * (0.03 if folder == "stories" else 0.026)
    d, _ = text(kf, k, ks, m, top, tracking=0.28 if lang == "en" else 0.14); body += f'<g fill="{GOLD}">{d}</g>'
    body += f'<rect x="{m}" y="{top + w*0.03}" width="{w*0.05}" height="2" fill="{GOLD}"/>'
    lh = 1.32 if lang != "en" else 1.12; nlines = hd.count("\n") + 1; limit = h - m - w * 0.07 - w * 0.08
    widest = max(width(HEAD[lang], ln, 1) for ln in hd.split("\n"))
    hs = min(hs, (w - 2 * m) / widest)  # nessuna riga oltre i margini
    while top + w * 0.06 + hs + (nlines - 1) * hs * lh + hs * 1.3 + w * 0.03 > limit and hs > 40: hs -= 2  # titolo, riga finale e logo non si toccano
    body += lines(HEAD[lang], hd, hs, m, top + w * 0.06 + hs, lh, IVORY)
    y2 = top + w * 0.06 + hs + (nlines - 1) * hs * lh + hs * 0.6 + w * 0.045
    d, _ = text(BODY[lang], ft, w * (0.034 if folder == "stories" else 0.03), m, y2, tracking=0.04); body += f'<g fill="{SOFT}">{d}</g>'
    lk, _ = lockup(m, h - m - w * 0.07, w * 0.07); body += lk
    d, _ = text(JOST5, "HIREDRIVERJAPAN.COM", w * 0.022, w - m, h - m - w * 0.035 + w * 0.008, tracking=0.3, anchor="end"); body += f'<g fill="{GOLD}">{d}</g>'
    render(f"{folder}/{kind}-{lang}.png", svg(w, h, body))
for kind in COPY:
    for lang in ("ja", "zh", "en"):
        post(kind, lang, 1080, 1350, "posts")
        post(kind, lang, 1080, 1920, "stories")
for kind in ("intro", "training"):
    post(kind, "zh", 1242, 1660, "xiaohongshu")

# ---------------- icone per le storie in evidenza (Instagram)
for key, label in [("service", "SERVICE"), ("training", "TRAINING"), ("verify", "VERIFY"), ("jobs", "JOBS"), ("contact", "CONTACT")]:
    b = octagons(540, 540, [250], .9) + octagons(540, 540, [210], .35)
    fs = min(64, 330 / width(JOST5, label, 1, tracking=0.25))  # la parola resta dentro l'ottagono interno
    d, _ = text(JOST5, label, fs, 540, 540 + fs * 0.36, tracking=0.25, anchor="middle"); b += f'<g fill="{IVORY}">{d}</g>'
    render(f"highlights/{key}.png", svg(1080, 1080, b))
print("kit social generato")
