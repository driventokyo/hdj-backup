// Genera le dispense PDF della HDJ Academy da chapters.mjs:
//   pdf/LS-001.pdf ... (una per capitolo) e pdf/hdj-academy-day1.pdf, pdf/hdj-academy-day2.pdf (manuale del giorno).
// Genera anche notes.sql: la scheda breve sotto ogni video (obiettivi e punti chiave).
// Uso: node gen_pdfs.mjs  (serve puppeteer-core e Google Chrome)
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHAPTERS } from "./chapters.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(HERE, "..", "..", "brand-kit", "fonts");
const OUT = path.join(HERE, "pdf"); fs.mkdirSync(OUT, { recursive: true });
const GOLD = "#A9884C", INK = "#14110E", MUT = "#6b6254";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const DAY = { 1: ["1日目　VVIPの基準", "Day 1 · The VVIP standard"], 2: ["2日目　接客の外国語", "Day 2 · Service language"] };
const num = (c) => CHAPTERS.indexOf(c) + 1;
const mark = (s) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="none" stroke="${GOLD}" stroke-width="2.4"/><text x="32" y="43" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="31" fill="${GOLD}">H</text></svg>`;

const f = (file) => `url("file://${path.join(FONTS, file)}")`;
const CSS = `
@font-face{font-family:"Cormorant Garamond";src:${f("CormorantGaramond.ttf")};font-weight:300 700}
@font-face{font-family:"Cormorant Garamond";font-style:italic;src:${f("CormorantGaramond-Italic.ttf")};font-weight:300 700}
@font-face{font-family:"Jost";src:${f("Jost.ttf")};font-weight:100 900}
@font-face{font-family:"Noto Serif JP";src:${f("NotoSerifJP.ttf")};font-weight:200 900}
@font-face{font-family:"Noto Sans JP";src:${f("NotoSansJP.ttf")};font-weight:100 900}
@page{size:A4;margin:20mm 18mm 18mm}
*{box-sizing:border-box}body{margin:0;font-family:"Noto Sans JP";font-size:10pt;line-height:1.75;color:${INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.en{font-family:"Cormorant Garamond";font-style:italic;color:${MUT};font-size:11pt;line-height:1.45}
.cover{height:257mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;border:.4mm solid ${GOLD};outline:1.2mm solid ${INK};outline-offset:2.5mm}
.cover .brand{font-family:"Cormorant Garamond";font-size:14pt;letter-spacing:.06em;margin-top:3mm}.cover .brand b{color:${GOLD};font-weight:600}
.cover h1{font-family:"Noto Serif JP";font-size:26pt;margin:14mm 0 2mm;letter-spacing:.08em}.cover .en{font-size:16pt}
.cover .toc{margin-top:16mm;text-align:left;font-size:9.5pt;line-height:1.9}.cover .toc span{color:${GOLD};font-family:Jost;margin-right:3mm}
.ch{page-break-before:always}.ch:first-of-type{page-break-before:auto}
.kick{font-family:Jost;font-size:8.5pt;letter-spacing:.18em;color:${GOLD};text-transform:uppercase}
h2{font-family:"Noto Serif JP";font-size:19pt;margin:1mm 0 0;line-height:1.35}h2+.en{font-size:14pt;margin-bottom:5mm}
.goals{border-left:1mm solid ${GOLD};background:#f7f2e8;padding:3mm 5mm;margin:4mm 0 6mm}.goals h4{margin:0 0 1mm;font-size:9pt;letter-spacing:.1em;color:${GOLD}}
.goals li{margin:1mm 0}.goals .en{font-size:10pt;display:block}
.pt{margin:0 0 4.5mm;break-inside:avoid}.pt h3{font-family:"Noto Serif JP";font-size:11.5pt;margin:0;display:flex;gap:3mm;align-items:baseline}.pt h3 .en{font-size:11pt}
.pt h3::before{content:"";width:2mm;height:2mm;background:${GOLD};transform:rotate(45deg);flex:none;position:relative;top:-.6mm}
.pt p{margin:.8mm 0 0 5mm}.pt p.en{margin-top:.6mm;font-size:10.5pt}
.box{border:.3mm solid #d8cdb8;border-radius:2mm;padding:4mm 5mm;margin:5mm 0;break-inside:avoid}.box.long{break-inside:auto}tr{break-inside:avoid}.box h4{break-after:avoid}.box h4{margin:0 0 2mm;font-family:"Noto Serif JP";font-size:11pt}.box h4 .en{font-size:10.5pt;margin-left:2mm}
.chk li{list-style:none;margin:1.2mm 0;padding-left:7mm;position:relative}.chk li::before{content:"";position:absolute;left:0;top:1.3mm;width:3.2mm;height:3.2mm;border:.3mm solid ${INK}}
table{width:100%;border-collapse:collapse;font-size:9.5pt}td,th{border-bottom:.2mm solid #e2d9c8;padding:1.6mm 2mm;vertical-align:top;text-align:left}th{font-size:8pt;color:${MUT};font-weight:500}
td.e{font-family:"Cormorant Garamond";font-size:12pt;font-weight:600;width:52%}td.n{width:8mm;color:${GOLD};font-family:Jost;font-size:8.5pt}
.dl td.s{width:10mm;font-family:Jost;font-weight:600;color:${GOLD}}.dl td.e{font-weight:500}
pre{font-family:"Cormorant Garamond";font-size:11.5pt;white-space:pre-wrap;background:#f7f2e8;padding:3mm 4mm;margin:2mm 0 4mm;border-radius:1.5mm;line-height:1.45}
.foot{margin-top:6mm;font-size:8pt;color:${MUT}}
`;

function block(b) {
  const t = (x) => `<h4>${esc(x[0])}<span class="en">${esc(x[1])}</span></h4>`;
  if (b.type === "check") return `<div class="box">${t(b.title)}<ul class="chk">${b.items.map((x) => `<li>${esc(x[0])}<br><span class="en">${esc(x[1])}</span></li>`).join("")}</ul></div>`;
  if (b.type === "phrases") return `<div class="box${b.items.length > 6 ? " long" : ""}">${t(b.title)}<table>${b.items.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="e">${esc(x[0])}</td><td>${esc(x[1])}</td></tr>`).join("")}</table></div>`;
  if (b.type === "table") return `<div class="box">${t(b.title)}<table>${b.rows.map((r) => `<tr>${r.map((x, i) => `<td${i === 1 ? ' class="e"' : ""}>${esc(x)}</td>`).join("")}</tr>`).join("")}</table></div>`;
  if (b.type === "dialogue") return `<div class="box dl">${t(b.title)}<table>${b.items.map((x) => `<tr><td class="s">${x[0] === "D" ? "運転手" : "客"}</td><td class="e">${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join("")}</table><p class="foot">運転手 = Driver　客 = Client</p></div>`;
  if (b.type === "messages") return `<div class="box">${t(b.title)}${b.items.map((x) => `<p style="margin:3mm 0 0"><b>${esc(x[0])}</b> <span class="en">${esc(x[1])}</span></p><pre>${esc(x[2])}</pre>`).join("")}</div>`;
  return "";
}
function chapter(c) {
  return `<section class="ch"><div class="kick">HDJ Academy · ${c.day === 1 ? "Day 1" : "Day 2"} · Chapter ${num(c)}</div><h2>第${num(c)}章　${esc(c.ja)}</h2><div class="en">${esc(c.en)}</div>
  <div class="goals"><h4>学習の目標 · GOALS</h4><ul>${c.goals.map((g) => `<li>${esc(g[0])}<span class="en">${esc(g[1])}</span></li>`).join("")}</ul></div>
  ${c.points.map(([h, p]) => `<div class="pt"><h3>${esc(h[0])}<span class="en">${esc(h[1])}</span></h3><p>${esc(p[0])}</p><p class="en">${esc(p[1])}</p></div>`).join("")}
  ${(c.extra || []).map(block).join("")}</section>`;
}
function cover(day, list) {
  return `<div class="cover">${mark("22mm")}<div class="brand"><b>HIRE</b> driver japan · Academy</div><h1>${esc(DAY[day][0])}</h1><div class="en">${esc(DAY[day][1])}</div>
  <div class="kick" style="margin-top:4mm">VVIP Service Training · 学習テキスト</div>
  <div class="toc">${list.map((c) => `<div><span>${String(num(c)).padStart(2, "0")}</span>${esc(c.ja)}　<span class="en" style="color:${MUT};font-family:'Cormorant Garamond'">${esc(c.en)}</span></div>`).join("")}</div></div>`;
}
const doc = (body) => `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;
const footer = (label) => `<div style="width:100%;font-size:7pt;font-family:Helvetica,Arial;color:#8a806e;padding:0 18mm;display:flex;justify-content:space-between"><span>HIRE driver japan Academy · ${label}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--allow-file-access-from-files"] });
const p = await b.newPage();
async function render(html, file, label) {
  const tmp = path.join(OUT, ".tmp.html"); fs.writeFileSync(tmp, html);
  await p.goto("file://" + tmp, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(OUT, file), format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer(label), margin: { top: "20mm", bottom: "18mm", left: "18mm", right: "18mm" } });
  fs.rmSync(tmp);
}
for (const c of CHAPTERS) await render(doc(chapter(c)), `${c.id}.pdf`, `第${num(c)}章 ${c.ja}`);
for (const day of [1, 2]) { const list = CHAPTERS.filter((c) => c.day === day); await render(doc(cover(day, list) + list.map(chapter).join("")), `hdj-academy-day${day}.pdf`, DAY[day][1]); }
await b.close();

// scheda breve sotto il video: obiettivi e titoli dei punti chiave
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const notes = (c, i) => [...c.goals.map((g) => "- " + g[i]), "", ...c.points.map(([h, t]) => "- " + h[i] + "：" + t[i])].join("\n").replace(/：/g, i ? ": " : "：");
fs.writeFileSync(path.join(HERE, "notes.sql"), CHAPTERS.map((c) => `UPDATE lessons SET notes_ja=${q(notes(c, 0))}, notes_en=${q(notes(c, 1))}, pdf_key=${q("materials/" + c.id + ".pdf")}, updated_at=${q(new Date().toISOString())} WHERE id=${q(c.id)};`).join("\n") + "\n");
console.log("PDF:", fs.readdirSync(OUT).filter((x) => x.endsWith(".pdf")).length);
