// Programma per il docente in UNA lingua (en, fr, zh), diviso in PDF per categoria + il volume completo.
// Uscita: pdf/instructor/{lang}/NN-nome.pdf. Uso: node gen_instructor_i18n.mjs [en|fr|zh|all]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META, INTRO, TIMETABLE, DAY1, DAY2, DAY3, EXAMS, APPENDIX_A, APPENDIX_B, APPENDIX_C, APPENDIX_D, QUICKCARD, CHAPTERS } from "./instructor.mjs";
import { FR } from "./instructor-fr.mjs";
import { ZH } from "./instructor-zh.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(HERE, "..", "..", "brand-kit", "fonts");
const GOLD = "#A9884C", INK = "#14110E", MUT = "#6b6254", RED = "#8E1B24";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f = (file) => `url("file://${path.join(FONTS, file)}")`;
const mark = (s) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="none" stroke="${GOLD}" stroke-width="2.4"/><text x="32" y="43" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="31" fill="${GOLD}">H</text></svg>`;
const DICT = { en: null, fr: FR, zh: ZH };
const MISSING = new Set();

// etichette di interfaccia per lingua
const UI = {
  en: { goals: "Goals", rules: "Mandatory rules", notes: "Teaching notes", ex: "Exercise", mis: "Common mistakes", ch: "Chapter", day: "Day", app: "Appendix", method: "Method", phrases: "The 60 phrases (as in trainees' chapter 12)", scripts: "Role-play scripts", driver: "Driver", client: "Client", cut: "Cut out this page for the instructor and every trainee.", contents: "Contents", part: "Part", complete: "Complete programme", academy: "HIRE driver japan Academy", prog: "Instructor's Programme", stress: "Stress", word: "Word", meaning: "Meaning" },
  fr: { goals: "Objectifs", rules: "Règles obligatoires", notes: "Notes pédagogiques", ex: "Exercice", mis: "Erreurs fréquentes", ch: "Chapitre", day: "Jour", app: "Annexe", method: "Méthode", phrases: "Les 60 phrases (chapitre 12 des stagiaires)", scripts: "Scripts des jeux de rôle", driver: "Chauffeur", client: "Client", cut: "Découper cette page pour le formateur et pour chaque stagiaire.", contents: "Sommaire", part: "Partie", complete: "Programme complet", academy: "HIRE driver japan Academy", prog: "Programme du formateur", stress: "Accent", word: "Mot", meaning: "Sens" },
  zh: { goals: "学习目标", rules: "必须讲授的规则", notes: "教学提示", ex: "练习", mis: "常见错误", ch: "第", day: "第", app: "附录", method: "教学方法", phrases: "60句常用语（学员第12章）", scripts: "角色扮演剧本", driver: "司机", client: "客人", cut: "请把本页剪下，交给讲师和每位学员。", contents: "目录", part: "部分", complete: "完整教学方案", academy: "HIRE driver japan Academy", prog: "讲师教学方案", stress: "重音", word: "单词", meaning: "释义" },
};
const CATS = {
  en: { overview: "Programme overview and timetable", day1: "Day 1, the VVIP standard", day2: "Day 2, service language", day3: "Day 3, in-car practice and exams", standard: "Standard rules", driver: "Driver rules", vehicle: "Vehicle rules", manners: "Manners and etiquette", confid: "Confidentiality and coordination", itin: "Itinerary and the unexpected", check: "Checklists", client: "The client's standard", card: "The ten non-negotiables", full: "Complete programme" },
  fr: { overview: "Présentation du programme et emploi du temps", day1: "Jour 1, le standard VVIP", day2: "Jour 2, la langue du service", day3: "Jour 3, pratique en voiture et examens", standard: "Règles du standard", driver: "Règles du chauffeur", vehicle: "Règles du véhicule", manners: "Savoir-vivre et protocole", confid: "Confidentialité et coordination", itin: "Itinéraire et imprévus", check: "Listes de contrôle", client: "Le standard du client", card: "Les dix règles non négociables", full: "Programme complet" },
  zh: { overview: "教学方案概要与时间表", day1: "第一天：VVIP标准", day2: "第二天：服务外语", day3: "第三天：实车练习与考试", standard: "标准规则", driver: "司机规则", vehicle: "车辆规则", manners: "礼仪与举止", confid: "保密与协作", itin: "行程与突发情况", check: "检查清单", client: "客人的标准", card: "十条不可妥协的规则", full: "完整教学方案" },
};

let L = "en", U = UI.en, C = CATS.en;
function t(pair) { const en = Array.isArray(pair) ? pair[1] : pair; if (L === "en") return en; const v = DICT[L][en]; if (v == null) { MISSING.add(en); return en; } return v; }
const tp = (k) => (L === "en" ? k.replace(/^(PHRASE|LINE|WORD)::/, "") : (DICT[L][k] ?? (MISSING.add(k), k.replace(/^(PHRASE|LINE|WORD)::/, ""))));

const CSS = `
@font-face{font-family:"Cormorant Garamond";src:${f("CormorantGaramond.ttf")};font-weight:300 700}
@font-face{font-family:"Jost";src:${f("Jost.ttf")};font-weight:100 900}
@font-face{font-family:"Noto Sans JP";src:${f("NotoSansJP.ttf")};font-weight:100 900}
@font-face{font-family:"Noto Sans SC";src:${f("NotoSansSC.ttf")};font-weight:100 900}
@page{size:A4;margin:20mm 18mm 18mm}
*{box-sizing:border-box}body{margin:0;font-family:${L === "zh" ? '"Noto Sans SC"' : '"Jost","Noto Sans JP"'};font-size:${L === "zh" ? "10.2pt" : "10.4pt"};line-height:1.65;color:${INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{height:257mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;border:.4mm solid ${GOLD};outline:1.2mm solid ${INK};outline-offset:2.5mm;padding:0 14mm}
.cover .brand{font-family:"Cormorant Garamond";font-size:14pt;letter-spacing:.06em;margin-top:3mm}.cover .brand b{color:${GOLD};font-weight:600}
.cover h1{font-family:"Cormorant Garamond";font-size:28pt;font-weight:600;margin:12mm 0 2mm;line-height:1.2}.cover .sub{font-family:"Cormorant Garamond";font-style:italic;font-size:16pt;color:${MUT}}
.cover .conf{margin-top:16mm;padding:3mm 6mm;border:.3mm solid ${RED};color:${RED};font-size:9pt}
.kick{font-family:Jost;font-size:8.5pt;letter-spacing:.18em;color:${GOLD};text-transform:uppercase}
h2{font-family:"Cormorant Garamond";font-size:21pt;font-weight:600;margin:1mm 0 4mm;line-height:1.25}
h3{font-family:"Cormorant Garamond";font-size:14pt;font-weight:600;margin:6mm 0 1.5mm;display:flex;gap:3mm;align-items:baseline;break-after:avoid}
h3::before{content:"";width:2mm;height:2mm;background:${GOLD};transform:rotate(45deg);flex:none;position:relative;top:-.6mm}
.pb{page-break-before:always}p{margin:1.4mm 0}.small{font-size:8.8pt;color:${MUT}}
.goals{border-left:1mm solid ${GOLD};background:#f7f2e8;padding:2.5mm 5mm;margin:3mm 0 4mm}.goals h4,.notes h4,.ex h4,.mis h4,.rh{margin:0 0 1mm;font-family:Jost;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:${GOLD}}
ul{margin:1mm 0 2mm;padding-left:5mm}li{margin:1.4mm 0;break-inside:avoid}
.rules{margin-left:0;padding-left:0}.rules li{list-style:none;border-bottom:.2mm solid #e8e0d0;padding:1.8mm 0 2mm}
.notes{background:#f3f0ea;border-radius:1.5mm;padding:2.5mm 4mm;margin:3mm 0}.ex{border:.3mm solid ${GOLD};border-radius:1.5mm;padding:2.5mm 4mm;margin:3mm 0}.mis{border-left:1mm solid ${RED};padding:1mm 4mm;margin:3mm 0}.mis h4{color:${RED}}
table{width:100%;border-collapse:collapse;font-size:9.4pt;margin:2mm 0 4mm}td,th{border-bottom:.2mm solid #e2d9c8;padding:1.6mm 2mm;vertical-align:top;text-align:left}th{font-size:8pt;color:${MUT};font-weight:500;background:#f7f2e8}tr{break-inside:avoid}
td.t{width:14mm;font-family:Jost;color:${GOLD};white-space:nowrap}td.pts{width:12mm;text-align:right;font-family:Jost;font-weight:600}
.chk li{list-style:none;padding-left:7mm;position:relative;margin:1.6mm 0}.chk li::before{content:"";position:absolute;left:0;top:1.4mm;width:3.4mm;height:3.4mm;border:.3mm solid ${INK}}
.card{border:.5mm solid ${GOLD};padding:5mm 7mm;margin:4mm 0}.card ol{margin:2mm 0 0;padding-left:6mm}.card li{margin:2.2mm 0;font-size:11.5pt}
.two{columns:2;column-gap:8mm}.en{font-family:"Cormorant Garamond";font-size:11.5pt;font-weight:600}
.dl td.s{width:18mm;white-space:nowrap;font-weight:600;color:${GOLD}}
.toc{font-size:10pt;line-height:1.9;text-align:left}.toc span{color:${GOLD};font-family:Jost;margin-right:3mm}
`;

const li = (items, cls = "") => `<ul class="${cls}">${items.map((x) => `<li>${esc(t(x))}</li>`).join("")}</ul>`;
const H3 = (x) => `<h3>${esc(t(x))}</h3>`;
const sec = (kick, title, body, pb = true) => `<section class="${pb ? "pb" : ""}"><div class="kick">${esc(kick)}</div><h2>${esc(title)}</h2>${body}</section>`;

function cover(title, sub, toc) {
  return `<div class="cover">${mark("22mm")}<div class="brand"><b>HIRE</b> driver japan · Academy</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div><div class="kick" style="margin-top:4mm">${esc(t(META.edition))}</div>${toc ? `<div class="toc" style="margin-top:10mm">${toc.map((x, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span>${esc(x)}</div>`).join("")}</div>` : ""}<div class="conf">${esc(t(META.confidential))}</div></div>`;
}
const intro = (pb) => sec("1", t(INTRO.h), INTRO.paras.map((p) => `<p>${esc(t(p))}</p>`).join("") + H3(INTRO.materials.h) + li(INTRO.materials.items, "chk"), pb);
const timetable = () => sec("2", t(TIMETABLE.h), `<p class="small">${esc(t(TIMETABLE.note))}</p>` + TIMETABLE.days.map((d) => `<div style="break-inside:avoid">${H3(d.h)}<table>${d.rows.map((r) => `<tr><td class="t">${r[0]}</td><td>${esc(t([r[1], r[2]]))}</td></tr>`).join("")}</table></div>`).join(""));
const chapter = (c, pb = false) => `<section class="${pb ? "pb" : ""}"><div class="kick" style="margin-top:${pb ? 0 : 8}mm">${esc(U.day)} 1 · ${esc(U.ch)} ${c.n}</div><h2>${esc(t(c.h))}</h2>
  <div class="goals"><h4>${esc(U.goals)}</h4>${li(c.goals)}</div><h4 class="rh" style="margin-top:3mm">${esc(U.rules)}</h4>${li(c.rules, "rules")}
  <div class="notes"><h4>${esc(U.notes)}</h4>${c.notes.map((n) => `<p>${esc(t(n))}</p>`).join("")}</div>
  <div class="ex"><h4>${esc(U.ex)}</h4><p>${esc(t(c.exercise))}</p></div>
  <div class="mis"><h4>${esc(U.mis)}</h4>${c.mistakes.map((m) => `<p>${esc(t(m))}</p>`).join("")}</div></section>`;
const chapters = (ns, firstPb = false) => ns.map((n, i) => chapter(DAY1.find((c) => c.n === n), i === 0 ? firstPb : false)).join("");
function day2() {
  const ph = CHAPTERS.find((c) => c.id === "LS-012").extra, pr = CHAPTERS.find((c) => c.id === "LS-013").extra[0], dl = ["LS-014", "LS-015", "LS-016", "LS-017"].flatMap((id) => CHAPTERS.find((c) => c.id === id).extra);
  const tr = (phrase) => (L === "en" ? "" : `<td>${esc(tp("PHRASE::" + phrase))}</td>`);
  return sec("4", t(DAY2.h), `<p>${esc(t(DAY2.intro))}</p><h3>${esc(U.method)}</h3>${li(DAY2.method)}
  ${H3(DAY2.oral.h)}<table>${DAY2.oral.rows.map((r) => `<tr><td>${esc(t([r[0], r[1]]))}</td><td class="pts">${r[2]}</td></tr>`).join("")}</table><p class="small">${esc(t(DAY2.oral.note))}</p>
  <h3>${esc(U.phrases)}</h3><div class="${L === "en" ? "two" : ""}">${ph.map((b) => `<p><b>${esc(t(b.title))}</b></p><table>${b.items.map((x, i) => `<tr><td class="t">${i + 1}</td><td class="en">${esc(x[0])}</td>${tr(x[0])}</tr>`).join("")}</table>`).join("")}</div>
  ${H3(pr.title)}<table><tr><th>${esc(U.word)}</th><th>${esc(U.stress)}</th>${L === "en" ? "" : `<th>${esc(U.meaning)}</th>`}</tr>${pr.rows.map((r) => `<tr><td class="en">${esc(r[1])}</td><td>${esc(r[2])}</td>${L === "en" ? "" : `<td>${esc(tp("WORD::" + r[1]))}</td>`}</tr>`).join("")}</table>
  <h3>${esc(U.scripts)}</h3>${dl.map((b) => `<p><b>${esc(t(b.title))}</b></p><table class="dl">${b.items.map((x) => `<tr><td class="s">${esc(x[0] === "D" ? U.driver : U.client)}</td><td class="en">${esc(x[1])}</td>${L === "en" ? "" : `<td>${esc(tp("LINE::" + x[1]))}</td>`}</tr>`).join("")}</table>`).join("")}`);
}
const day3 = () => sec("5", t(DAY3.h), `<p>${esc(t(DAY3.intro))}</p>${DAY3.scenarios.map((s) => `${H3(s.h)}<p>${esc(t(s.text))}</p>`).join("")}${H3(DAY3.practical.h)}<table>${DAY3.practical.rows.map((r) => `<tr><td>${esc(t([r[0], r[1]]))}</td><td class="pts">${r[2]}</td></tr>`).join("")}</table><p class="small" style="color:${RED}">${esc(t(DAY3.practical.note))}</p>`);
const exams = (pb = true) => sec("6", t(EXAMS.h), li(EXAMS.items), pb);
const grp = (g) => `<div style="break-inside:avoid">${H3(g.h)}${li(g.items, "chk")}</div>`;
const appA = (pb = true) => sec(U.app + " A", t(APPENDIX_A.h), li(APPENDIX_A.items, "chk"), pb);
const appB = (pb = true) => sec(U.app + " B", t(APPENDIX_B.h), APPENDIX_B.groups.map(grp).join(""), pb);
const appC = (pb = true) => sec(U.app + " C", t(APPENDIX_C.h), APPENDIX_C.groups.map(grp).join(""), pb);
const appD = (pb = true) => sec(U.app + " D", t(APPENDIX_D.h), `<p class="small">${esc(t(APPENDIX_D.intro))}</p>` + APPENDIX_D.sections.map((s) => `${H3([s[0], s[1]])}<p>${esc(t(s[2]))}</p>`).join(""), pb);
const card = (pb = true) => sec(U.app + " E", t(QUICKCARD.h), `<div class="card"><ol>${QUICKCARD.items.map((x) => `<li>${esc(t(x))}</li>`).join("")}</ol></div><p class="small">${esc(U.cut)}</p>`, pb);

// categorie → contenuto
const BOOKS = () => [
  ["00-programme-overview", C.overview, () => intro(false) + timetable() + exams()],
  ["01-day-1-vvip-standard", C.day1, () => chapters([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
  ["02-day-2-service-language", C.day2, () => day2().replace('class="pb"', 'class=""')],
  ["03-day-3-practice-and-exams", C.day3, () => day3().replace('class="pb"', 'class=""') + exams()],
  ["04-standard-rules", C.standard, () => chapters([1, 2]) + card()],
  ["05-driver-rules", C.driver, () => chapters([3]) + appA()],
  ["06-vehicle-rules", C.vehicle, () => chapters([4, 5]) + appB() + appC()],
  ["07-manners", C.manners, () => chapters([6, 8, 9])],
  ["08-confidentiality-and-coordination", C.confid, () => chapters([10, 11])],
  ["09-itinerary-and-unexpected", C.itin, () => chapters([7, 12])],
  ["10-checklists", C.check, () => appA(false) + appB() + appC()],
  ["11-client-standard", C.client, () => appD(false)],
  ["12-ten-non-negotiables", C.card, () => card(false)],
  ["13-complete-programme", C.full, () => intro(false) + timetable() + chapters([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], true) + day2() + day3() + exams() + appA() + appB() + appC() + appD() + card()],
];

const langs = (process.argv[2] || "all") === "all" ? ["en", "fr", "zh"] : [process.argv[2]];
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--allow-file-access-from-files"] });
const p = await b.newPage();
const made = [];
for (L of langs) {
  U = UI[L]; C = CATS[L]; MISSING.clear();
  const out = path.join(HERE, "pdf", "instructor", L); fs.mkdirSync(out, { recursive: true });
  const books = BOOKS();
  for (const [file, title, body] of books) {
    const toc = file.startsWith("13") ? books.slice(0, -1).map((x) => x[1]) : null;
    const html = `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${cover(title, `${t(META.title)}`, toc)}${body()}</body></html>`;
    const tmp = path.join(out, ".tmp.html"); fs.writeFileSync(tmp, html);
    await p.goto("file://" + tmp, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
    const footer = `<div style="width:100%;font-size:7pt;font-family:Helvetica,Arial;color:#8a806e;padding:0 18mm;display:flex;justify-content:space-between"><span>${esc(U.academy)} · ${esc(U.prog)} · ${esc(title)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
    await p.pdf({ path: path.join(out, `${file}.pdf`), format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer, margin: { top: "20mm", bottom: "18mm", left: "18mm", right: "18mm" } });
    fs.rmSync(tmp); made.push(`${L}/${file}.pdf`);
  }
  if (MISSING.size) { console.log(`[${L}] traduzioni mancanti: ${MISSING.size}`); for (const m of MISSING) console.log("  -", m.slice(0, 90)); }
}
await b.close(); console.log("PDF creati:", made.length);
