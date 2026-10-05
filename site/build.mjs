// Generatore statico: content/{lang}.mjs + config.mjs -> dist/
// Uso: node build.mjs
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { CONFIG as C } from "./config.mjs";
import { POSTS } from "./content/blog.mjs";

const OUT = path.resolve("dist");
const LANG_META = { ja: { html: "ja", og: "ja_JP", label: "日本語" }, zh: { html: "zh-Hans", og: "zh_CN", label: "中文" }, en: { html: "en", og: "en_US", label: "English" } };
const PAGES = ["home", "companies", "drivers", "training", "verify", "privacy", "tokushoho"];
const SLUG = { home: "", blog: "blog/", tokushoho: "legal/", companies: "companies/", drivers: "drivers/", training: "training/", verify: "verify/", privacy: "privacy/" };
const content = {};
for (const l of C.LANGS) content[l] = (await import(`./content/${l}.mjs`)).default;

const missing = new Set();
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const yen = (n, l) => (l === "en" ? "¥" + n.toLocaleString("en-US") : n.toLocaleString("ja-JP") + (l === "zh" ? "日元" : "円"));

// Sostituzioni nei testi: {{BRAND}} {{CERT}} {{COMPANY}} {{TEACHER}} {{PH:testo}} {{PRICE:tier}} {{TPRICE:key}} {{MIN:tier}} {{LINK:page|testo}}
function fill(s, l) {
  const t = content[l].ui;
  return String(s)
    .replace(/\{\{BRAND\}\}/g, esc(C.BRAND_NAME))
    .replace(/\{\{CERT\}\}/g, esc(C.CERT_NAME))
    .replace(/\{\{COMPANY\}\}/g, esc(l === "en" ? C.COMPANY_EN : l === "zh" ? C.COMPANY_ZH : C.COMPANY_JA))
    .replace(/\{\{TEACHER\}\}/g, () => { if (!C.TEACHER_NAME) { missing.add("TEACHER_NAME"); return `<mark class="ph">${esc(t.teacherPh)}</mark>`; } return esc(C.TEACHER_NAME); })
    .replace(/\{\{ADDRESS\}\}/g, () => C.COMPANY_ADDRESS ? esc(l === "en" && C.COMPANY_ADDRESS_EN ? C.COMPANY_ADDRESS_EN : C.COMPANY_ADDRESS) : (missing.add("COMPANY_ADDRESS"), `<mark class="ph">${esc(t.addressPh)}</mark>`))
    .replace(/\{\{REP\}\}/g, () => { const r = l === "en" ? C.REPRESENTATIVE_EN || C.REPRESENTATIVE_JA : C.REPRESENTATIVE_JA; if (!r) { missing.add("REPRESENTATIVE_JA / REPRESENTATIVE_EN"); return `<mark class="ph">${esc(t.repPh || "—")}</mark>`; } return esc(r); })
    .replace(/\{\{PRIVACY_EMAIL\}\}/g, () => { const e = C.PRIVACY_EMAIL || C.CONTACT_EMAIL; if (!e) { missing.add("PRIVACY_EMAIL"); return `<mark class="ph">${esc(t.emailPh || "—")}</mark>`; } return `<a href="mailto:${esc(e)}">${esc(e)}</a>`; })
    .replace(/\{\{PRIVACY_DATE\}\}/g, () => { if (!C.PRIVACY_DATE) { missing.add("PRIVACY_DATE"); return `<mark class="ph">${esc(t.datePh || "—")}</mark>`; } const [y, m, d] = C.PRIVACY_DATE.split("-").map(Number); return l === "en" ? new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : `${y}年${m}月${d}日`; })
    .replace(/\{\{PH:([^}]+)\}\}/g, (_, x) => { missing.add("Placeholder nei testi: " + x); return `<mark class="ph">${x}</mark>`; })
    .replace(/\{\{PRICE:(\w+)\}\}/g, (_, k) => { const p = C.PRICES[k].hourly; if (p == null) { missing.add(`PRICES.${k}.hourly`); return esc(t.onQuote); } return esc(t.fromHour.replace("%", yen(p, l))); })
    .replace(/\{\{MAXG\}\}/g, () => String(C.MAX_GROUP))
    .replace(/\{\{MIN:(\w+)\}\}/g, (_, k) => String(C.PRICES[k].minHours))
    .replace(/\{\{TPRICE:(\w+)\}\}/g, (_, k) => esc(yen(C.TRAINING_PRICES[k], l)))
    .replace(/\{\{LINK:(\w+)\|([^}]+)\}\}/g, (_, p, x) => `<a href="/${l}/${SLUG[p]}">${x}</a>`);
}
const F = (s, l) => fill(esc(s).replace(/&lt;(\/?)(strong|em|br)&gt;/g, "<$1$2>"), l); // testo con poche etichette ammesse

function block(b, l) {
  const t = content[l].ui;
  const id = b.id ? ` id="${b.id}"` : "";
  const h2 = b.h2 ? `<h2>${F(b.h2, l)}</h2>` : "";
  const intro = b.intro ? `<p class="intro">${F(b.intro, l)}</p>` : "";
  switch (b.type) {
    case "text":
      return `<section${id} class="sec">${h2}${intro}${(b.paras || []).map((p) => `<p>${F(p, l)}</p>`).join("")}${b.list ? `<ul class="ticks">${b.list.map((x) => `<li>${F(x, l)}</li>`).join("")}</ul>` : ""}${b.note ? `<p class="note">${F(b.note, l)}</p>` : ""}</section>`;
    case "post":
      return `<article class="sec post">${b.lead ? `<p class="intro">${F(b.lead, l)}</p>` : ""}${b.sections.map((x) => `<h2>${F(x.h2, l)}</h2>${(x.paras || []).map((q) => `<p>${F(q, l)}</p>`).join("")}${x.list ? `<ul class="ticks">${x.list.map((q) => `<li>${F(q, l)}</li>`).join("")}</ul>` : ""}`).join("")}${b.imgs && b.imgs.length ? b.imgs.map((im) => `<figure class="pimg"><img src="${im.src}" alt="${esc(im["alt_" + l] || im.alt_en || "")}" loading="lazy" decoding="async">${im.credit ? `<figcaption>${esc(im.credit)}</figcaption>` : ""}</figure>`).join("") : ""}${b.note ? `<p class="note">${F(b.note, l)}</p>` : ""}</article>`;
    case "postlist":
      return `<section class="sec"><div class="plist">${b.items.map((x) => `<a class="pcard" href="${x.href}"><span class="pdate">${esc(x.date)}</span><strong>${esc(x.title)}</strong><span>${esc(x.meta)}</span><em>${esc(t.readMore)}</em></a>`).join("")}</div></section>`;
    case "figures":
      return `<section${id} class="sec">${h2}${intro}<div class="figs">${b.items.map((it) => `<figure class="fig">${it.href ? `<a href="/${l}/${SLUG[it.href]}">` : ""}<img src="${it.src}" alt="${esc(fill(it.alt, l))}" width="${it.w}" height="${it.h}" loading="lazy" decoding="async">${it.href ? "</a>" : ""}<figcaption><strong>${F(it.h3, l)}</strong>${it.p ? `<span>${F(it.p, l)}</span>` : ""}</figcaption></figure>`).join("")}</div>${b.note ? `<p class="note">${F(b.note, l)}</p>` : ""}${b.cta ? `<p class="ctas"><a class="btn ghost" href="${b.cta.href.startsWith("#") ? b.cta.href : `/${l}/${SLUG[b.cta.href]}`}">${F(b.cta.label, l)}</a></p>` : ""}</section>`;
    case "cards":
      return `<section${id} class="sec">${h2}${intro}<div class="cards c${b.cols || 3}">${b.items.map((it) => `<article class="card">${it.tag ? `<p class="tag">${F(it.tag, l)}</p>` : ""}<h3>${F(it.h3, l)}</h3>${it.p ? `<p>${F(it.p, l)}</p>` : ""}${it.list ? `<ul>${it.list.map((x) => `<li>${F(x, l)}</li>`).join("")}</ul>` : ""}${it.meta ? `<p class="meta">${F(it.meta, l)}</p>` : ""}${it.foot ? `<p class="foot">${F(it.foot, l)}</p>` : ""}</article>`).join("")}</div>${b.note ? `<p class="note">${F(b.note, l)}</p>` : ""}</section>`;
    case "steps":
      return `<section${id} class="sec">${h2}${intro}<ol class="steps">${b.items.map((it) => `<li><strong>${F(it.h3, l)}</strong><span>${F(it.p, l)}</span></li>`).join("")}</ol>${b.note ? `<p class="note">${F(b.note, l)}</p>` : ""}</section>`;
    case "table":
      return `<section${id} class="sec">${h2}${intro}<div class="tbl"><table><thead><tr>${b.head.map((h) => `<th scope="col">${F(h, l)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${F(c, l)}</th>` : `<td>${F(c, l)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>${(b.notes || []).map((n) => `<p class="note">${F(n, l)}</p>`).join("")}</section>`;
    case "notice":
      return `<aside${id} class="notice">${b.h2 ? `<strong>${F(b.h2, l)}</strong>` : ""}${(b.paras || []).map((p) => `<p>${F(p, l)}</p>`).join("")}${b.cta ? `<p><a class="btn" href="${esc(b.cta.href)}">${F(b.cta.label, l)}</a></p>` : ""}</aside>`;
    case "chips":
      return `<section${id} class="sec">${h2}${intro}<ul class="chips">${b.items.map((x) => `<li>${F(x, l)}</li>`).join("")}</ul></section>`;
    case "profile":
      return `<section${id} class="sec profile">${h2}<div class="prof">${b.photo ? `<img class="photo" src="${b.photo.src}" alt="${esc(fill(b.photo.alt, l))}" width="${b.photo.w}" height="${b.photo.h}" loading="lazy" decoding="async">` : `<div class="photo" role="img" aria-label="${esc(t.photoPh)}"><span>${esc(t.photoPh)}</span></div>`}<div><p class="pname">${F(b.name, l)}</p>${b.paras.map((p) => `<p>${F(p, l)}</p>`).join("")}${b.chips ? `<ul class="chips">${b.chips.map((x) => `<li>${F(x, l)}</li>`).join("")}</ul>` : ""}${b.link ? `<p><a href="/${l}/${SLUG[b.link.page]}">${F(b.link.label, l)}</a></p>` : ""}</div></div></section>`;
    case "faq":
      return `<section${id} class="sec">${h2}<div class="faq">${b.items.map((q) => `<details><summary>${F(q.q, l)}</summary><div><p>${F(q.a, l)}</p></div></details>`).join("")}</div></section>`;
    case "form":
      return formBlock(b, l);
    case "verify":
      return `<section${id} class="sec verify">${h2}${intro}<form class="vform" action="/verify/" method="get" data-verify><label for="cert-id">${esc(t.certNo)}</label><div class="row"><input id="cert-id" name="id" inputmode="numeric" pattern="\\d{4}-\\d{4}" placeholder="2026-0001" required autocomplete="off"><button type="submit">${esc(t.verifyBtn)}</button></div><p class="note">${esc(t.verifyHint)}</p><button type="button" class="ghost" data-scan hidden>${esc(t.scanBtn)}</button><video data-cam hidden playsinline muted></video></form></section>`;
    default:
      throw new Error("blocco sconosciuto " + b.type);
  }
}

// Form: definizione dei campi comune, etichette per lingua
const FORMS = {
  corporate: ["company*", "contact*", "email*", "phone", "plan", "date", "hours", "languages", "vehicle", "city*", "line", "wechat", "message", "consent*"],
  operator: ["company*", "optype*", "city*", "fleet", "interest", "languages", "contact*", "email*", "phone", "line", "wechat", "message", "consent*"],
  training: ["company*", "optype*", "drivers*", "languages", "period", "city*", "contact*", "email*", "phone", "line", "wechat", "message", "consent*"],
  driver: ["name*", "email*", "phone*", "city*", "license*", "licyears", "languages*", "langlevel", "status*", "days", "message", "consent*"],
  book: ["date*", "hours", "languages", "company*", "contact*", "email*", "phone", "city*", "message", "consent*"],
};
function field(key, l) {
  const req = key.endsWith("*"); const k = key.replace("*", "");
  const f = content[l].form.fields[k]; if (!f) throw new Error(`campo ${k} senza etichetta in ${l}`);
  const rq = req ? " required" : ""; const star = req ? ` <span class="req" aria-hidden="true">*</span>` : ` <span class="opt">${esc(content[l].ui.optional)}</span>`;
  const lab = `<label for="f-${k}">${esc(f.label)}${star}</label>`;
  if (k === "consent") return `<div class="fld check"><input type="checkbox" id="f-${k}" name="${k}" value="1"${rq}><label for="f-${k}">${F(f.label, l)} <a href="/${l}/privacy/">${esc(content[l].ui.privacyLink)}</a></label></div>`;
  if (f.options && f.multi) return `<fieldset class="fld"><legend>${esc(f.label)}${star}</legend><div class="opts">${f.options.map(([v, x]) => `<label><input type="checkbox" name="${k}" value="${v}"> ${esc(x)}</label>`).join("")}</div></fieldset>`;
  if (f.options) return `<div class="fld">${lab}<select id="f-${k}" name="${k}"${rq}><option value="">${esc(content[l].ui.choose)}</option>${f.options.map(([v, x]) => `<option value="${v}">${esc(x)}</option>`).join("")}</select></div>`;
  if (k === "message") return `<div class="fld wide">${lab}<textarea id="f-${k}" name="${k}" rows="4" maxlength="2000"${rq}></textarea></div>`;
  const type = k === "email" ? "email" : k === "phone" ? "tel" : ["drivers", "fleet", "hours", "licyears"].includes(k) ? "number" : "text";
  const ac = { email: "email", phone: "tel", contact: "name", name: "name", company: "organization" }[k];
  return `<div class="fld">${lab}<input type="${type}" id="f-${k}" name="${k}"${type === "number" ? ' min="1" max="999" inputmode="numeric"' : ""}${ac ? ` autocomplete="${ac}"` : ""}${f.ph ? ` placeholder="${esc(f.ph)}"` : ""} maxlength="200"${rq}></div>`;
}
function formBlock(b, l) {
  const t = content[l].ui;
  const ts = C.TURNSTILE_SITEKEY ? `<div class="cf-turnstile" data-sitekey="${C.TURNSTILE_SITEKEY}"></div>` : "";
  return `<section id="${b.id || "form"}" class="sec formsec${b.accent ? " accent" : ""}">${b.accent ? '<div class="inner">' : ""}${b.h2 ? `<h2>${F(b.h2, l)}</h2>` : ""}${b.intro ? `<p class="intro">${F(b.intro, l)}</p>` : ""}<form class="lead" data-lead="${b.form}" novalidate><input type="hidden" name="type" value="${b.form}"><input type="hidden" name="lang" value="${l}"><div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><div class="grid">${FORMS[b.form].map((k) => field(k, l)).join("")}</div>${ts}<button type="submit">${F(b.submit, l)}</button><p class="status" role="status" aria-live="polite" data-ok="${esc(t.formOk)}" data-err="${esc(t.formErr)}" data-invalid="${esc(t.formInvalid)}" data-sending="${esc(t.sending)}"></p></form>${b.accent ? "</div>" : ""}</section>`;
}

// Anteprima dei link (WhatsApp, LINE, Facebook, X, Slack) e icone. Cambiare OG_VER quando cambiano le immagini og: le app tengono in cache per URL.
const OG_VER = 3;
const ICONS = `<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/icon-96.png" type="image/png" sizes="96x96"><link rel="icon" href="/assets/icon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/assets/icon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#14110E">`;
const GA4 = C.GA4_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${C.GA4_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${C.GA4_ID}");</script>` : "";
const GSC = C.GSC_VERIFICATION ? `<meta name="google-site-verification" content="${C.GSC_VERIFICATION}">` : "";
function social(l, title, desc, url) {
  const img = `${C.SITE_URL}/assets/og-${l}-${OG_VER}.png`;
  return `<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(C.BRAND_NAME)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${LANG_META[l].og}">${C.LANGS.filter((x) => x !== l).map((x) => `<meta property="og:locale:alternate" content="${LANG_META[x].og}">`).join("")}<meta property="og:image" content="${img}"><meta property="og:image:secure_url" content="${img}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(C.BRAND_NAME)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${img}">${ICONS}${GSC}${GA4}`;
}

function jsonld(page, l, p) {
  const org = { "@type": "Organization", "@id": C.SITE_URL + "/#org", name: C.BRAND_NAME, alternateName: [C.BRAND_KANA, C.BRAND_ZH], sameAs: ["https://driventokyo.com", "https://6ltd.jp", "https://awahome.jp"], url: C.SITE_URL + "/", logo: { "@type": "ImageObject", url: C.SITE_URL + "/assets/icon-512.png", width: 512, height: 512 }, address: { "@type": "PostalAddress", addressRegion: "Tokushima", addressCountry: "JP" }, areaServed: { "@type": "City", name: "Tokyo" }, contactPoint: { "@type": "ContactPoint", contactType: "sales", email: C.CONTACT_EMAIL || undefined, availableLanguage: ["ja", "en", "it", "fr", "es"] } };
  if (C.CONTACT_EMAIL) org.email = C.CONTACT_EMAIL;
  const graph = [org, { "@type": "WebSite", "@id": C.SITE_URL + "/#site", name: C.BRAND_NAME, alternateName: [C.BRAND_KANA, C.BRAND_ZH], url: C.SITE_URL + "/", inLanguage: LANG_META[l].html, publisher: { "@id": C.SITE_URL + "/#org" } }];
  if (page === "training") {
    graph.push({ "@type": "Course", name: C.CERT_NAME, description: p.meta, inLanguage: LANG_META[l].html, provider: { "@id": C.SITE_URL + "/#org" },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "Onsite", courseWorkload: "PT21H", location: { "@type": "Place", name: "Tokyo", address: { "@type": "PostalAddress", addressLocality: "Tokyo", addressCountry: "JP" } } },
      offers: { "@type": "Offer", category: "Paid", priceCurrency: "JPY", price: C.TRAINING_PRICES.full } });
  }
  if (page === "home" || page === "companies") graph.push({ "@type": "Service", name: p.h1.replace(/<[^>]+>/g, ""), serviceType: page === "home" ? "Multilingual professional driver for hire car operators" : "Chauffeur", areaServed: { "@type": "City", name: "Tokyo" }, provider: { "@id": C.SITE_URL + "/#org" }, description: p.meta });
  if (p.article) graph.push({ "@type": "BlogPosting", headline: p.h1, description: p.meta, datePublished: p.article.date, dateModified: p.article.updated || p.article.date, inLanguage: LANG_META[l].html, author: { "@type": "Person", name: C.TEACHER_NAME }, publisher: { "@id": C.SITE_URL + "/#org" }, mainEntityOfPage: p.url, ...(p.article.image ? { image: C.SITE_URL + p.article.image } : {}) });
  if (p.article) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: C.BRAND_NAME, item: `${C.SITE_URL}/${l}/` }, { "@type": "ListItem", position: 2, name: content[l].ui.blogLink, item: `${C.SITE_URL}/${l}/blog/` }, { "@type": "ListItem", position: 3, name: p.h1, item: p.url }] });
  else   if (page !== "home") graph.push({ "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: C.BRAND_NAME, item: `${C.SITE_URL}/${l}/` },
    { "@type": "ListItem", position: 2, name: (content[l].nav.find(([k]) => k === page) || [, p.h1])[1].replace(/<[^>]+>/g, "").replace(/\{\{CERT\}\}/g, C.CERT_NAME), item: `${C.SITE_URL}/${l}/${SLUG[page]}` },
  ] });
  const faq = (p.blocks || []).find((b) => b.type === "faq");
  if (faq) graph.push({ "@type": "FAQPage", mainEntity: faq.items.map((q) => ({ "@type": "Question", name: q.q.replace(/<[^>]+>/g, ""), acceptedAnswer: { "@type": "Answer", text: fill(q.a, l).replace(/<[^>]+>/g, "") } })) });
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function page(pageKey, l, ext) {
  const c = content[l]; const p = ext || c.pages[pageKey]; const t = c.ui;
  const url = ext && ext.url ? ext.url : `${C.SITE_URL}/${l}/${SLUG[pageKey]}`;
  const sp = ext && ext.slugPath != null ? ext.slugPath : SLUG[pageKey];
  const alt = C.LANGS.map((x) => `<link rel="alternate" hreflang="${LANG_META[x].html}" href="${C.SITE_URL}/${x}/${sp}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${C.SITE_URL}/en/${sp}">`;
  const nav = [...c.nav, ["blog", t.blogLink]].map(([k, x]) => `<a href="/${l}/${SLUG[k]}"${k === pageKey ? ' aria-current="page"' : ""}>${esc(x)}</a>`).join("");
  const langs = C.LANGS.map((x) => `<a href="/${x}/${sp}" hreflang="${LANG_META[x].html}" lang="${LANG_META[x].html}"${x === l ? ' aria-current="true"' : ""}>${LANG_META[x].label}</a>`).join("");
  const heroImg = p.hero && p.hero.img ? `<figure class="himg"><img src="${p.hero.img.src}" srcset="${p.hero.img.srcset || ""}" sizes="(max-width:860px) 100vw, 520px" alt="${esc(fill(p.hero.img.alt, l))}" width="${p.hero.img.w}" height="${p.hero.img.h}" fetchpriority="high" decoding="async">${p.hero.img.cap ? `<figcaption>${F(p.hero.img.cap, l)}</figcaption>` : ""}</figure>` : "";
  const hero = p.hero ? `<header class="hero${heroImg ? " withimg" : ""}${p.hero && p.hero.photoFirst ? " pf" : ""}"><div class="wrap"><div class="htxt">${p.hero.kicker ? `<p class="kicker">${F(p.hero.kicker, l)}</p>` : ""}<h1>${F(p.h1, l)}</h1>${p.hero.sub ? `<p class="sub">${F(p.hero.sub, l)}</p>` : ""}${p.hero.line ? `<p class="line">${F(p.hero.line, l)}</p>` : ""}${p.hero.ctas ? `<p class="ctas">${p.hero.ctas.map((x, i) => `<a class="btn${i ? " ghost" : ""}${x.book ? " book" : ""}" href="${x.href.startsWith("#") ? x.href : `/${l}/${SLUG[x.href]}`}">${F(x.label, l)}</a>`).join("")}</p>` : ""}</div>${heroImg}</div></header>` : `<header class="hero small"><div class="wrap"><h1>${F(p.h1, l)}</h1>${p.sub ? `<p class="sub">${F(p.sub, l)}</p>` : ""}</div></header>`;
  const body = (p.blocks || []).filter((b) => !b.ifConfig || C[b.ifConfig]).map((b) => block(b, l)).join("");
  const robots = p.noindex || C.PRELAUNCH ? `<meta name="robots" content="noindex">` : "";
  const ts = C.TURNSTILE_SITEKEY && (p.blocks || []).some((b) => b.type === "form") ? `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` : "";
  return `<!doctype html><html lang="${LANG_META[l].html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fill(p.title, l))}</title><meta name="description" content="${esc(fill(p.meta, l).replace(/<[^>]+>/g, ""))}">${robots}<link rel="canonical" href="${url}">${alt}${social(l, fill(p.title, l), fill(p.meta, l).replace(/<[^>]+>/g, ""), url)}<link rel="preload" href="/assets/fonts/cormorant-600.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/jost.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/site.css">${jsonld(pageKey, l, p)}${ts}</head><body><a class="skip" href="#main">${esc(t.skip)}</a><div class="top"><div class="wrap bar"><a class="logo" href="/${l}/"><img class="mark" src="/assets/hdj-mark.svg" width="38" height="38" alt=""><span class="lt"><span class="wm"><b>HIRE</b> driver japan</span><small>${esc(l === "zh" ? C.BRAND_ZH : l === "ja" ? C.BRAND_KANA : t.tagShort)}</small></span></a><button class="menu" aria-expanded="false" aria-controls="nav">${esc(t.menu)}</button><nav id="nav" aria-label="${esc(t.menu)}">${nav}<span class="langs">${langs}</span></nav></div></div><main id="main">${hero}<div class="wrap">${body}</div></main><footer class="foot"><div class="wrap"><p class="fbrand"><b>HIRE</b> driver japan</p><p>${esc(content[l].ui.operatedBy)} ${esc(l === "en" ? C.COMPANY_EN : C.COMPANY_JA)}</p><p>${C.COMPANY_ADDRESS ? esc(l === "en" && C.COMPANY_ADDRESS_EN ? C.COMPANY_ADDRESS_EN : C.COMPANY_ADDRESS) : `<mark class="ph">${esc(t.addressPh)}</mark>`}</p><p class="legal">${F(c.footerLegal, l)}</p><p><a href="/${l}/blog/">${esc(t.blogLink)}</a> · <a href="/${l}/legal/">${esc(t.tokushohoLink)}</a> · <a href="/${l}/privacy/">${esc(t.privacyLink)}</a> · <a href="/${l}/verify/">${esc(t.verifyNav)}</a></p><p class="group">${esc(t.groupLabel)}: <a href="https://6ltd.jp" target="_blank" rel="noopener">6 LTD</a> · <a href="https://driventokyo.com" target="_blank" rel="noopener">Driven Tokyo</a> · <a href="https://awahome.jp" target="_blank" rel="noopener">Awahome</a></p><p class="langs">${langs}</p></div></footer><script src="/assets/site.js" defer></script></body></html>`;
}

// build
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync("src/assets", path.join(OUT, "assets"), { recursive: true });
fs.writeFileSync(path.join(OUT, "assets/site.css"), fs.readFileSync("src/assets/fonts/fonts.css", "utf8") + fs.readFileSync("src/assets/site.css", "utf8"));
fs.rmSync(path.join(OUT, "assets/fonts/fonts.css"));
if (!C.COMPANY_ADDRESS) missing.add("COMPANY_ADDRESS");
if (!C.CONTACT_EMAIL) missing.add("CONTACT_EMAIL");
if (!C.TURNSTILE_SITEKEY) missing.add("TURNSTILE_SITEKEY (facoltativo ma consigliato)");
if (C.PRELAUNCH) missing.add("PRELAUNCH attivo: il sito e' online ma non indicizzabile. Mettere false quando i segnaposto sono completati");
const urls = [];
for (const l of C.LANGS) for (const k of PAGES) {
  const dir = path.join(OUT, l, SLUG[k]); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(k, l));
  if (!content[l].pages[k].noindex) urls.push({ k, l });
}
// blog: un articolo per lingua, piu' l'indice
const blogUrls = [];
for (const l of C.LANGS) {
  const t = content[l].ui;
  for (const post of POSTS) {
    const d = post[l]; if (!d) continue;
    const slugPath = `blog/${post.slug}/`, url = `${C.SITE_URL}/${l}/${slugPath}`;
    const faq = d.faq && d.faq.length ? [{ type: "faq", h2: l === "ja" ? "よくあるご質問" : l === "zh" ? "常见问题" : "Questions", items: d.faq }] : [];
    const ext = { title: d.title, meta: d.meta, h1: d.h1, sub: `${t.posted}: ${post.date}`, url, slugPath, article: { date: post.date, updated: post.updated, image: post.imgs && post.imgs[0] ? post.imgs[0].src : null },
      blocks: [{ type: "post", lead: d.lead, sections: d.sections, imgs: post.imgs, note: d.note }, ...faq] };
    const dir = path.join(OUT, l, slugPath); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page("blog", l, ext));
    blogUrls.push({ l, slugPath });
  }
  const items = POSTS.filter((x) => x[l]).sort((a, b) => b.date.localeCompare(a.date)).map((x) => ({ href: `/${l}/blog/${x.slug}/`, date: x.date, title: x[l].h1, meta: x[l].meta }));
  const idx = { title: t.blogIndexTitle + " | " + C.BRAND_NAME, meta: t.blogIndexMeta, h1: t.blogLink, sub: t.blogIndexMeta, url: `${C.SITE_URL}/${l}/blog/`, slugPath: "blog/", blocks: [{ type: "postlist", items }] };
  const dir = path.join(OUT, l, "blog"); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page("blog", l, idx));
  blogUrls.push({ l, slugPath: "blog/" });
}
// home radice: sceglie la lingua
fs.writeFileSync(path.join(OUT, "index.html"), `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fill(content.ja.pages.home.title, "ja"))}</title><meta name="description" content="${esc(fill(content.ja.pages.home.meta, "ja"))}">${C.PRELAUNCH ? `<meta name="robots" content="noindex">` : ""}<link rel="canonical" href="${C.SITE_URL}/ja/">${social("ja", fill(content.ja.pages.home.title, "ja"), fill(content.ja.pages.home.meta, "ja"), C.SITE_URL + "/")}${C.LANGS.map((x) => `<link rel="alternate" hreflang="${LANG_META[x].html}" href="${C.SITE_URL}/${x}/">`).join("")}<link rel="alternate" hreflang="x-default" href="${C.SITE_URL}/en/"><link rel="stylesheet" href="/assets/site.css"><script>(function(){var n=(navigator.language||"").toLowerCase();var l=n.indexOf("ja")===0?"ja":n.indexOf("zh")===0?"zh":n?"en":"ja";location.replace("/"+l+"/");})();</script></head><body><main class="wrap pick"><h1>${esc(C.BRAND_NAME)}</h1><p>${C.LANGS.map((x) => `<a class="btn" href="/${x}/">${LANG_META[x].label}</a>`).join(" ")}</p></main></body></html>`);
// lastmod reale: ogni pagina ha una data che cambia solo quando cambia il suo HTML (impronta salvata in lastmod.json)
const LM_FILE = "lastmod.json"; const LM = fs.existsSync(LM_FILE) ? JSON.parse(fs.readFileSync(LM_FILE, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
const lastmodOf = (k, l, sp) => { const key = `${l}/${sp != null ? sp : SLUG[k]}`; const html = fs.readFileSync(path.join(OUT, l, sp != null ? sp : SLUG[k], "index.html"), "utf8"); const h = crypto.createHash("sha1").update(html).digest("hex").slice(0, 16); if (!LM[key] || LM[key].h !== h) LM[key] = { h, d: today }; return LM[key].d; };
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...urls.map(({ k, l }) => ({ l, sp: SLUG[k], k })), ...blogUrls.map((x) => ({ l: x.l, sp: x.slugPath, k: "blog" }))].map(({ k, l, sp }) => `<url><loc>${C.SITE_URL}/${l}/${sp}</loc><lastmod>${lastmodOf(k, l, sp)}</lastmod>${C.LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${LANG_META[x].html}" href="${C.SITE_URL}/${x}/${sp}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${C.SITE_URL}/en/${sp}"/></url>`).join("\n")}\n</urlset>\n`);
// Come driventokyo.com: assistenti e motori AI nominati esplicitamente. I gruppi di robots.txt non si ereditano, quindi ogni agente sta nello stesso blocco con i Disallow.
const AGENTS = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "Amazonbot", "meta-externalagent", "cohere-ai", "MistralAI-User"];
fs.writeFileSync(LM_FILE, JSON.stringify(LM, null, 0));
fs.writeFileSync(path.join(OUT, "robots.txt"), `# Search engines, assistants and answer engines are welcome to read and cite this site.\n\n${AGENTS.map((a) => `User-agent: ${a}`).join("\n")}\nAllow: /\nDisallow: /admin/\nDisallow: /academy/\nDisallow: /api/\nDisallow: /verify/2\n\nSitemap: ${C.SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "llms.txt"), fs.readFileSync("llms.txt", "utf8").replaceAll("{{SITE}}", C.SITE_URL).replaceAll("{{BRAND}}", C.BRAND_NAME).replaceAll("{{CERT}}", C.CERT_NAME).replaceAll("{{TEACHER}}", C.TEACHER_NAME));
// 404 vera (status 404, non 200 come la SPA di Driven), con il marchio
fs.writeFileSync(path.join(OUT, "404.html"), `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | ${esc(C.BRAND_NAME)}</title>${ICONS}<link rel="stylesheet" href="/assets/site.css"></head><body><main class="wrap pick"><h1>404</h1><p>ページが見つかりません。 Page not found. 页面不存在。</p><p>${C.LANGS.map((x) => `<a class="btn" href="/${x}/">${LANG_META[x].label}</a>`).join(" ")}</p></main></body></html>`);
fs.cpSync("admin", path.join(OUT, "admin"), { recursive: true });
fs.cpSync("academy", path.join(OUT, "academy"), { recursive: true });
fs.copyFileSync("src/assets/favicon.ico", path.join(OUT, "favicon.ico"));
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({ name: C.BRAND_NAME, short_name: "HIRE driver", start_url: "/", display: "browser", background_color: "#14110E", theme_color: "#14110E", icons: [192, 512].map((n) => ({ src: `/assets/icon-${n}.png`, sizes: `${n}x${n}`, type: "image/png" })) }));
fs.writeFileSync(path.join(OUT, "build-checklist.txt"), [...missing].sort().join("\n") + "\n");
console.log(`dist: ${urls.length} pagine indicizzabili, ${C.LANGS.length * PAGES.length} totali`);
console.log("Da completare:\n - " + [...missing].sort().join("\n - "));
