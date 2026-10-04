# -*- coding: utf-8 -*-
"""HIRE driver japan · generatore del brand kit.
Produce in logo/: marchio, logotipo orizzontale e verticale, solo scritta, sigillo per attestati e certificati,
versioni su scuro, su chiaro, trasparenti e monocromatiche, PNG per web e app.
Produce in business-card/: meishi 91x55 fronte (giapponese) e retro (inglese), anteprime, lastre bianco e oro, CMYK con 角トンボ.
Tutto il testo e' convertito in tracciati: i file si aprono ovunque senza font installati.
Uso: python3 gen_brand.py   (i dati del biglietto sono in CARD qui sotto)"""
import math, os, subprocess, sys
from hdjtype import face, text, width, glyph_bounds, arc_text
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../brand-kit/business-card"))
import gen_meishi as M  # riuso: svg(), tombo(), to_cmyk(), check_pdf(), dimensioni 91x55 + abbondanza 3 mm

INK, INK2, GOLD, GOLD_LIGHT_BG, IVORY, MUT = "#14110E", "#1C1814", "#C7A36A", "#9C7A3C", "#F1EADC", "#A39A8A"
PRINT_GOLD = M.GOLD  # #C8A55B, gia' mappato in CMYK dal generatore 6 Ltd
CORM, JOST3, JOST4, JOST5 = face("CormorantGaramond", 600), face("Jost", 300), face("Jost", 400), face("Jost", 500)
MINCHO, GOTHIC, GOTHIC_SC = face("NotoSerifJP", 400), face("NotoSansJP", 400), face("NotoSansSC", 400)
TAG_EN = "LICENSED DRIVERS · VIP SERVICE TRAINING"

CARD = dict(
    title_jp="代表 ・ 主任講師", title_en="FOUNDER · LEAD TRAINER",
    name_jp="コンベルシ　フルビオ", name_rom="CONVERSI FULVIO",
    mobile="080-4033-2702", mail="fulvio@hiredriverjapan.com", site="hiredriverjapan.com",
    line_jp="役員運転手 ・ VIPサービス研修 ・ 修了証と認証", city_jp="東京", city_en="TOKYO",
    tag_en="Licensed multilingual drivers. VIP service training and certification.",
    tag_zh="日本专业司机 · 贵宾服务培训与认证",
)

# ------------------------------------------------------------------ marchio
def mark(x, y, s, gold, inner=True):
    """Ottagono con H graziata in Cormorant. (x,y) angolo in alto a sinistra, s lato del quadrato."""
    k = s / 64
    pts = lambda P: " ".join(f"{x + a * k:.3f},{y + b * k:.3f}" for a, b in P)
    out = f'<polygon points="{pts([(20,2.5),(44,2.5),(61.5,20),(61.5,44),(44,61.5),(20,61.5),(2.5,44),(2.5,20)])}" fill="none" stroke="{gold}" stroke-width="{2.2*k:.3f}"/>'
    if inner:
        out += f'<polygon points="{pts([(22.6,8.6),(41.4,8.6),(55.4,22.6),(55.4,41.4),(41.4,55.4),(22.6,55.4),(8.6,41.4),(8.6,22.6)])}" fill="none" stroke="{gold}" stroke-opacity=".45" stroke-width="{0.8*k:.3f}"/>'
    (x0, y0, x1, y1), upem = glyph_bounds(CORM, "H")
    size = 26 * k * upem / (y1 - y0)  # H alta 26 unita su 64
    gw, gh = (x1 - x0) * size / upem, (y1 - y0) * size / upem
    d, _ = text(CORM, "H", size, x + 32 * k - gw / 2 - x0 * size / upem, y + 32 * k + gh / 2)
    return out + f'<g fill="{gold}">{d}</g>'

def wordmark(x, base, cap, gold, ivory):
    """HIRE (Cormorant 600, maiuscolo, oro) + driver japan (Jost 300, minuscolo). cap = corpo di HIRE."""
    a, wa = text(CORM, "HIRE", cap, x, base, tracking=0.10)
    gap = cap * 0.22
    b, wb = text(JOST3, "driver japan", cap * 0.70, x + wa + gap, base, tracking=0.10)
    return f'<g fill="{gold}">{a}</g><g fill="{ivory}">{b}</g>', wa + gap + wb

def page(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.2f}" height="{h:.2f}">{rect}{body}</svg>'

def save(path, svg, png_w=None):
    open(path, "w").write(svg)
    if png_w: subprocess.run(["rsvg-convert", "-w", str(png_w), path, "-o", path[:-4] + ".png"], check=True)

L = os.path.join(HERE, "logo")
VARIANTS = {"dark": (INK, GOLD, IVORY), "light": ("#F6F1E6", GOLD_LIGHT_BG, INK), "transparent-dark": (None, GOLD, IVORY),
            "transparent-light": (None, GOLD_LIGHT_BG, INK), "mono-black": (None, "#000000", "#000000"), "mono-white": (None, "#FFFFFF", "#FFFFFF")}
for name, (bg, g, iv) in VARIANTS.items():
    # marchio
    save(f"{L}/hdj-mark-{name}.svg", page(64, 64, mark(0, 0, 64, g), bg), 512 if name in ("dark", "transparent-dark") else None)
    # orizzontale
    wm, ww = wordmark(0, 0, 30, g, iv); pad = 16; ms = 64
    body = mark(pad, pad, ms, g) + f'<g transform="translate({pad + ms + 22},{pad + ms/2 + 10.5})">{wm}</g>'
    save(f"{L}/hdj-logo-horizontal-{name}.svg", page(pad + ms + 22 + ww + pad, ms + 2 * pad, body, bg), 1600 if not name.startswith("mono") else None)
    # verticale con riga descrittiva
    wm2, ww2 = wordmark(0, 0, 30, g, iv); tag, tw = text(JOST4, TAG_EN, 7.2, 0, 0, tracking=0.32)
    W2 = max(ww2, tw) + 40; cx = W2 / 2
    body = mark(cx - 40, 20, 80, g) + f'<g transform="translate({cx - ww2/2:.2f},146)">{wm2}</g>' + f'<g fill="{g}" transform="translate({cx - tw/2:.2f},170)">{tag}</g>'
    save(f"{L}/hdj-logo-stacked-{name}.svg", page(W2, 190, body, bg), 1400 if not name.startswith("mono") else None)
    # solo scritta
    wm3, ww3 = wordmark(0, 0, 30, g, iv)
    save(f"{L}/hdj-wordmark-{name}.svg", page(ww3 + 24, 52, f'<g transform="translate(12,36)">{wm3}</g>', bg), 1200 if name in ("dark", "light") else None)

# sigillo per attestati e certificati
def seal(g, bg, ivory):
    c, R = 100, 92
    s = f'<circle cx="{c}" cy="{c}" r="{R}" fill="none" stroke="{g}" stroke-width="2.2"/><circle cx="{c}" cy="{c}" r="{R-6}" fill="none" stroke="{g}" stroke-width=".8"/><circle cx="{c}" cy="{c}" r="{R-34}" fill="none" stroke="{g}" stroke-width=".8"/>'
    s += f'<g fill="{g}">{arc_text(JOST5, "HIRE driver japan", 14, c, c, R-24, 270, tracking=0.26)}</g>'
    s += f'<g fill="{g}">{arc_text(JOST5, "CERTIFIED VIP SERVICE", 10.5, c, c, R-16, 90, tracking=0.30)}</g>'
    for ang in (180, 0):
        x = c + (R - 20) * math.cos(math.radians(ang)); s += f'<circle cx="{x:.2f}" cy="{c}" r="2" fill="{g}"/>'
    s += mark(c - 34, c - 34, 68, g)
    return page(200, 200, s, bg)
for name, (bg, g, iv) in {"dark": (INK, GOLD, IVORY), "transparent-gold": (None, GOLD, IVORY), "mono-black": (None, "#000000", "#000000")}.items():
    save(f"{L}/hdj-seal-{name}.svg", seal(g, bg, iv), 800)
# icona app e favicon (quadrato pieno)
save(f"{L}/hdj-app-icon.svg", page(64, 64, f'<rect width="64" height="64" rx="12" fill="{INK}"/>' + mark(6, 6, 52, GOLD)), 512)

# ------------------------------------------------------------------ meishi
B = os.path.join(HERE, "business-card"); PT = M.PT
def front(white, gold):
    W_, G_ = [], []
    W_.append(""); g = []
    G_.append(mark(6, 5.2, 9.2, "GOLDC", inner=False))
    wm, _ = wordmark(17.6, 11.6, 3.5, "GOLDC", "WHITEC"); G_.append(wm)
    d, _ = text(GOTHIC, CARD["line_jp"], 4.6 * PT, 17.6, 15.6, tracking=0.08); W_.append(d)
    d, _ = text(GOTHIC, CARD["title_jp"], 5.6 * PT, 6, 30.0, tracking=0.20); W_.append(d)
    d, _ = text(MINCHO, CARD["name_jp"], 11.0 * PT, 6, 36.2, tracking=0.04); W_.append(d)
    d, _ = text(JOST4, CARD["name_rom"], 6.2 * PT, 6, 40.6, tracking=0.26); W_.append(d)
    d, _ = text(JOST5, CARD["title_en"], 4.8 * PT, 6, 44.0, tracking=0.20); G_.append(f'<g fill="GOLDC">{d}</g>')
    G_.append(f'<rect x="6" y="23.6" width="8" height="{M.HAIRLINE}" fill="GOLDC"/>')
    for i, (lab, val) in enumerate((("MOB", CARD["mobile"]), ("MAIL", CARD["mail"]), ("WEB", CARD["site"]))):
        y = 40.6 + i * 3.7
        d, _ = text(JOST5, lab, 5.0 * PT, 54, y, tracking=0.20); G_.append(f'<g fill="GOLDC">{d}</g>')
        d, _ = text(JOST4, val, 5.2 * PT, 61.5, y, tracking=0.05); W_.append(d)
    d, _ = text(GOTHIC, f'{CARD["city_jp"]} ・ {CARD["city_en"]}', 4.4 * PT, 6, 49.4, tracking=0.12); W_.append(d)
    body = f'<g fill="{white}">{"".join(W_)}</g>' if white else ""
    if gold: body += "".join(G_).replace("GOLDC", gold).replace("WHITEC", white or gold)
    elif white: body += "".join(G_).replace("GOLDC", "none").replace("WHITEC", white)
    return body
def back(white, gold):
    G_, W_ = [], []
    G_.append(mark(45.5 - 7.5, 9.0, 15, "GOLDC"))
    wm, ww = wordmark(0, 0, 5.6, "GOLDC", "WHITEC"); G_.append(f'<g transform="translate({45.5 - ww/2:.3f},32.4)">{wm}</g>')
    d, _ = text(JOST4, CARD["tag_en"], 4.9 * PT, 45.5, 38.6, tracking=0.06, anchor="middle"); W_.append(d)
    d, _ = text(GOTHIC_SC, CARD["tag_zh"], 4.6 * PT, 45.5, 42.4, tracking=0.08, anchor="middle"); W_.append(d)
    d, _ = text(JOST5, CARD["site"].upper(), 4.8 * PT, 45.5, 48.6, tracking=0.30, anchor="middle"); G_.append(f'<g fill="GOLDC">{d}</g>')
    body = f'<g fill="{white}">{"".join(W_)}</g>' if white else ""
    if gold: body += "".join(G_).replace("GOLDC", gold).replace("WHITEC", white or gold)
    elif white: body += "".join(G_).replace("GOLDC", "none").replace("WHITEC", white)
    return body
K = "#000000"; jobs = []
for side, fn in (("front", front), ("back", back)):
    jobs += [
        (f"hdj-meishi-{side}-preview.svg", M.svg(fn(IVORY, PRINT_GOLD), INK), "png"),
        (f"hdj-meishi-{side}-plate-white.svg", M.svg(fn(K, None), "#FFFFFF"), "pdf"),
        (f"hdj-meishi-{side}-plate-gold.svg", M.svg(fn(None, K), "#FFFFFF"), "pdf"),
        (f"hdj-meishi-{side}-cmyk-tombo.svg", M.svg(fn(M.PAPER, PRINT_GOLD), INK, margin=14.0, marks=True), "cmyk"),
    ]
bad = []
for name, content, kind in jobs:
    p = os.path.join(B, name); open(p, "w").write(content)
    if kind == "png": subprocess.run(["rsvg-convert", "-d", "600", "-p", "600", p, "-o", p[:-4] + ".png"], check=True)
    else:
        pdf = p[:-4] + ".pdf"; subprocess.run(["rsvg-convert", "-f", "pdf", "-d", "600", "-p", "600", p, "-o", pdf], check=True)
        if kind == "cmyk": M.to_cmyk(pdf, pdf + ".tmp"); os.replace(pdf + ".tmp", pdf)
        if not M.check_pdf(pdf): bad.append(pdf)
# file unico fronte e retro per la tipografia
subprocess.run(["gs", "-dQUIET", "-dBATCH", "-dNOPAUSE", "-sDEVICE=pdfwrite", "-dProcessColorModel=/DeviceCMYK", "-dColorConversionStrategy=/LeaveColorUnchanged",
                f"-sOutputFile={B}/hdj-meishi-cmyk-tombo-2sided.pdf", f"{B}/hdj-meishi-front-cmyk-tombo.pdf", f"{B}/hdj-meishi-back-cmyk-tombo.pdf"], check=True)
assert not bad, bad
print("brand kit generato")
