// Diplomi A4 orizzontali da stampare: 認証書 (VVIP Service Certificate) e 修了証 (Attestation of completion).
// Nome, numero e date si scrivono a mano; in basso a destra lo spazio per il timbro, a sinistra la coccarda rossa HDJ.
// Uso: node gen_certificates.mjs  (serve puppeteer-core e Google Chrome). Escono PDF vettoriali e PNG di anteprima.
import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(HERE, "..", "fonts");
const TEACHER = "Fulvio Conversi";
const GOLD = "#B08D4F", INK = "#14110E", RED = "#A3141F", RED2 = "#7E0E17", IVORY = "#FBF8F1";

const DOCS = {
  certificate: {
    file: "hdj-certificate-vvip",
    titleJa: "認 証 書", titleEn: "VVIP Service Certificate",
    leadJa: "下記の者は", leadEn: "This is to certify that",
    bodyJa: "HIRE driver japan が実施するVVIPサービス研修（3日間）を修了し、外国語の口頭試験、車両での実地シナリオ、筆記試験のすべてに合格したことを認証します。",
    bodyEn: "has completed the three-day VVIP service training of HIRE driver japan and passed the oral language examination, the in-car practical scenario and the written examination.",
    fields: [["認証番号", "No."], ["認証日", "Date of issue"], ["有効期限", "Valid until"], ["対応言語", "Languages"]],
    ring: "★ VVIP SERVICE ★ PROFESSIONAL CERTIFIED",
  },
  attestation: {
    file: "hdj-attestation-completion",
    titleJa: "修 了 証", titleEn: "Attestation of Completion",
    leadJa: "下記の者は", leadEn: "This is to attest that",
    bodyJa: "HIRE driver japan が実施するVVIPサービス研修の全日程を受講し、修了したことを証します。",
    bodyEn: "has attended and completed every day of the VVIP service training of HIRE driver japan.",
    fields: [["修了番号", "No."], ["修了日", "Date of completion"], ["研修", "Course"], ["対応言語", "Languages"]],
    ring: "★ VVIP TRAINING ★ COURSE COMPLETED",
  },
};

// coccarda rossa: bordo a petali, anello oro, HDJ al centro, testo sull'anello, due nastri dietro
function rosette(ring) {
  const cx = 100, cy = 92, R = 70, n = 36;
  let d = "";
  for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? R : R - 6; d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`; }
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="rg" cx="40%" cy="35%"><stop offset="0" stop-color="#D23A3F"/><stop offset=".6" stop-color="${RED}"/><stop offset="1" stop-color="${RED2}"/></radialGradient>
  <linearGradient id="rb" x1="0" x2="1"><stop offset="0" stop-color="${RED2}"/><stop offset=".5" stop-color="${RED}"/><stop offset="1" stop-color="${RED2}"/></linearGradient>
  <path id="ringpath" d="M ${cx},${cy} m -49,0 a 49,49 0 1,1 98,0 a 49,49 0 1,1 -98,0"/></defs>
  <path d="M70,130 L48,238 L64,226 L76,244 L96,140 Z" fill="url(#rb)"/>
  <path d="M130,130 L152,238 L136,226 L124,244 L104,140 Z" fill="url(#rb)"/>
  <path d="${d}Z" fill="url(#rg)" stroke="${RED2}" stroke-width="1"/>
  <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${GOLD}" stroke-width="2.2"/>
  <circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="${GOLD}" stroke-width="1"/>
  <text font-family="Jost" font-weight="500" font-size="9" fill="#F3E3BF"><textPath href="#ringpath" startOffset="0" textLength="300" lengthAdjust="spacing">${ring}</textPath></text>
  <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-family="Cormorant Garamond" font-weight="700" font-size="31" letter-spacing="1" fill="#F3E3BF">HDJ</text>
  </svg>`;
}

const mark = `<svg viewBox="0 0 64 64" width="15mm" height="15mm"><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="none" stroke="${GOLD}" stroke-width="2.4"/><polygon points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width=".8"/><text x="32" y="43" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="31" fill="${GOLD}">H</text></svg>`;

function html(doc) {
  const f = (file) => `url("file://${path.join(FONTS, file)}")`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
@font-face{font-family:"Cormorant Garamond";src:${f("CormorantGaramond.ttf")};font-weight:300 700}
@font-face{font-family:"Cormorant Garamond";font-style:italic;src:${f("CormorantGaramond-Italic.ttf")};font-weight:300 700}
@font-face{font-family:"Jost";src:${f("Jost.ttf")};font-weight:100 900}
@font-face{font-family:"Noto Serif JP";src:${f("NotoSerifJP.ttf")};font-weight:200 900}
@font-face{font-family:"Noto Sans JP";src:${f("NotoSansJP.ttf")};font-weight:100 900}
@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}
html,body{margin:0;width:297mm;height:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:297mm;height:210mm;background:${IVORY};color:${INK};overflow:hidden}
.f1{position:absolute;inset:8mm;border:1.1mm solid ${INK}}
.f2{position:absolute;inset:10.6mm;border:.35mm solid ${GOLD}}
.f3{position:absolute;inset:12mm;border:.15mm solid ${GOLD}}
.c{position:absolute;width:7mm;height:7mm;border:.35mm solid ${GOLD};background:${IVORY};transform:rotate(45deg)}
.wm{position:absolute;left:50%;top:50%;width:120mm;height:120mm;transform:translate(-50%,-50%);opacity:.045}
.top{position:absolute;top:19mm;left:0;right:0;text-align:center}
.brand{font-family:"Cormorant Garamond";font-size:5.2mm;letter-spacing:.06em;margin-top:1mm}.brand b{color:${GOLD};font-weight:600}.brand span{font-family:Jost;font-weight:300;font-size:4mm;letter-spacing:.08em}
h1{font-family:"Noto Serif JP";font-weight:700;font-size:15mm;letter-spacing:.35em;margin:6mm 0 0;padding-left:.35em;line-height:1}
.en{font-family:"Cormorant Garamond";font-style:italic;font-weight:500;font-size:7.4mm;color:${GOLD};margin-top:2.2mm;letter-spacing:.02em}
.lead{position:absolute;top:79mm;left:0;right:0;text-align:center;font-family:"Noto Serif JP";font-size:4.2mm}
.lead i{display:block;font-family:"Cormorant Garamond";font-size:4.6mm;color:#5b5143;margin-top:.6mm}
.name{position:absolute;top:99mm;left:58mm;right:58mm;border-bottom:.35mm solid ${INK};height:16mm}
.name small{position:absolute;right:0;bottom:-5.2mm;font-family:Jost;font-size:2.8mm;color:#7a705f;letter-spacing:.1em}
.name em{position:absolute;left:0;bottom:-5.2mm;font-style:normal;font-family:"Noto Sans JP";font-size:2.8mm;color:#7a705f;letter-spacing:.1em}
.body{position:absolute;top:123mm;left:52mm;right:52mm;text-align:center;font-family:"Noto Serif JP";font-size:3.7mm;line-height:1.75}
.body i{display:block;font-family:"Cormorant Garamond";font-size:4.25mm;line-height:1.35;color:#3d352b;margin-top:1.2mm}
.fields{position:absolute;top:150mm;left:58mm;right:58mm;display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.fields div{border-bottom:.25mm solid #9b8f7a;height:9mm;position:relative}
.fields span{position:absolute;bottom:-4.6mm;left:0;font-family:"Noto Sans JP";font-size:2.5mm;color:#7a705f;white-space:nowrap}.fields span b{font-family:Jost;font-weight:400;letter-spacing:.06em;margin-left:1.2mm}
.ros{position:absolute;left:18mm;bottom:16mm;width:44mm}
.sig{position:absolute;bottom:25mm;left:118mm;width:62mm;text-align:center;border-top:.3mm solid ${INK};padding-top:1.5mm;font-family:"Noto Sans JP";font-size:2.7mm;color:#5b5143}
.sig b{display:block;font-family:"Cormorant Garamond";font-size:4.2mm;color:${INK};font-weight:600;margin-top:.4mm}
.stamp{position:absolute;right:24mm;bottom:19mm;width:30mm;height:30mm;border:.35mm dashed #b9ad97;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:"Noto Serif JP";color:#b9ad97;font-size:6mm}
.stamp small{font-family:Jost;font-size:2.2mm;letter-spacing:.12em;margin-top:.6mm}
.foot{position:absolute;bottom:15mm;left:0;right:0;text-align:center;font-family:"Noto Sans JP";font-size:2.3mm;color:#8a806e;line-height:1.5}
</style></head><body><div class="pg">
<div class="f1"></div><div class="f2"></div><div class="f3"></div>
${[[8.55, 8.55], [8.55, 288.45], [201.45, 8.55], [201.45, 288.45]].map(([t, l]) => `<div class="c" style="top:${t - 3.5}mm;left:${l - 3.5}mm"></div>`).join("")}
<div class="wm">${mark.replace('width="15mm" height="15mm"', 'width="120mm" height="120mm"')}</div>
<div class="top">${mark}<div class="brand"><b>HIRE</b> <span>driver japan</span></div><h1>${doc.titleJa}</h1><div class="en">${doc.titleEn}</div></div>
<div class="lead">${doc.leadJa}<i>${doc.leadEn}</i></div>
<div class="name"><em>氏名</em><small>NAME</small></div>
<div class="body">${doc.bodyJa}<i>${doc.bodyEn}</i></div>
<div class="fields">${doc.fields.map(([j, e]) => `<div><span>${j}<b>${e}</b></span></div>`).join("")}</div>
<div class="ros">${rosette(doc.ring)}</div>
<div class="sig">講師 Instructor<b>${TEACHER}</b></div>
<div class="stamp">印<small>HDJ</small></div>
<div class="foot">本書は HIRE driver japan が発行する民間の${doc.titleJa.replace(/ /g, "")}であり、国家資格・公的資格ではありません。真正性は hiredriverjapan.com/verify で番号を入力して確認できます。<br>Private document issued by HIRE driver japan. Not a national or government qualification. Verify the number at hiredriverjapan.com/verify</div>
</div></body></html>`;
}

const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--allow-file-access-from-files"] });
const p = await b.newPage();
for (const doc of Object.values(DOCS)) {
  const tmp = path.join(HERE, `.${doc.file}.html`);
  (await import("node:fs")).writeFileSync(tmp, html(doc));
  await p.goto("file://" + tmp, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(HERE, `${doc.file}.pdf`), width: "297mm", height: "210mm", printBackground: true, pageRanges: "1" });
  await p.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1.6 });
  await p.screenshot({ path: path.join(HERE, `${doc.file}-preview.png`) });
  (await import("node:fs")).rmSync(tmp);
  console.log("ok", doc.file);
}
await b.close();
