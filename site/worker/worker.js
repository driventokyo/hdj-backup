// HIRE driver japan · Worker unico: /api/lead, /verify/{id}, /api/verify/{id}, /api/admin/*, cron.
// Il resto (pagine statiche e pannello) lo serve [assets] da dist/.

const now = () => new Date().toISOString();
const json = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...h } });
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rid = (p, n = 6) => { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const b = crypto.getRandomValues(new Uint8Array(n)); return p + "-" + [...b].map((x) => a[x % a.length]).join(""); };
const tok = (n = 24) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, "0")).join("");
async function sha256(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
const str = (v, max = 200) => (v == null ? null : String(Array.isArray(v) ? v.join(",") : v).trim().slice(0, max) || null);
const int = (v, lo = 0, hi = 9999) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
const arr = (v, allowed) => { const a = (Array.isArray(v) ? v : v ? [v] : []).map(String).filter((x) => !allowed || allowed.includes(x)); return a.length ? JSON.stringify(a) : null; };
const emailOk = (e) => typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length < 200;
const LANGS = ["ja", "zh", "en"];
const LANG_CODES = ["en", "zh", "it", "fr", "es", "other"];

// Header di sicurezza come driventokyo.com. camera=(self): la pagina di verifica legge i QR con la fotocamera.
const SEC = { "strict-transport-security": "max-age=63072000; includeSubDomains; preload", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "permissions-policy": "geolocation=(), microphone=(), camera=(self)", "x-frame-options": "SAMEORIGIN" };

export default {
  async fetch(req, env, ctx) {
    const res = await route(req, env, ctx);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SEC)) out.headers.set(k, v);
    return out;
  },
  async scheduled(evt, env, ctx) { ctx.waitUntil(daily(env).catch((e) => console.error("cron error", e && e.stack || e))); },
};

async function route(req, env, ctx) {
  {
    const url = new URL(req.url);
    const p = url.pathname;
    if (url.protocol === "http:" && url.hostname.endsWith("hiredriverjapan.com")) { url.protocol = "https:"; url.hostname = url.hostname.replace(/^www\./, ""); return Response.redirect(url.toString(), 301); }
    if (url.hostname.startsWith("www.")) { url.hostname = url.hostname.slice(4); return Response.redirect(url.toString(), 301); }
    try {
      if (p === "/api/lead" && req.method === "POST") return await lead(req, env, ctx);
      if (p === "/verify" || p === "/verify/") { const id = url.searchParams.get("id") || ""; return Response.redirect(new URL(/^\d{4}-\d{4}$/.test(id) ? `/verify/${id}` : "/en/verify/", url), 302); }
      let m;
      if ((m = p.match(/^\/verify\/(\d{4}-\d{4})\/?$/))) return await verifyPage(m[1], url, req, env, ctx);
      if ((m = p.match(/^\/api\/verify\/(\d{4}-\d{4})$/))) return await verifyApi(m[1], url, env, ctx);
      if ((m = p.match(/^\/(ja|en|zh)\/operators\/?$/))) return Response.redirect(new URL(`/${m[1]}/`, url), 301); // pagina operatori assorbita nella home
      if (p.startsWith("/api/admin/")) return await admin(req, env, url);
      if (p.startsWith("/api/")) return json({ ok: false, error: "not_found" }, 404);
      return env.ASSETS.fetch(req);
    } catch (e) {
      console.error("worker error", p, e && e.stack || e);
      return json({ ok: false, error: "server_error" }, 500);
    }
  }
}

// ---------------------------------------------------------------- form pubblici
async function lead(req, env, ctx) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return json({ ok: false, error: "bad_content_type" }, 415);
  const raw = await req.text(); if (raw.length > 20000) return json({ ok: false, error: "too_large" }, 413);
  let b; try { b = JSON.parse(raw); } catch { return json({ ok: false, error: "bad_json" }, 400); }
  if (b.website) return json({ ok: true, id: null }); // honeypot: risposta muta
  const type = b.type, lang = LANGS.includes(b.lang) ? b.lang : "en";
  if (!["corporate", "operator", "training", "driver"].includes(type)) return json({ ok: false, error: "bad_type" }, 400);
  if (b.consent !== "1" && b.consent !== true) return json({ ok: false, error: "consent_required" }, 400);
  if (!emailOk(b.email)) return json({ ok: false, error: "bad_email" }, 400);

  const ip = req.headers.get("cf-connecting-ip") || "0.0.0.0";
  const ipHash = (await sha256(ip + "|" + (env.SITE_URL || ""))).slice(0, 16);
  // limite: 5 invii ogni 10 minuti per IP, su tutte le tabelle
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(`SELECT (SELECT COUNT(*) FROM leads_service WHERE ip_hash=?1 AND created_at>?2)+(SELECT COUNT(*) FROM leads_training WHERE ip_hash=?1 AND created_at>?2)+(SELECT COUNT(*) FROM driver_applications WHERE ip_hash=?1 AND created_at>?2) AS n`).bind(ipHash, since).first();
  if (recent && recent.n >= 5) return json({ ok: false, error: "rate_limited" }, 429);

  let ts = null;
  if (env.TURNSTILE_SECRET) {
    const tk = b["cf-turnstile-response"]; if (!tk) return json({ ok: false, error: "turnstile_missing" }, 400);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: tk, remoteip: ip }) });
    const j = await r.json(); if (!j.success) return json({ ok: false, error: "turnstile_failed" }, 400); ts = 1;
  }
  const t = now();
  const attr = [str(b.utm_source, 100), str(b.utm_medium, 100), str(b.utm_campaign, 100), str(b.referrer, 300), str(b.landing, 200), ipHash, ts];
  let id, table, summary;
  if (type === "corporate" || type === "operator") {
    if (!str(b.company) || !str(b.contact) || !str(b.city)) return json({ ok: false, error: "missing_fields" }, 400);
    if (type === "operator" && !str(b.optype)) return json({ ok: false, error: "missing_fields" }, 400);
    id = rid(type === "corporate" ? "LC" : "LO"); table = "leads_service";
    await env.DB.prepare(`INSERT INTO leads_service (id,created_at,updated_at,kind,site_lang,company,contact_name,email,phone,line_id,wechat_id,plan,service_date,hours,languages,vehicle,city,operator_type,fleet,interest,message,consent,utm_source,utm_medium,utm_campaign,referrer,landing,ip_hash,turnstile_ok) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?)`)
      .bind(id, t, t, type, lang, str(b.company), str(b.contact), b.email, str(b.phone, 40), str(b.line, 60), str(b.wechat, 60), str(b.plan, 20), str(b.date), int(b.hours, 1, 24), arr(b.languages, LANG_CODES), str(b.vehicle), str(b.city), str(b.optype, 20), int(b.fleet, 0, 99999), str(b.interest, 20), str(b.message, 2000), ...attr).run();
    summary = { [type === "corporate" ? "Azienda" : "Operatore"]: b.company, Referente: b.contact, Email: b.email, Telefono: b.phone, Piano: b.plan, Data: b.date, Ore: b.hours, Lingue: [].concat(b.languages || []).join(", "), Veicolo: b.vehicle, Citta: b.city, Tipo: b.optype, Flotta: b.fleet, Interesse: b.interest, LINE: b.line, WeChat: b.wechat, Messaggio: b.message };
  } else if (type === "training") {
    if (!str(b.company) || !str(b.optype) || !int(b.drivers, 1, 999) || !str(b.city) || !str(b.contact)) return json({ ok: false, error: "missing_fields" }, 400);
    id = rid("LT"); table = "leads_training";
    await env.DB.prepare(`INSERT INTO leads_training (id,created_at,updated_at,site_lang,company,operator_type,drivers_count,languages,period,city,contact_name,email,phone,line_id,wechat_id,message,consent,utm_source,utm_medium,utm_campaign,referrer,landing,ip_hash,turnstile_ok) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?)`)
      .bind(id, t, t, lang, str(b.company), str(b.optype, 20), int(b.drivers, 1, 999), arr(b.languages, LANG_CODES), str(b.period), str(b.city), str(b.contact), b.email, str(b.phone, 40), str(b.line, 60), str(b.wechat, 60), str(b.message, 2000), ...attr).run();
    summary = { Operatore: b.company, Tipo: b.optype, Autisti: b.drivers, Lingue: [].concat(b.languages || []).join(", "), Periodo: b.period, Citta: b.city, Referente: b.contact, Email: b.email, Telefono: b.phone, LINE: b.line, WeChat: b.wechat, Messaggio: b.message };
  } else {
    if (!str(b.name) || !str(b.phone) || !str(b.city) || !str(b.license) || !str(b.status) || !arr(b.languages, LANG_CODES)) return json({ ok: false, error: "missing_fields" }, 400);
    id = rid("AP"); table = "driver_applications";
    await env.DB.prepare(`INSERT INTO driver_applications (id,created_at,updated_at,site_lang,full_name,email,phone,city,license,license_years,languages,lang_level,residence_status,availability,message,consent,utm_source,utm_medium,utm_campaign,referrer,landing,ip_hash,turnstile_ok) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?)`)
      .bind(id, t, t, lang, str(b.name), b.email, str(b.phone, 40), str(b.city), str(b.license, 20), int(b.licyears, 0, 80), arr(b.languages, LANG_CODES), str(b.langlevel), str(b.status, 20), str(b.days), str(b.message, 2000), ...attr).run();
    summary = { Nome: b.name, Email: b.email, Telefono: b.phone, Citta: b.city, Patente: b.license, Anni: b.licyears, Lingue: [].concat(b.languages || []).join(", "), Livello: b.langlevel, Residenza: b.status, Disponibilita: b.days, Messaggio: b.message };
  }
  ctx.waitUntil(notify(env, { id, type, lang, email: b.email, name: b.contact || b.name, summary }).catch((e) => console.error("notify", e)));
  return json({ ok: true, id });
}

const AUTO = {
  ja: { s: "お問い合わせありがとうございます", b: (n, id) => `${n} 様\n\nお問い合わせを受け付けました（受付番号 ${id}）。\n担当者より2営業日以内にご連絡いたします。\n\n` },
  zh: { s: "感谢您的咨询", b: (n, id) => `${n} 您好：\n\n我们已收到您的信息（受理编号 ${id}）。\n负责人会在两个工作日内与您联系。\n\n` },
  en: { s: "Thank you for contacting us", b: (n, id) => `Dear ${n},\n\nWe have received your message (reference ${id}).\nWe will reply within two business days.\n\n` },
};
async function notify(env, x) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) { console.log("email non inviata: RESEND_API_KEY o FROM_EMAIL mancanti", x.id); return; }
  const send = (o) => fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", "idempotency-key": `${x.id}-${o.tag}` }, body: JSON.stringify(o.body) });
  const rows = Object.entries(x.summary).filter(([, v]) => v != null && v !== "").map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5b6875">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join("");
  const label = { corporate: "Azienda", operator: "Operatore", training: "Formazione", driver: "Candidatura autista" }[x.type];
  if (env.CONTACT_EMAIL) await send({ tag: "int", body: { from: env.FROM_EMAIL, to: [env.CONTACT_EMAIL], reply_to: x.email, subject: `[${label}] ${x.id} ${x.summary.Azienda || x.summary.Operatore || x.summary.Nome || ""}`, html: `<p><b>${esc(label)}</b> · ${esc(x.id)} · lingua ${esc(x.lang)}</p><table style="font:14px system-ui">${rows}</table><p><a href="${esc(env.SITE_URL)}/admin/">Apri il pannello</a></p>` } });
  const a = AUTO[x.lang] || AUTO.en; const brand = env.BRAND_NAME || "";
  await send({ tag: "ack", body: { from: env.FROM_EMAIL, to: [x.email], subject: `${a.s} | ${brand}`, text: a.b(x.name || "", x.id) + brand, ...(env.CONTACT_EMAIL ? { reply_to: env.CONTACT_EMAIL } : {}) } });
}

// ---------------------------------------------------------------- verifica certificati
async function certLookup(id, token, env, ctx) {
  const c = await env.DB.prepare(`SELECT c.*, d.full_name, d.name_latin, d.display_mode, d.show_operator, o.name AS operator_name FROM certificates c JOIN drivers d ON d.id=c.driver_id LEFT JOIN operators o ON o.id=d.operator_id WHERE c.id=?`).bind(id).first();
  if (!c) return null;
  let status = c.status;
  if (status === "active" && c.expires_at < now().slice(0, 10)) status = "expired";
  const full = !!token && token === c.verify_token;
  const nm = c.name_latin || c.full_name;
  const initials = nm.split(/[\s　]+/).filter(Boolean).map((w) => w[0].toUpperCase() + ".").join(" ");
  ctx.waitUntil(env.DB.prepare(`UPDATE certificates SET views=views+1, last_view_at=? WHERE id=?`).bind(now(), id).run());
  return {
    id: c.id, kind: c.kind || "certificate", status, level: c.level, languages: JSON.parse(c.languages || "[]"), issued_at: c.issued_at, expires_at: c.expires_at,
    name: full ? (c.display_mode === "full" ? nm : initials) : initials,
    operator: full && c.show_operator ? c.operator_name : null,
    issuer: env.BRAND_NAME || "HIRE driver japan", private_certification: true, full,
  };
}
async function verifyApi(id, url, env, ctx) {
  const r = await certLookup(id, url.searchParams.get("t"), env, ctx);
  return json(r ? { ok: true, certificate: r } : { ok: false, error: "not_found" }, r ? 200 : 404, { "access-control-allow-origin": "*", "x-robots-tag": "noindex" });
}
const VT = {
  ja: { t: "認証の確認", st: { active: "有効", expired: "期限切れ", revoked: "取り消し", superseded: "更新済み（新しい認証があります）", notfound: "見つかりません" }, f: ["番号", "氏名", "言語", "レベル", "発行日", "有効期限", "所属", "書類"], lv: { standard: "スタンダード", advanced: "アドバンス" }, kd: { certificate: "認証", attestation: "修了証" }, noexp: "期限なし", note: "は{{BRAND}}が発行する民間の書類です。国家資格・公的資格ではありません。", nf: "この番号の認証は見つかりませんでした。番号をご確認ください。", back: "別の番号を確認する", co: "6株式会社", lim: "QRコードから開くと、ドライバーが公開に同意した詳細が表示されます。" },
  zh: { t: "认证查询", st: { active: "有效", expired: "已过期", revoked: "已撤销", superseded: "已更新（有新认证）", notfound: "未找到" }, f: ["编号", "姓名", "语言", "级别", "颁发日期", "有效期至", "所属公司", "文件"], lv: { standard: "标准", advanced: "进阶" }, kd: { certificate: "认证", attestation: "结业证明" }, noexp: "无期限", note: "是{{BRAND}}颁发的私营机构文件，不是国家资格或政府认证。", nf: "未找到该编号的认证，请确认编号。", back: "查询其他编号", co: "6株式会社", lim: "通过二维码打开时，会显示司机同意公开的详细信息。" },
  en: { t: "Certificate check", st: { active: "Active", expired: "Expired", revoked: "Revoked", superseded: "Superseded by a newer certificate", notfound: "Not found" }, f: ["Number", "Name", "Languages", "Level", "Issued", "Valid until", "Employer", "Document"], lv: { standard: "Standard", advanced: "Advanced" }, kd: { certificate: "Certification", attestation: "Attestation of completion" }, noexp: "No expiry", note: "is a private document issued by {{BRAND}}. It is not a national or government qualification.", nf: "No certificate matches this number. Please check it and try again.", back: "Check another number", co: "6 Ltd", lim: "Opening the QR code shows the details the driver has agreed to publish." },
};
const LN = { en: "English", zh: "中文", it: "Italiano", fr: "Français", es: "Español", ja: "日本語" };
async function verifyPage(id, url, req, env, ctx) {
  let lang = url.searchParams.get("lang");
  if (!LANGS.includes(lang)) { const al = (req.headers.get("accept-language") || "").toLowerCase(); lang = al.startsWith("ja") ? "ja" : al.startsWith("zh") ? "zh" : "en"; }
  const v = VT[lang]; const r = await certLookup(id, url.searchParams.get("t"), env, ctx);
  const cert = esc(env.CERT_NAME || "Certificate");
  const st = r ? r.status : "notfound";
  const body = r ? `<p><span class="badge ${st}">${esc(v.st[st])}</span></p><dl><dt>${v.f[7]}</dt><dd>${esc(r.kind === "attestation" ? v.kd.attestation : v.kd.certificate + " · " + (env.CERT_NAME || ""))}</dd><dt>${v.f[0]}</dt><dd>${esc(r.id)}</dd><dt>${v.f[1]}</dt><dd>${esc(r.name)}</dd><dt>${v.f[2]}</dt><dd>${esc(r.languages.map((x) => LN[x] || x).join(", "))}</dd><dt>${v.f[3]}</dt><dd>${esc(v.lv[r.level] || r.level)}</dd><dt>${v.f[4]}</dt><dd>${esc(r.issued_at)}</dd><dt>${v.f[5]}</dt><dd>${esc(r.expires_at === "9999-12-31" ? v.noexp : r.expires_at)}</dd>${r.operator ? `<dt>${v.f[6]}</dt><dd>${esc(r.operator)}</dd>` : ""}</dl>${r.full ? "" : `<p class="note">${esc(v.lim)}</p>`}`
    : `<p><span class="badge notfound">${esc(v.st.notfound)}</span></p><p>${esc(v.nf)}</p>`;
  const html = `<!doctype html><html lang="${lang === "zh" ? "zh-Hans" : lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(v.t)} ${esc(id)} | ${esc(env.BRAND_NAME || "")}</title><link rel="stylesheet" href="/assets/site.css"><link rel="icon" href="/assets/favicon.svg"></head><body><div class="top"><div class="wrap bar"><a class="logo" href="/${lang}/"><img class="mark" src="/assets/hdj-mark.svg" width="38" height="38" alt=""><span class="lt"><span class="wm"><b>HIRE</b> driver japan</span></span></a></div></div><main id="main" class="wrap"><section class="vres"><h1 style="font-size:24px">${esc(v.t)}</h1><p class="note">${cert}</p>${body}<p class="note">${cert} ${esc(v.note.replace("{{BRAND}}", env.BRAND_NAME || "HIRE driver japan"))}</p><p><a href="/${lang}/verify/">${esc(v.back)}</a></p></section></main></body></html>`;
  return new Response(html, { status: r ? 200 : 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}

// ---------------------------------------------------------------- pannello
async function who(req, env) {
  const t = req.headers.get("x-panel-token"); if (!t || t.length < 20) return null;
  if (env.ADMIN_TOKEN && t === env.ADMIN_TOKEN) return { id: "ADMIN", role: "admin", name: "Admin" };
  const u = await env.DB.prepare(`SELECT id, role, name, operator_id FROM panel_users WHERE token_hash=? AND status='active'`).bind(await sha256(t)).first();
  return u || null;
}
const STAGES = { service: ["new", "contacted", "quoted", "confirmed", "lost"], training: ["new", "contacted", "quoted", "confirmed", "lost"], driver: ["new", "interview", "documents", "hired", "rejected"] };
const LEAD_TABLE = { service: "leads_service", training: "leads_training", driver: "driver_applications" };

async function admin(req, env, url) {
  const u = await who(req, env); if (!u) return json({ ok: false, error: "unauthorized" }, 401);
  const p = url.pathname.replace(/^\/api\/admin/, ""); const M = req.method;
  const body = M === "POST" ? await req.json().catch(() => ({})) : {};
  const isAdmin = u.role === "admin";
  const deny = () => json({ ok: false, error: "forbidden" }, 403);
  const DB = env.DB; let m;

  if (p === "/me") return json({ ok: true, user: u });
  if (p === "/cron-run" && M === "POST") { if (!isAdmin) return deny(); try { await daily(env); return json({ ok: true }); } catch (e) { return json({ ok: false, error: "cron_failed", hint: String(e && e.message || e) }, 500); } }

  // lead e candidature
  if ((m = p.match(/^\/leads\/(service|training|driver)$/)) && M === "GET") {
    if (!isAdmin) return deny();
    const stage = url.searchParams.get("stage");
    const q = `SELECT * FROM ${LEAD_TABLE[m[1]]} ${stage ? "WHERE stage=?" : ""} ORDER BY created_at DESC LIMIT 500`;
    const r = await (stage ? DB.prepare(q).bind(stage) : DB.prepare(q)).all();
    return json({ ok: true, rows: r.results });
  }
  if ((m = p.match(/^\/leads\/(service|training|driver)\/([A-Z]{2}-[A-Z0-9]{6})$/)) && M === "POST") {
    if (!isAdmin) return deny();
    const sets = [], vals = [];
    if (body.stage) { if (!STAGES[m[1]].includes(body.stage)) return json({ ok: false, error: "bad_stage" }, 400); sets.push("stage=?"); vals.push(body.stage); }
    if ("notes" in body) { sets.push("notes=?"); vals.push(str(body.notes, 4000)); }
    if (m[1] !== "driver" && "quote_jpy" in body) { sets.push("quote_jpy=?"); vals.push(int(body.quote_jpy, 0, 1e9)); }
    if (m[1] !== "driver" && "lost_reason" in body) { sets.push("lost_reason=?"); vals.push(str(body.lost_reason, 500)); }
    if (!sets.length) return json({ ok: false, error: "nothing_to_update" }, 400);
    sets.push("updated_at=?"); vals.push(now(), m[2]);
    await DB.prepare(`UPDATE ${LEAD_TABLE[m[1]]} SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
    return json({ ok: true });
  }
  if (p === "/counts" && M === "GET") {
    const r = await DB.prepare(`SELECT (SELECT COUNT(*) FROM leads_service WHERE stage='new') AS service,(SELECT COUNT(*) FROM leads_training WHERE stage='new') AS training,(SELECT COUNT(*) FROM driver_applications WHERE stage='new') AS driver,(SELECT COUNT(*) FROM certificates WHERE status='active' AND expires_at<=date('now','+60 day')) AS expiring`).first();
    return json({ ok: true, counts: isAdmin ? r : { expiring: r.expiring } });
  }

  // anagrafiche
  if (p === "/operators" && M === "GET") { if (!isAdmin) return deny(); return json({ ok: true, rows: (await DB.prepare(`SELECT * FROM operators ORDER BY name`).all()).results }); }
  if (p === "/operators" && M === "POST") {
    if (!isAdmin) return deny(); if (!str(body.name) || !str(body.type)) return json({ ok: false, error: "missing_fields" }, 400);
    const id = rid("OP"), t = now();
    await DB.prepare(`INSERT INTO operators (id,created_at,updated_at,name,type,city,lang,contact_name,email,phone,line_id,wechat_id,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, t, t, str(body.name), str(body.type, 20), str(body.city), str(body.lang, 2), str(body.contact_name), str(body.email), str(body.phone, 40), str(body.line_id, 60), str(body.wechat_id, 60), str(body.notes, 2000)).run();
    return json({ ok: true, id });
  }
  if (p === "/drivers" && M === "GET") {
    if (!isAdmin && u.role !== "teacher") return deny();
    return json({ ok: true, rows: (await DB.prepare(`SELECT d.*, o.name AS operator_name FROM drivers d LEFT JOIN operators o ON o.id=d.operator_id ORDER BY d.full_name`).all()).results });
  }
  if ((p === "/drivers" || (m = p.match(/^\/drivers\/(DRV-[A-Z0-9]{6})$/))) && M === "POST") {
    if (!isAdmin) return deny();
    const f = { operator_id: str(body.operator_id, 20), full_name: str(body.full_name), name_kana: str(body.name_kana), name_latin: str(body.name_latin), display_mode: body.display_mode === "full" ? "full" : "initials", show_operator: body.show_operator ? 1 : 0, consent_at: str(body.consent_at, 30), email: str(body.email), phone: str(body.phone, 40), nishu_menkyo: body.nishu_menkyo === 0 || body.nishu_menkyo === "0" ? 0 : 1, languages: arr(body.languages, [...LANG_CODES, "ja"]), employed_by_us: body.employed_by_us ? 1 : 0 };
    const t = now();
    if (p === "/drivers") {
      if (!f.full_name) return json({ ok: false, error: "missing_fields" }, 400);
      const id = rid("DRV");
      await DB.prepare(`INSERT INTO drivers (id,created_at,updated_at,${Object.keys(f).join(",")}) VALUES (?,?,?,${Object.keys(f).map(() => "?").join(",")})`).bind(id, t, t, ...Object.values(f)).run();
      return json({ ok: true, id });
    }
    const keys = Object.keys(f).filter((k) => k in body);
    if (!keys.length) return json({ ok: false, error: "nothing_to_update" }, 400);
    await DB.prepare(`UPDATE drivers SET ${keys.map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...keys.map((k) => f[k]), t, m[1]).run();
    return json({ ok: true });
  }

  // sessioni
  if (p === "/courses" && M === "GET") {
    const q = `SELECT c.*, o.name AS operator_name, u.name AS teacher_name, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) AS enrolled FROM courses c LEFT JOIN operators o ON o.id=c.operator_id LEFT JOIN panel_users u ON u.id=c.teacher_id ${isAdmin ? "" : "WHERE c.teacher_id=?"} ORDER BY c.day1_date DESC`;
    if (!isAdmin && u.role !== "teacher") return deny();
    return json({ ok: true, rows: (await (isAdmin ? DB.prepare(q) : DB.prepare(q).bind(u.id)).all()).results });
  }
  if ((p === "/courses" || (m = p.match(/^\/courses\/(CRS-\d{4}-\d{3})$/))) && M === "POST") {
    if (!isAdmin) return deny();
    const f = { operator_id: str(body.operator_id, 20), lead_id: str(body.lead_id, 20), format: str(body.format, 20), language: str(body.language, 2), target_langs: arr(body.target_langs, LANG_CODES), day1_date: str(body.day1_date, 10), day2_date: str(body.day2_date, 10), day3_date: str(body.day3_date, 10), venue: str(body.venue), venue_type: str(body.venue_type, 20), teacher_id: str(body.teacher_id, 20), seats: int(body.seats, 1, 50), price_jpy: int(body.price_jpy, 0, 1e9), status: str(body.status, 20) };
    const t = now();
    if (p === "/courses") {
      if (!f.format || !f.language) return json({ ok: false, error: "missing_fields" }, 400);
      const y = (f.day1_date || t).slice(0, 4);
      const n = await DB.prepare(`SELECT COUNT(*) AS n FROM courses WHERE id LIKE ?`).bind(`CRS-${y}-%`).first();
      const id = `CRS-${y}-${String((n.n || 0) + 1).padStart(3, "0")}`;
      f.status = f.status || "planned";
      await DB.prepare(`INSERT INTO courses (id,created_at,updated_at,${Object.keys(f).join(",")}) VALUES (?,?,?,${Object.keys(f).map(() => "?").join(",")})`).bind(id, t, t, ...Object.values(f)).run();
      return json({ ok: true, id });
    }
    const keys = Object.keys(f).filter((k) => k in body);
    await DB.prepare(`UPDATE courses SET ${keys.map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...keys.map((k) => f[k]), t, m[1]).run();
    return json({ ok: true });
  }

  // iscrizioni e voti
  if ((m = p.match(/^\/courses\/(CRS-\d{4}-\d{3})\/enrollments$/)) && M === "GET") {
    const c = await DB.prepare(`SELECT teacher_id FROM courses WHERE id=?`).bind(m[1]).first();
    if (!c) return json({ ok: false, error: "not_found" }, 404);
    if (!isAdmin && !(u.role === "teacher" && c.teacher_id === u.id)) return deny();
    const r = await DB.prepare(`SELECT e.*, d.full_name, d.languages AS driver_langs, (SELECT id FROM certificates WHERE enrollment_id=e.id AND kind='certificate' AND status!='superseded' ORDER BY created_at DESC LIMIT 1) AS certificate_id, (SELECT id FROM certificates WHERE enrollment_id=e.id AND kind='attestation' AND status!='revoked' ORDER BY created_at DESC LIMIT 1) AS attestation_id, c.format FROM enrollments e JOIN drivers d ON d.id=e.driver_id JOIN courses c ON c.id=e.course_id WHERE e.course_id=? ORDER BY d.full_name`).bind(m[1]).all();
    return json({ ok: true, rows: r.results });
  }
  if (p === "/enrollments" && M === "POST") {
    if (!isAdmin) return deny();
    const c = await DB.prepare(`SELECT operator_id FROM courses WHERE id=?`).bind(str(body.course_id, 20)).first();
    const d = await DB.prepare(`SELECT id, operator_id FROM drivers WHERE id=?`).bind(str(body.driver_id, 20)).first();
    if (!c || !d) return json({ ok: false, error: "not_found" }, 404);
    const id = rid("ENR"), t = now();
    try { await DB.prepare(`INSERT INTO enrollments (id,created_at,updated_at,course_id,driver_id,operator_id) VALUES (?,?,?,?,?,?)`).bind(id, t, t, body.course_id, d.id, d.operator_id || c.operator_id).run(); }
    catch (e) { return json({ ok: false, error: "already_enrolled" }, 409); }
    return json({ ok: true, id });
  }
  if ((m = p.match(/^\/enrollments\/(ENR-[A-Z0-9]{6})$/)) && M === "POST") {
    const e = await DB.prepare(`SELECT e.*, c.teacher_id FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.id=?`).bind(m[1]).first();
    if (!e) return json({ ok: false, error: "not_found" }, 404);
    if (!isAdmin && !(u.role === "teacher" && e.teacher_id === u.id)) return deny();
    const PASS = 70; const f = {};
    for (const k of ["attended_d1", "attended_d2", "attended_d3"]) if (k in body) f[k] = body[k] ? 1 : 0;
    for (const [k, pk] of [["score_oral", "pass_oral"], ["score_practical", "pass_practical"], ["score_written", "pass_written"]]) if (k in body) { f[k] = int(body[k], 0, 100); f[pk] = f[k] == null ? null : f[k] >= PASS ? 1 : 0; }
    if ("notes" in body) f.notes = str(body.notes, 2000);
    const merged = { ...e, ...f };
    const graded = [merged.pass_oral, merged.pass_practical, merged.pass_written];
    if (graded.every((x) => x === 1)) f.result = "pass";
    else if (graded.every((x) => x === 0 || x === 1)) { f.result = e.result === "fail" || e.result === "retake" ? "fail" : "retake"; if (f.result === "retake" && !e.retake_until) f.retake_until = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10); }
    f.graded_by = u.id === "ADMIN" ? null : u.id; f.graded_at = now(); f.updated_at = now(); // l'admin di ambiente non e' in panel_users
    await DB.prepare(`UPDATE enrollments SET ${Object.keys(f).map((k) => k + "=?").join(",")} WHERE id=?`).bind(...Object.values(f), m[1]).run();
    return json({ ok: true, result: f.result || e.result, pass_mark: PASS });
  }

  // certificati
  if (p === "/certificates/issue" && M === "POST") {
    if (!isAdmin) return deny();
    const kind = body.kind === "attestation" ? "attestation" : "certificate";
    const e = await DB.prepare(`SELECT e.*, d.languages AS dl, c.format FROM enrollments e JOIN drivers d ON d.id=e.driver_id JOIN courses c ON c.id=e.course_id WHERE e.id=?`).bind(str(body.enrollment_id, 20)).first();
    if (!e) return json({ ok: false, error: "not_found" }, 404);
    if (kind === "certificate") {
      if (e.format === "day1") return json({ ok: false, error: "day1_attestation_only", hint: "Il corso di un giorno rilascia solo l'attestato." }, 400);
      if (e.result !== "pass") return json({ ok: false, error: "not_passed" }, 400);
    } else {
      const need = e.format === "full3" ? [e.attended_d1, e.attended_d2, e.attended_d3] : [e.attended_d1];
      if (!need.every((x) => x === 1)) return json({ ok: false, error: "attendance_incomplete", hint: "L'attestato richiede la frequenza di tutte le giornate del corso." }, 400);
    }
    const d = await DB.prepare(`SELECT consent_at FROM drivers WHERE id=?`).bind(e.driver_id).first();
    if (!d.consent_at) return json({ ok: false, error: "consent_missing", hint: "Registrare la data del consenso scritto dell'autista prima di emettere." }, 400);
    const exists = await DB.prepare(`SELECT id FROM certificates WHERE enrollment_id=? AND kind=? AND status IN ('active','expired')`).bind(e.id, kind).first();
    if (exists) return json({ ok: false, error: "already_issued", id: exists.id }, 409);
    const year = new Date().getUTCFullYear();
    // contatore per anno, allineato al numero piu' alto gia' presente (import o inserimenti manuali non lo rompono)
    const maxQ = `COALESCE((SELECT MAX(CAST(substr(id,6) AS INTEGER)) FROM certificates WHERE id LIKE ?2),0)`;
    await DB.prepare(`INSERT INTO cert_counters (year,last_no) VALUES (?1, ${maxQ}+1) ON CONFLICT(year) DO UPDATE SET last_no=MAX(last_no, ${maxQ})+1`).bind(year, `${year}-%`).run();
    const n = (await DB.prepare(`SELECT last_no FROM cert_counters WHERE year=?`).bind(year).first()).last_no;
    const id = `${year}-${String(n).padStart(4, "0")}`;
    const issued = now().slice(0, 10);
    const exp = new Date(); exp.setUTCFullYear(exp.getUTCFullYear() + 2); exp.setUTCDate(exp.getUTCDate() - 1);
    const expires = kind === "attestation" ? "9999-12-31" : exp.toISOString().slice(0, 10);
    const langs = arr(body.languages, LANG_CODES) || e.dl || "[]";
    const vt = tok(12), t = now();
    const stmts = [DB.prepare(`INSERT INTO certificates (id,created_at,updated_at,driver_id,enrollment_id,kind,level,languages,issued_at,expires_at,verify_token) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(id, t, t, e.driver_id, e.id, kind, body.level === "advanced" ? "advanced" : "standard", langs, issued, expires, vt)];
    // rinnovo: il certificato precedente dell'autista viene chiuso
    if (body.renews && kind === "certificate") stmts.push(DB.prepare(`UPDATE certificates SET status='superseded', updated_at=? WHERE id=? AND driver_id=?`).bind(t, str(body.renews, 9), e.driver_id), DB.prepare(`UPDATE renewals SET status='done', new_certificate_id=?, updated_at=? WHERE certificate_id=?`).bind(id, t, str(body.renews, 9)));
    await DB.batch(stmts);
    return json({ ok: true, id, kind, verify_url: `${env.SITE_URL}/verify/${id}?t=${vt}` });
  }
  if (p === "/certificates" && M === "GET") {
    if (!isAdmin && u.role !== "operator") return deny();
    const q = `SELECT c.id,c.kind,c.level,c.languages,c.issued_at,c.expires_at,c.status,c.views,c.verify_token,d.full_name,d.name_latin,d.id AS driver_id,o.name AS operator_name FROM certificates c JOIN drivers d ON d.id=c.driver_id LEFT JOIN operators o ON o.id=d.operator_id ${isAdmin ? "" : "WHERE d.operator_id=?"} ORDER BY c.id DESC`;
    const r = (await (isAdmin ? DB.prepare(q) : DB.prepare(q).bind(u.operator_id)).all()).results;
    return json({ ok: true, rows: r.map((x) => ({ ...x, verify_url: `${env.SITE_URL}/verify/${x.id}?t=${x.verify_token}`, verify_token: isAdmin ? x.verify_token : undefined })) });
  }
  if ((m = p.match(/^\/certificates\/(\d{4}-\d{4})\/revoke$/)) && M === "POST") {
    if (!isAdmin) return deny();
    await DB.prepare(`UPDATE certificates SET status='revoked', revoked_at=?, revoke_reason=?, updated_at=? WHERE id=?`).bind(now(), str(body.reason, 500), now(), m[1]).run();
    return json({ ok: true });
  }
  if (p === "/renewals" && M === "GET") {
    if (!isAdmin) return deny();
    const r = await DB.prepare(`SELECT c.id AS certificate_id, c.expires_at, c.status AS cert_status, d.full_name, o.name AS operator_name, r.status AS renewal_status, r.reminded_60_at, r.reminded_30_at, CAST(julianday(c.expires_at)-julianday('now') AS INTEGER) AS days_left FROM certificates c JOIN drivers d ON d.id=c.driver_id LEFT JOIN operators o ON o.id=d.operator_id LEFT JOIN renewals r ON r.certificate_id=c.id WHERE c.kind='certificate' AND c.status IN ('active','expired') AND c.expires_at<=date('now','+60 day') ORDER BY c.expires_at`).all();
    return json({ ok: true, rows: r.results });
  }

  // utenti del pannello
  if (p === "/users" && M === "GET") { if (!isAdmin) return deny(); return json({ ok: true, rows: (await DB.prepare(`SELECT id,created_at,role,name,email,operator_id,status FROM panel_users ORDER BY created_at`).all()).results }); }
  if (p === "/users" && M === "POST") {
    if (!isAdmin) return deny();
    if (!["admin", "teacher", "operator"].includes(body.role) || !str(body.name)) return json({ ok: false, error: "missing_fields" }, 400);
    const token = tok(24), id = rid("USR");
    await DB.prepare(`INSERT INTO panel_users (id,created_at,role,name,email,token_hash,operator_id) VALUES (?,?,?,?,?,?,?)`).bind(id, now(), body.role, str(body.name), str(body.email), await sha256(token), body.role === "operator" ? str(body.operator_id, 20) : null).run();
    return json({ ok: true, id, token, warning: "Il token si vede solo adesso: consegnarlo alla persona e non salvarlo altrove." });
  }

  // ---- segnalazioni alle aziende partner (provvigione sul fatturato al cliente)
  const REF_ST = ["sent", "contacted", "booked", "completed", "lost"];
  const isOp = u.role === "operator" && u.operator_id;
  if ((m = p.match(/^\/operators\/(OP-[A-Z0-9]{6})$/)) && M === "POST") {
    if (!isAdmin) return deny();
    const f = {};
    if ("fee_rate" in body) { const r = Number(body.fee_rate); if (!(r >= 0 && r <= 0.5)) return json({ ok: false, error: "bad_rate", hint: "Percentuale tra 0 e 50" }, 400); f.fee_rate = r; }
    for (const k of ["billing_name", "billing_email", "contact_name", "email", "phone", "city", "notes", "status"]) if (k in body) f[k] = str(body[k], k === "notes" ? 2000 : 200);
    if (!Object.keys(f).length) return json({ ok: false, error: "nothing_to_update" }, 400);
    await DB.prepare(`UPDATE operators SET ${Object.keys(f).map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...Object.values(f), now(), m[1]).run();
    return json({ ok: true });
  }
  if (p === "/referrals" && M === "GET") {
    if (!isAdmin && !isOp) return deny();
    const per = url.searchParams.get("period");
    const w = [], v = [];
    if (!isAdmin) { w.push("r.operator_id=?"); v.push(u.operator_id); }
    if (per && /^\d{4}-\d{2}$/.test(per)) { w.push("(substr(r.completed_at,1,7)=? OR substr(r.created_at,1,7)=?)"); v.push(per, per); }
    const q = `SELECT r.*, o.name AS operator_name FROM referrals r JOIN operators o ON o.id=r.operator_id ${w.length ? "WHERE " + w.join(" AND ") : ""} ORDER BY r.created_at DESC LIMIT 1000`;
    const rows = (await DB.prepare(q).bind(...v).all()).results;
    return json({ ok: true, rows: isAdmin ? rows : rows.map(({ admin_note, ...x }) => x) });
  }
  if (p === "/referrals" && M === "POST") {
    if (!isAdmin) return deny();
    const op = await DB.prepare(`SELECT id, fee_rate FROM operators WHERE id=? AND status='active'`).bind(str(body.operator_id, 20)).first();
    if (!op) return json({ ok: false, error: "operator_not_found" }, 404);
    if (!str(body.client_name)) return json({ ok: false, error: "missing_fields", hint: "Nome del cliente obbligatorio" }, 400);
    if (!str(body.consent_at, 30)) return json({ ok: false, error: "consent_missing", hint: "Serve la data del consenso del cliente a passare i suoi dati all'azienda (privacy)." }, 400);
    const id = rid("RF"), t = now();
    await DB.prepare(`INSERT INTO referrals (id,created_at,updated_at,operator_id,lead_id,client_name,client_company,client_email,client_phone,client_lang,service_date,request,consent_at,fee_rate,admin_note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(id, t, t, op.id, str(body.lead_id, 20), str(body.client_name), str(body.client_company), str(body.client_email), str(body.client_phone, 40), str(body.client_lang, 10), str(body.service_date, 60), str(body.request, 2000), str(body.consent_at, 30), op.fee_rate, str(body.admin_note, 2000)).run();
    return json({ ok: true, id });
  }
  if ((m = p.match(/^\/referrals\/(RF-[A-Z0-9]{6})$/)) && M === "POST") {
    const r = await DB.prepare(`SELECT * FROM referrals WHERE id=?`).bind(m[1]).first();
    if (!r) return json({ ok: false, error: "not_found" }, 404);
    if (!isAdmin && !(isOp && r.operator_id === u.operator_id)) return deny();
    if (r.statement_id && !isAdmin) return json({ ok: false, error: "locked", hint: "請求書に含まれた案件は変更できません。" }, 409);
    if (r.statement_id && ("revenue_jpy" in body || "completed_at" in body || "status" in body)) return json({ ok: false, error: "locked", hint: "Segnalazione gia' in un estratto conto: annulla l'estratto prima di cambiare importi o date." }, 409);
    const f = {};
    if ("status" in body) { if (!REF_ST.includes(body.status)) return json({ ok: false, error: "bad_status" }, 400); f.status = body.status; }
    if ("completed_at" in body) { const d = str(body.completed_at, 10); if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) return json({ ok: false, error: "bad_date" }, 400); f.completed_at = d; }
    if ("revenue_jpy" in body) f.revenue_jpy = body.revenue_jpy === "" || body.revenue_jpy == null ? null : int(body.revenue_jpy, 0, 1e9);
    if ("operator_note" in body) f.operator_note = str(body.operator_note, 2000);
    if (isAdmin && "admin_note" in body) f.admin_note = str(body.admin_note, 2000);
    if (isAdmin) for (const k of ["client_name", "client_company", "client_email", "client_phone", "service_date", "request"]) if (k in body) f[k] = str(body[k], k === "request" ? 2000 : 200);
    const merged = { ...r, ...f };
    if (merged.status === "completed" && (merged.revenue_jpy == null || !merged.completed_at)) return json({ ok: false, error: "completion_incomplete", hint: isAdmin ? "Per chiudere servono importo fatturato e data del servizio." : "完了にするには、ご請求額（税抜）とご利用日を入力してください。" }, 400);
    f.fee_jpy = merged.revenue_jpy == null ? null : Math.floor(merged.revenue_jpy * merged.fee_rate);
    await DB.prepare(`UPDATE referrals SET ${Object.keys(f).map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...Object.values(f), now(), m[1]).run();
    return json({ ok: true, fee_jpy: f.fee_jpy });
  }
  if (p === "/statements" && M === "GET") {
    if (!isAdmin && !isOp) return deny();
    const q = `SELECT s.*, o.name AS operator_name FROM statements s JOIN operators o ON o.id=s.operator_id ${isAdmin ? "" : "WHERE s.operator_id=? AND s.status!='void'"} ORDER BY s.period DESC, o.name`;
    return json({ ok: true, rows: (await (isAdmin ? DB.prepare(q) : DB.prepare(q).bind(u.operator_id)).all()).results });
  }
  if (p === "/statements/generate" && M === "POST") {
    if (!isAdmin) return deny();
    const per = str(body.period, 7); if (!per || !/^\d{4}-\d{2}$/.test(per)) return json({ ok: false, error: "bad_period" }, 400);
    const groups = (await DB.prepare(`SELECT operator_id, COUNT(*) AS n, SUM(revenue_jpy) AS rev, SUM(fee_jpy) AS fee FROM referrals WHERE status='completed' AND statement_id IS NULL AND substr(completed_at,1,7)=? GROUP BY operator_id`).bind(per).all()).results;
    const made = [], skipped = [];
    const [y, mo] = per.split("-").map(Number);
    const issued = now().slice(0, 10);
    const due = new Date(Date.UTC(y, mo + 1, 0)).toISOString().slice(0, 10); // fine del mese successivo
    for (const g of groups) {
      const ex = await DB.prepare(`SELECT id FROM statements WHERE operator_id=? AND period=? AND status!='void'`).bind(g.operator_id, per).first();
      if (ex) { skipped.push(ex.id); continue; }
      const n = await DB.prepare(`SELECT COUNT(*) AS n FROM statements WHERE id LIKE ?`).bind(`HDJ-${per.replace("-", "")}-%`).first();
      const id = `HDJ-${per.replace("-", "")}-${String((n.n || 0) + 1).padStart(3, "0")}`;
      const tax = Math.floor(g.fee * 0.10), t = now();
      await DB.batch([
        DB.prepare(`INSERT INTO statements (id,created_at,updated_at,operator_id,period,items,revenue_jpy,fee_jpy,tax_jpy,total_jpy,issued_at,due_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, t, t, g.operator_id, per, g.n, g.rev, g.fee, tax, g.fee + tax, issued, due),
        DB.prepare(`UPDATE referrals SET statement_id=?, updated_at=? WHERE operator_id=? AND status='completed' AND statement_id IS NULL AND substr(completed_at,1,7)=?`).bind(id, t, g.operator_id, per),
      ]);
      made.push(id);
    }
    return json({ ok: true, made, skipped });
  }
  if ((m = p.match(/^\/statements\/(HDJ-\d{6}-\d{3})$/)) && M === "POST") {
    if (!isAdmin) return deny();
    const st = body.status; if (!["sent", "paid", "void", "issued"].includes(st)) return json({ ok: false, error: "bad_status" }, 400);
    const t = now(), stmts = [DB.prepare(`UPDATE statements SET status=?, ${st === "sent" ? "sent_at=?," : st === "paid" ? "paid_at=?," : ""} updated_at=? WHERE id=?`).bind(...(st === "sent" || st === "paid" ? [st, t, t, m[1]] : [st, t, m[1]]))];
    if (st === "void") stmts.push(DB.prepare(`UPDATE referrals SET statement_id=NULL, updated_at=? WHERE statement_id=?`).bind(t, m[1])); // le segnalazioni tornano libere
    await DB.batch(stmts);
    return json({ ok: true });
  }
  if ((m = p.match(/^\/statements\/(HDJ-\d{6}-\d{3})\/invoice$/)) && M === "GET") {
    const s = await DB.prepare(`SELECT s.*, o.name, o.billing_name FROM statements s JOIN operators o ON o.id=s.operator_id WHERE s.id=?`).bind(m[1]).first();
    if (!s) return json({ ok: false, error: "not_found" }, 404);
    if (!isAdmin && !(isOp && s.operator_id === u.operator_id)) return deny();
    const items = (await DB.prepare(`SELECT id, client_company, client_name, completed_at, revenue_jpy, fee_rate, fee_jpy FROM referrals WHERE statement_id=? ORDER BY completed_at`).bind(m[1]).all()).results;
    return new Response(invoiceHtml(s, items, env), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  // export CSV
  if ((m = p.match(/^\/export\/(leads_service|leads_training|driver_applications|operators|drivers|courses|enrollments|certificates|renewals|referrals|statements)\.csv$/)) && M === "GET") {
    if (!isAdmin) return deny();
    const r = (await DB.prepare(`SELECT * FROM ${m[1]} ORDER BY created_at`).all()).results;
    const cols = r.length ? Object.keys(r[0]).filter((c) => c !== "verify_token" && c !== "token_hash" && c !== "ip_hash") : [];
    const cell = (v) => { const s = v == null ? "" : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = "﻿" + [cols.join(","), ...r.map((x) => cols.map((c) => cell(x[c])).join(","))].join("\r\n");
    return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${m[1]}-${now().slice(0, 10)}.csv"`, "cache-control": "no-store" } });
  }
  return json({ ok: false, error: "not_found" }, 404);
}

// ---------------------------------------------------------------- fattura provvigioni (適格請求書)
function invoiceHtml(s, items, env) {
  const yen = (n) => "¥" + Number(n || 0).toLocaleString("ja-JP");
  const ph = (v, label) => v ? esc(v).replace(/\n/g, "<br>") : `<span class="ph">${label}</span>`;
  const [y, mo] = s.period.split("-");
  const rows = items.map((r) => `<tr><td>${esc(r.completed_at)}</td><td>${esc(r.client_company || r.client_name)}<br><small>${esc(r.id)}</small></td><td class="n">${yen(r.revenue_jpy)}</td><td class="n">${Math.round(r.fee_rate * 100)}%</td><td class="n">${yen(r.fee_jpy)}</td></tr>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>請求書 ${esc(s.id)}</title><style>
@page{size:A4;margin:16mm}body{font:12px/1.6 "Hiragino Sans","Noto Sans JP",system-ui,sans-serif;color:#14110E;margin:0}
.w{max-width:180mm;margin:0 auto;padding:8mm 0}h1{font-size:22px;letter-spacing:.3em;text-align:center;margin:0 0 8mm}
.top{display:flex;justify-content:space-between;gap:10mm}.to{font-size:15px;border-bottom:1px solid #14110E;padding-bottom:2mm;min-width:80mm}
.from{text-align:right;font-size:11px}.brand{font-weight:700;color:#8a6a2f;letter-spacing:.04em}.tot{margin:8mm 0 6mm;font-size:16px;border:1px solid #14110E;padding:3mm 4mm;display:flex;justify-content:space-between}
table{width:100%;border-collapse:collapse;margin:4mm 0}th,td{border-bottom:1px solid #ccc;padding:2mm;text-align:left;vertical-align:top}th{background:#f3efe6;font-size:11px}.n{text-align:right;white-space:nowrap}
.sum td{border:0;padding:1mm 2mm}.sum .n{min-width:35mm}.note{font-size:10.5px;color:#444;margin-top:6mm}.ph{background:#fff2c6;padding:0 3px}small{color:#666}
@media print{.noprint{display:none}}</style></head><body><div class="w">
<p class="noprint" style="text-align:right"><button onclick="print()">印刷・PDF保存</button></p>
<h1>請求書</h1>
<div class="top"><div><div class="to">${ph(s.billing_name || s.name, "宛名")} 御中</div><p>件名：送客紹介料（${esc(y)}年${Number(mo)}月分）</p></div>
<div class="from"><div>請求番号：${esc(s.id)}</div><div>発行日：${esc(s.issued_at)}</div><p><span class="brand">HIRE driver japan</span><br>${ph(env.INVOICE_ISSUER, "発行事業者名")}<br>${ph(env.INVOICE_ADDRESS, "住所")}<br>登録番号：${ph(env.INVOICE_REG_NO, "T+13桁")}</p></div></div>
<div class="tot"><span>ご請求金額（税込）</span><b>${yen(s.total_jpy)}</b></div>
<table><tr><th>ご利用日</th><th>お客さま・案件番号</th><th class="n">ご利用額（税抜）</th><th class="n">料率</th><th class="n">紹介料</th></tr>${rows}</table>
<table class="sum"><tr><td></td><td class="n">紹介料 小計（10%対象）</td><td class="n">${yen(s.fee_jpy)}</td></tr><tr><td></td><td class="n">消費税（10%）</td><td class="n">${yen(s.tax_jpy)}</td></tr><tr><td></td><td class="n"><b>合計</b></td><td class="n"><b>${yen(s.total_jpy)}</b></td></tr></table>
<p>お支払期限：${esc(s.due_date)}<br>お振込先：${ph(env.INVOICE_BANK, "銀行名・支店・口座種別・口座番号・口座名義")}<br><small>振込手数料はご負担ください。</small></p>
<p class="note">本請求は、提携契約にもとづく送客紹介料です。紹介料は、ご紹介したお客さまへの御社のご請求額（税抜）に料率を乗じて算出しています。運送契約と運賃のお支払いは、御社とお客さまの間で行われたものです。</p>
</div></body></html>`;
}

// ---------------------------------------------------------------- cron giornaliero
async function daily(env) {
  const t = now(), today = t.slice(0, 10);
  await env.DB.prepare(`UPDATE certificates SET status='expired', updated_at=? WHERE status='active' AND expires_at<?`).bind(t, today).run();
  const due = (await env.DB.prepare(`SELECT c.id FROM certificates c LEFT JOIN renewals r ON r.certificate_id=c.id WHERE c.status='active' AND c.expires_at<=date('now','+60 day') AND r.id IS NULL`).all()).results;
  for (const c of due) await env.DB.prepare(`INSERT OR IGNORE INTO renewals (id,created_at,updated_at,certificate_id,reminded_60_at) VALUES (?,?,?,?,?)`).bind(rid("RNW"), t, t, c.id, t).run();
  const d30 = (await env.DB.prepare(`SELECT r.id FROM renewals r JOIN certificates c ON c.id=r.certificate_id WHERE r.status='due' AND r.reminded_30_at IS NULL AND c.expires_at<=date('now','+30 day')`).all()).results;
  for (const r of d30) await env.DB.prepare(`UPDATE renewals SET reminded_30_at=?, updated_at=? WHERE id=?`).bind(t, t, r.id).run();
  await env.DB.prepare(`UPDATE renewals SET status='lapsed', updated_at=? WHERE status IN ('due','scheduled') AND certificate_id IN (SELECT id FROM certificates WHERE status='expired')`).bind(t).run();
  const list = (await env.DB.prepare(`SELECT c.id, c.expires_at, d.full_name, o.name AS op FROM certificates c JOIN drivers d ON d.id=c.driver_id LEFT JOIN operators o ON o.id=d.operator_id WHERE c.status='active' AND c.expires_at<=date('now','+60 day') ORDER BY c.expires_at`).all()).results;
  const nl = await env.DB.prepare(`SELECT (SELECT COUNT(*) FROM leads_service WHERE stage='new')+(SELECT COUNT(*) FROM leads_training WHERE stage='new')+(SELECT COUNT(*) FROM driver_applications WHERE stage='new') AS n`).first();
  if ((list.length || nl.n) && env.RESEND_API_KEY && env.FROM_EMAIL && env.CONTACT_EMAIL) {
    const rows = list.map((x) => `<li>${esc(x.id)} · ${esc(x.full_name)} · ${esc(x.op || "")} · scade ${esc(x.expires_at)}</li>`).join("");
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", "idempotency-key": `daily-${today}` }, body: JSON.stringify({ from: env.FROM_EMAIL, to: [env.CONTACT_EMAIL], subject: `[Riepilogo ${today}] ${nl.n} richieste nuove, ${list.length} certificati in scadenza`, html: `<p>Richieste nuove da lavorare: <b>${nl.n}</b></p><p>Certificati in scadenza entro 60 giorni:</p><ul>${rows || "<li>nessuno</li>"}</ul><p><a href="${esc(env.SITE_URL)}/admin/">Pannello</a></p>` }) });
  }
}
