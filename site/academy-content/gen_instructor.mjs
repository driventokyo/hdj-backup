// Genera il PDF del programma per il docente: pdf/hdj-vvip-programme-instructor.pdf (A4, giapponese con inglese a fianco).
// Uso: node gen_instructor.mjs   (serve puppeteer-core e Google Chrome; i font sono nel brand kit)
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META, INTRO, TIMETABLE, DAY1, DAY2, DAY3, EXAMS, APPENDIX_A, APPENDIX_B, APPENDIX_C, APPENDIX_D, QUICKCARD, CHAPTERS } from "./instructor.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(HERE, "..", "..", "brand-kit", "fonts");
const OUT = path.join(HERE, "pdf"); fs.mkdirSync(OUT, { recursive: true });
const GOLD = "#A9884C", INK = "#14110E", MUT = "#6b6254", RED = "#8E1B24";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f = (file) => `url("file://${path.join(FONTS, file)}")`;
const mark = (s) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="none" stroke="${GOLD}" stroke-width="2.4"/><text x="32" y="43" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="31" fill="${GOLD}">H</text></svg>`;

const CSS = `
@font-face{font-family:"Cormorant Garamond";src:${f("CormorantGaramond.ttf")};font-weight:300 700}
@font-face{font-family:"Cormorant Garamond";font-style:italic;src:${f("CormorantGaramond-Italic.ttf")};font-weight:300 700}
@font-face{font-family:"Jost";src:${f("Jost.ttf")};font-weight:100 900}
@font-face{font-family:"Noto Serif JP";src:${f("NotoSerifJP.ttf")};font-weight:200 900}
@font-face{font-family:"Noto Sans JP";src:${f("NotoSansJP.ttf")};font-weight:100 900}
@page{size:A4;margin:20mm 18mm 18mm}
*{box-sizing:border-box}body{margin:0;font-family:"Noto Sans JP";font-size:9.8pt;line-height:1.7;color:${INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.en{font-family:"Cormorant Garamond";font-style:italic;color:${MUT};font-size:10.6pt;line-height:1.4}
.cover{height:257mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;border:.4mm solid ${GOLD};outline:1.2mm solid ${INK};outline-offset:2.5mm;padding:0 14mm}
.cover .brand{font-family:"Cormorant Garamond";font-size:14pt;letter-spacing:.06em;margin-top:3mm}.cover .brand b{color:${GOLD};font-weight:600}
.cover h1{font-family:"Noto Serif JP";font-size:22pt;margin:14mm 0 2mm;letter-spacing:.06em;line-height:1.4}.cover .en{font-size:15pt}
.cover .conf{margin-top:18mm;padding:3mm 6mm;border:.3mm solid ${RED};color:${RED};font-size:9pt}.cover .conf .en{color:${RED};font-size:9.5pt;display:block}
.kick{font-family:Jost;font-size:8.5pt;letter-spacing:.18em;color:${GOLD};text-transform:uppercase}
h2{font-family:"Noto Serif JP";font-size:17pt;margin:1mm 0 0;line-height:1.35}h2+.en{font-size:13pt;margin-bottom:4mm;display:block}
h3{font-family:"Noto Serif JP";font-size:11.5pt;margin:6mm 0 1.5mm;display:flex;gap:3mm;align-items:baseline;break-after:avoid}tr{break-inside:avoid}h3 .en{font-size:10.5pt}
h3::before{content:"";width:2mm;height:2mm;background:${GOLD};transform:rotate(45deg);flex:none;position:relative;top:-.6mm}
.pb{page-break-before:always}
.goals{border-left:1mm solid ${GOLD};background:#f7f2e8;padding:2.5mm 5mm;margin:3mm 0 4mm}.goals h4{margin:0 0 1mm;font-size:8.5pt;letter-spacing:.1em;color:${GOLD}}
ul{margin:1mm 0 2mm;padding-left:5mm}li{margin:1.2mm 0;break-inside:avoid}li .en{display:block}
.rules li{list-style:none;position:relative;padding-left:1mm}.rules li::marker{content:""}
.rules{margin-left:0;padding-left:0}.rules li{border-bottom:.2mm solid #e8e0d0;padding:1.6mm 0 1.8mm}
.notes{background:#f3f0ea;border-radius:1.5mm;padding:2.5mm 4mm;margin:3mm 0}.notes h4,.ex h4,.mis h4{margin:0 0 1mm;font-family:Jost;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:${GOLD}}
.ex{border:.3mm solid ${GOLD};border-radius:1.5mm;padding:2.5mm 4mm;margin:3mm 0}.mis{border-left:1mm solid ${RED};padding:1mm 4mm;margin:3mm 0}.mis h4{color:${RED}}
table{width:100%;border-collapse:collapse;font-size:9pt;margin:2mm 0 4mm}td,th{border-bottom:.2mm solid #e2d9c8;padding:1.5mm 2mm;vertical-align:top;text-align:left}th{font-size:8pt;color:${MUT};font-weight:500;background:#f7f2e8}
td.t{width:14mm;font-family:Jost;color:${GOLD};white-space:nowrap}td.pts{width:12mm;text-align:right;font-family:Jost;font-weight:600}
.chk li{list-style:none;padding-left:7mm;position:relative;margin:1.4mm 0}.chk li::before{content:"";position:absolute;left:0;top:1.4mm;width:3.4mm;height:3.4mm;border:.3mm solid ${INK}}
.card{border:.5mm solid ${GOLD};padding:5mm 7mm;margin:4mm 0}.card ol{margin:2mm 0 0;padding-left:6mm}.card li{margin:1.8mm 0;font-family:"Noto Serif JP";font-size:10.5pt}.card li .en{font-size:10pt}
.two{columns:2;column-gap:8mm}.two li{break-inside:avoid}
.toc{font-size:9.5pt;line-height:1.9}.toc span{color:${GOLD};font-family:Jost;margin-right:3mm}
.dl td.s{width:15mm;white-space:nowrap;font-family:"Noto Sans JP";font-weight:600;color:${GOLD}}.dl td.e{font-family:"Cormorant Garamond";font-size:11.5pt;font-weight:500}
p{margin:1.2mm 0}.small{font-size:8.5pt;color:${MUT}}
`;

const pair = (x, tag = "span") => `${esc(x[0])}<${tag} class="en">${esc(x[1])}</${tag}>`;
const li = (items, cls = "") => `<ul class="${cls}">${items.map((x) => `<li>${esc(x[0])}<span class="en">${esc(x[1])}</span></li>`).join("")}</ul>`;
const H3 = (x) => `<h3>${esc(x[0])}<span class="en">${esc(x[1])}</span></h3>`;

function cover() {
  const toc = [["1", "この教材の使い方", "How to use this programme"], ["2", "3日間の構成", "The three-day structure"], ["3", "1日目　VVIPの基準（12章）", "Day 1 · The VVIP standard (12 chapters)"], ["4", "2日目　接客の外国語", "Day 2 · Service language"], ["5", "3日目　実地練習と試験", "Day 3 · In-car practice and exams"], ["6", "試験、修了証、認証", "Exams, attestation and certification"], ["A", "乗務前チェックリスト", "Pre-departure checklist"], ["B", "車両の準備チェックリスト", "Vehicle preparation checklist"], ["C", "ミニバーとアメニティ", "Minibar and amenities"], ["D", "お客さまが実際に求める基準", "What a client actually asks for"], ["E", "講師用カード　譲れない10の規則", "Instructor's card · the ten non-negotiables"]];
  return `<div class="cover">${mark("22mm")}<div class="brand"><b>HIRE</b> driver japan · Academy</div><h1>${esc(META.title[0])}</h1><div class="en">${esc(META.title[1])}</div><div class="kick" style="margin-top:4mm">${esc(META.edition[0])} · ${esc(META.edition[1])}</div>
  <div class="toc" style="margin-top:12mm;text-align:left">${toc.map((t) => `<div><span>${t[0]}</span>${esc(t[1])}　<span class="en" style="color:${MUT};font-family:'Cormorant Garamond';margin:0">${esc(t[2])}</span></div>`).join("")}</div>
  <div class="conf">${esc(META.confidential[0])}<span class="en">${esc(META.confidential[1])}</span></div></div>`;
}
function intro() {
  return `<section><div class="kick">1</div><h2>${esc(INTRO.h[0])}</h2><span class="en">${esc(INTRO.h[1])}</span>${INTRO.paras.map((p) => `<p>${esc(p[0])}</p><p class="en">${esc(p[1])}</p>`).join("")}${H3(INTRO.materials.h)}${li(INTRO.materials.items, "chk")}</section>`;
}
function timetable() {
  return `<section class="pb"><div class="kick">2</div><h2>${esc(TIMETABLE.h[0])}</h2><span class="en">${esc(TIMETABLE.h[1])}</span><p class="small">${esc(TIMETABLE.note[0])} ${esc(TIMETABLE.note[1])}</p>${TIMETABLE.days.map((d) => `<div style="break-inside:avoid">${H3(d.h)}<table>${d.rows.map((r) => `<tr><td class="t">${r[0]}</td><td>${esc(r[1])}<span class="en" style="display:block">${esc(r[2])}</span></td></tr>`).join("")}</table></div>`).join("")}</section>`;
}
function chapter(c) {
  return `<section style="break-inside:auto"><div class="kick" style="margin-top:${c.n === 1 ? 0 : 8}mm">Day 1 · Chapter ${c.n}</div><h2 style="font-size:15pt">第${c.n}章　${esc(c.h[0])}</h2><span class="en">${esc(c.h[1])}</span>
  <div class="goals"><h4>学習の目標 · GOALS</h4>${li(c.goals)}</div>
  <h4 class="kick" style="margin:3mm 0 1mm">必ず教える規則 · MANDATORY RULES</h4>${li(c.rules, "rules")}
  <div class="notes"><h4>講師ノート · Teaching notes</h4>${c.notes.map((n) => `<p>${esc(n[0])}</p><p class="en">${esc(n[1])}</p>`).join("")}</div>
  <div class="ex"><h4>演習 · Exercise</h4><p>${esc(c.exercise[0])}</p><p class="en">${esc(c.exercise[1])}</p></div>
  <div class="mis"><h4>よくある間違い · Common mistakes</h4>${c.mistakes.map((m) => `<p>${esc(m[0])}<span class="en" style="display:block">${esc(m[1])}</span></p>`).join("")}</div></section>`;
}
function day1() { return `<section class="pb"><div class="kick">3</div><h2>1日目　VVIPの基準</h2><span class="en">Day 1 · The VVIP standard</span><p class="small">12章。各章：目標、必ず教える規則、講師ノート、演習、よくある間違い。 · Twelve chapters, each with goals, mandatory rules, teaching notes, an exercise and common mistakes.</p></section>` + DAY1.map(chapter).join(""); }
function day2() {
  const ph = CHAPTERS.find((c) => c.id === "LS-012").extra, pr = CHAPTERS.find((c) => c.id === "LS-013").extra[0], dl = ["LS-014", "LS-015", "LS-016", "LS-017"].flatMap((id) => CHAPTERS.find((c) => c.id === id).extra);
  return `<section class="pb"><div class="kick">4</div><h2>${esc(DAY2.h[0])}</h2><span class="en">${esc(DAY2.h[1])}</span><p>${esc(DAY2.intro[0])}</p><p class="en">${esc(DAY2.intro[1])}</p>
  ${H3(["教え方", "Method"])}${li(DAY2.method)}
  ${H3(DAY2.oral.h)}<table>${DAY2.oral.rows.map((r) => `<tr><td>${esc(r[0])}<span class="en" style="display:block">${esc(r[1])}</span></td><td class="pts">${r[2]}</td></tr>`).join("")}</table><p class="small">${esc(DAY2.oral.note[0])} ${esc(DAY2.oral.note[1])}</p>
  ${H3(["60のフレーズ（受講者用第12章と同じ）", "The 60 phrases (as in trainees' chapter 12)"])}<div class="two">${ph.map((b) => `<p><b>${esc(b.title[0])}</b> <span class="en">${esc(b.title[1])}</span></p><table>${b.items.map((x, i) => `<tr><td class="t">${i + 1}</td><td style="font-family:'Cormorant Garamond';font-size:11pt;font-weight:600">${esc(x[0])}</td><td>${esc(x[1])}</td></tr>`).join("")}</table>`).join("")}</div>
  ${H3(pr.title)}<table>${pr.rows.map((r) => `<tr><td>${esc(r[0])}</td><td style="font-family:'Cormorant Garamond';font-size:11pt;font-weight:600">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</table>
  ${H3(["ロールプレイの台本", "Role-play scripts"])}${dl.map((b) => `<p><b>${esc(b.title[0])}</b> <span class="en">${esc(b.title[1])}</span></p><table class="dl">${b.items.map((x) => `<tr><td class="s">${x[0] === "D" ? "運転手" : "客"}</td><td class="e">${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join("")}</table>`).join("")}</section>`;
}
function day3() {
  return `<section class="pb"><div class="kick">5</div><h2>${esc(DAY3.h[0])}</h2><span class="en">${esc(DAY3.h[1])}</span><p>${esc(DAY3.intro[0])}</p><p class="en">${esc(DAY3.intro[1])}</p>
  ${DAY3.scenarios.map((s) => `${H3(s.h)}<p>${esc(s.text[0])}</p><p class="en">${esc(s.text[1])}</p>`).join("")}
  ${H3(DAY3.practical.h)}<table>${DAY3.practical.rows.map((r) => `<tr><td>${esc(r[0])}<span class="en" style="display:block">${esc(r[1])}</span></td><td class="pts">${r[2]}</td></tr>`).join("")}</table><p class="small" style="color:${RED}">${esc(DAY3.practical.note[0])}<br>${esc(DAY3.practical.note[1])}</p>
  <section class="pb"><div class="kick">6</div><h2>${esc(EXAMS.h[0])}</h2><span class="en">${esc(EXAMS.h[1])}</span>${li(EXAMS.items)}</section></section>`;
}
function appendices() {
  const grp = (g) => `<div style="break-inside:avoid">${H3(g.h)}${li(g.items, "chk")}</div>`;
  return `<section class="pb"><div class="kick">Appendix A</div><h2>${esc(APPENDIX_A.h[0])}</h2><span class="en">${esc(APPENDIX_A.h[1])}</span>${li(APPENDIX_A.items, "chk")}</section>
  <section class="pb"><div class="kick">Appendix B</div><h2>${esc(APPENDIX_B.h[0])}</h2><span class="en">${esc(APPENDIX_B.h[1])}</span>${APPENDIX_B.groups.map(grp).join("")}</section>
  <section class="pb"><div class="kick">Appendix C</div><h2>${esc(APPENDIX_C.h[0])}</h2><span class="en">${esc(APPENDIX_C.h[1])}</span>${APPENDIX_C.groups.map(grp).join("")}</section>
  <section class="pb"><div class="kick">Appendix D</div><h2 style="font-size:14pt">${esc(APPENDIX_D.h[0])}</h2><span class="en">${esc(APPENDIX_D.h[1])}</span><p class="small">${esc(APPENDIX_D.intro[0])} ${esc(APPENDIX_D.intro[1])}</p>${APPENDIX_D.sections.map((s) => `${H3([s[0], s[1]])}<p>${esc(s[2][0])}</p><p class="en">${esc(s[2][1])}</p>`).join("")}</section>
  <section class="pb"><div class="kick">Appendix E</div><h2>${esc(QUICKCARD.h[0])}</h2><span class="en">${esc(QUICKCARD.h[1])}</span><div class="card"><ol>${QUICKCARD.items.map((x) => `<li>${esc(x[0])}<span class="en">${esc(x[1])}</span></li>`).join("")}</ol></div><p class="small">このページを切り取って、講師と受講者の手元に。 · Cut out this page for the instructor and every trainee.</p></section>`;
}

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${cover()}${intro()}${timetable()}${day1()}${day2()}${day3()}${appendices()}</body></html>`;
const tmp = path.join(OUT, ".instr.html"); fs.writeFileSync(tmp, html);
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--allow-file-access-from-files"] });
const p = await b.newPage(); await p.goto("file://" + tmp, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
const footer = `<div style="width:100%;font-size:7pt;font-family:Helvetica,Arial;color:#8a806e;padding:0 18mm;display:flex;justify-content:space-between"><span>HIRE driver japan Academy · 講師用プログラム · Instructor's Programme · 講師・運営用</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
await p.pdf({ path: path.join(OUT, "hdj-vvip-programme-instructor.pdf"), format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer, margin: { top: "20mm", bottom: "18mm", left: "18mm", right: "18mm" } });
await b.close(); fs.rmSync(tmp); console.log("ok hdj-vvip-programme-instructor.pdf");
