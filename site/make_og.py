# Immagini Open Graph 1200x630 per lingua, brand HIRE driver japan. Prima: rsvg-convert -h 160 ../brand-kit/logo/hdj-logo-horizontal-transparent-dark.svg -o /tmp/hdj_h.png. Rilanciare se cambia BRAND_NAME.
import re, glob
from PIL import Image, ImageDraw, ImageFont
cfg = open("config.mjs", encoding="utf-8").read()
BRAND = re.search(r'BRAND_NAME:\s*"([^"]+)"', cfg).group(1)
INK, GOLD, IVORY, MUT = "#14110E", "#C7A36A", "#F1EADC", "#A39A8A"
def font(cands, size):
    for c in cands:
        for p in glob.glob(c):
            try: return ImageFont.truetype(p, size)
            except Exception: pass
    return ImageFont.load_default()
SERIF_EN = ["/System/Library/Fonts/Supplemental/Didot.ttc", "/System/Library/Fonts/Supplemental/Georgia.ttf", "/Library/Fonts/Georgia.ttf"]
JA = ["/System/Library/Fonts/ヒラギノ明朝 ProN.ttc", "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"]
ZH = ["/System/Library/Fonts/Supplemental/Songti.ttc", "/System/Library/Fonts/PingFang.ttc"]
SANS_JA = ["/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"]; SANS_ZH = ["/System/Library/Fonts/PingFang.ttc"]; SANS_EN = ["/System/Library/Fonts/HelveticaNeue.ttc"]
TXT = {"ja": ("外国人VIPのご依頼を、\n断らずに済む乗務員を。", "ハイヤー・タクシー事業者さまへ｜5か国語・第二種免許｜VIP研修と認証", JA, SANS_JA),
       "zh": ("外国贵宾的订单，\n不必再推掉。", "致包车与出租车公司｜五种语言・二种驾照｜贵宾培训与认证", ZH, SANS_ZH),
       "en": ("A multilingual Class 2\ndriver for your hire fleet.", "For hire and taxi operators in Japan  |  Five languages  |  VIP training", SERIF_EN, SANS_EN)}
def mark(d, x, y, s):
    k = s / 64
    d.polygon([(x+a*k, y+b*k) for a, b in [(20,3),(44,3),(61,20),(61,44),(44,61),(20,61),(3,44),(3,20)]], outline=GOLD, width=3)
    for a, b, w, h in [(21,19,5,26),(38,19,5,26),(17.5,18,12,2),(34.5,18,12,2),(17.5,44,12,2),(34.5,44,12,2),(26,30.5,12,3)]:
        d.rectangle([x+a*k, y+b*k, x+(a+w)*k, y+(b+h)*k], fill=GOLD)
for l, (h, s, fh, fs) in TXT.items():
    im = Image.new("RGB", (1200, 630), INK); d = ImageDraw.Draw(im)
    d.rectangle([40, 40, 1160, 590], outline="#3a3127", width=1)
    lg = Image.open("/tmp/hdj_h.png").convert("RGBA"); lg = lg.resize((int(lg.width * 96 / lg.height), 96), Image.LANCZOS); im.paste(lg, (66, 68), lg)
    d.line([(80, 200), (116, 200)], fill=GOLD, width=2)
    d.multiline_text((80, 230), h, font=font(fh, 60 if l != "en" else 66), fill=IVORY, spacing=20)
    d.text((80, 512), s, font=font(fs, 26), fill=MUT)
    im.save(f"src/assets/og-{l}-3.png", optimize=True); print("og", l)
