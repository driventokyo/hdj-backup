# -*- coding: utf-8 -*-
"""Tipografia in tracciati per il brand kit HIRE driver japan (stesso metodo del meishi 6 Ltd: HarfBuzz + fontTools)."""
import io, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
_cache = {}
class Face:
    def __init__(self, path, wght):
        ft = TTFont(path)
        if "fvar" in ft: instancer.instantiateVariableFont(ft, {"wght": wght}, inplace=True, updateFontNames=False)
        self.ft = ft; self.upem = ft["head"].unitsPerEm; self.gs = ft.getGlyphSet(); self.order = ft.getGlyphOrder()
        buf = io.BytesIO(); ft.save(buf); self.hbfont = hb.Font(hb.Face(hb.Blob(buf.getvalue())))
def face(name, wght):
    k = (name, wght)
    if k not in _cache: _cache[k] = Face(os.path.join(FONTS, name + ".ttf"), wght)
    return _cache[k]
def shape(f, text):
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties(); hb.shape(f.hbfont, b, {"kern": True, "liga": True})
    return list(zip(b.glyph_infos, b.glyph_positions))
def width(f, text, size, tracking=0.0):
    r = shape(f, text); return (sum(p.x_advance for _, p in r) + tracking * f.upem * max(len(r) - 1, 0)) * size / f.upem
def text(f, t, size, x, y, tracking=0.0, anchor="start"):
    """Gruppo SVG di glifi in tracciato. y = linea di base."""
    r = shape(f, t); tu = tracking * f.upem
    total = sum(p.x_advance for _, p in r) + tu * max(len(r) - 1, 0); s = size / f.upem
    if anchor == "middle": x -= total * s / 2
    elif anchor == "end": x -= total * s
    parts, cur = [], 0.0
    for info, pos in r:
        pen = SVGPathPen(f.gs, ntos=lambda v: f"{v:.1f}"); f.gs[f.order[info.codepoint]].draw(pen); d = pen.getCommands()
        if d: parts.append(f'<path transform="translate({cur + pos.x_offset:.1f},{pos.y_offset:.1f})" d="{d}"/>')
        cur += pos.x_advance + tu
    return f'<g transform="translate({x:.3f},{y:.3f}) scale({s:.6f},{-s:.6f})">{"".join(parts)}</g>', total * s
def glyph_bounds(f, ch):
    g = f.order[shape(f, ch)[0][0].codepoint]; bp = BoundsPen(f.gs); f.gs[g].draw(bp); return bp.bounds, f.upem
def arc_text(f, t, size, cx, cy, r, center_deg, tracking=0.0, outside=True):
    """Testo lungo un arco (per il sigillo). center_deg: 270 = in alto, 90 = in basso."""
    import math
    r_ = shape(f, t); tu = tracking * f.upem; s = size / f.upem
    advs = [(p.x_advance + tu) * s for _, p in r_]; total = sum(advs) - tu * s
    ang_total = total / r * 180 / math.pi
    top = center_deg > 180
    a = center_deg - ang_total / 2 if top else center_deg + ang_total / 2
    out = []
    for (info, pos), adv in zip(r_, advs):
        mid = a + (adv / 2) / r * 180 / math.pi * (1 if top else -1)
        rad = math.radians(mid); px, py = cx + r * math.cos(rad), cy + r * math.sin(rad)
        rot = mid + 90 if top else mid - 90
        pen = SVGPathPen(f.gs, ntos=lambda v: f"{v:.1f}"); f.gs[f.order[info.codepoint]].draw(pen); d = pen.getCommands()
        if d: out.append(f'<g transform="translate({px:.3f},{py:.3f}) rotate({rot:.2f}) scale({s:.6f},{-s:.6f}) translate({-pos.x_advance/2:.1f},0)"><path d="{d}"/></g>')
        a += adv / r * 180 / math.pi * (1 if top else -1)
    return "".join(out)
