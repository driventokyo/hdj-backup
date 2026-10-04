// Esporta i testi del sito in markdown, un file per lingua: node export_texts.mjs
import fs from "node:fs";
import { CONFIG as C } from "./config.mjs";
const NAME = { ja: "日本語", zh: "简体中文", en: "English" };
const sub = (s) => String(s ?? "").replace(/\{\{BRAND\}\}/g, C.BRAND_NAME).replace(/\{\{CERT\}\}/g, C.CERT_NAME)
  .replace(/\{\{COMPANY\}\}/g, "6株式会社 / 6 Ltd").replace(/\{\{TEACHER\}\}/g, C.TEACHER_NAME || "[TEACHER_NAME]")
  .replace(/\{\{PH:([^}]+)\}\}/g, "[DA COMPLETARE: $1]").replace(/\{\{PRICE:(\w+)\}\}/g, (_, k) => C.PRICES[k].hourly ? `¥${C.PRICES[k].hourly}/h` : "[PREZZO]")
  .replace(/\{\{MIN:(\w+)\}\}/g, (_, k) => C.PRICES[k].minHours).replace(/\{\{TPRICE:(\w+)\}\}/g, (_, k) => "¥" + C.TRAINING_PRICES[k].toLocaleString("en-US"))
  .replace(/\{\{LINK:\w+\|([^}]+)\}\}/g, "$1").replace(/<\/?(strong|em|br)>/g, "");
fs.mkdirSync("texts", { recursive: true });
for (const l of C.LANGS) {
  const c = (await import(`./content/${l}.mjs`)).default; const o = [`# ${NAME[l]} · testi del sito`, ""];
  for (const [k, p] of Object.entries(c.pages)) {
    o.push(`## /${l}/${k === "home" ? "" : k + "/"}`, "", `- **Title:** ${sub(p.title)}`, `- **Meta description:** ${sub(p.meta)}`, `- **H1:** ${sub(p.h1)}`, "");
    if (p.hero) { if (p.hero.kicker) o.push(`Occhiello: ${sub(p.hero.kicker)}`, ""); if (p.hero.sub) o.push(sub(p.hero.sub), ""); if (p.hero.line) o.push(sub(p.hero.line), ""); if (p.hero.ctas) o.push("CTA: " + p.hero.ctas.map((x) => sub(x.label)).join(" / "), ""); }
    if (p.sub) o.push(sub(p.sub), "");
    for (const b of p.blocks || []) {
      if (b.h2) o.push(`### ${sub(b.h2)}`, ""); if (b.intro) o.push(sub(b.intro), "");
      (b.paras || []).forEach((x) => o.push(sub(x), "")); (b.list || []).forEach((x) => o.push("- " + sub(x))); if (b.list) o.push("");
      if (b.items && b.type === "faq") b.items.forEach((q) => o.push(`**${sub(q.q)}**`, "", sub(q.a), ""));
      else if (b.items && b.type === "chips") o.push(b.items.map(sub).join(" · "), "");
      else if (b.items) b.items.forEach((it) => { o.push(`**${sub(it.h3)}**${it.tag ? " (" + sub(it.tag) + ")" : ""}`); if (it.p) o.push(sub(it.p)); (it.list || []).forEach((x) => o.push("- " + sub(x))); if (it.meta) o.push(sub(it.meta)); if (it.foot) o.push(sub(it.foot)); o.push(""); });
      if (b.type === "table") { o.push("| " + b.head.map(sub).join(" | ") + " |", "|" + b.head.map(() => "---").join("|") + "|"); b.rows.forEach((r) => o.push("| " + r.map(sub).join(" | ") + " |")); o.push(""); (b.notes || []).forEach((n) => o.push(sub(n), "")); }
      if (b.type === "profile") { o.push(`**${sub(b.name)}**`, ...b.paras.map(sub), ""); }
      if (b.type === "form") o.push(`[Modulo: ${b.form}] pulsante: ${sub(b.submit)}`, "");
      if (b.type === "verify") o.push("[Campo di verifica del certificato]", "");
      if (b.note) o.push(sub(b.note), "");
    }
  }
  o.push("## Testi comuni", "", `- **Piede di pagina:** ${sub(c.footerLegal)}`, "");
  fs.writeFileSync(`texts/${l}.md`, o.join("\n"));
  console.log(`texts/${l}.md`, o.length, "righe");
}
