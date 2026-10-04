// Pagamenti HDJ, sul modello di driventokyo.com: il pannello crea un link brandizzato /p/CODE;
// a ogni apertura il Worker crea un Checkout Stripe nuovo (il link non scade mai), il webhook segna il pagamento.
// Account Stripe SEPARATO da Driven (stesso login, altro account): segreti STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET.

const now = () => new Date().toISOString();
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const code = () => { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const b = crypto.getRandomValues(new Uint8Array(6)); return [...b].map((x) => a[x % a.length]).join(""); };
const str = (v, max = 200) => (v == null ? null : String(v).trim().slice(0, max) || null);
const int = (v, lo = 0, hi = 1e9) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
export const CARD_FEE = 1.05; // la fee carta e' sempre sul cliente, non si dichiara come tale (regola delle reti giapponesi)

async function verifyStripeSig(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  const parts = {}; for (const kv of sigHeader.split(",")) { const i = kv.indexOf("="); parts[kv.slice(0, i)] = kv.slice(i + 1); }
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${parts.t}.${rawBody}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("") === parts.v1;
}

const T = {
  ja: { paid: "お支払いが完了しました", paidTxt: "ありがとうございます。確認のメールをお送りします。", cancel: "お支払いは完了していません", cancelTxt: "同じリンクから、いつでもやり直せます。", nf: "このお支払いリンクは無効です。", done: "このお支払いはすでに完了しています。", back: "トップへ", pay: "お支払いへ進む", amount: "お支払い金額（税込）" },
  en: { paid: "Payment received", paidTxt: "Thank you. A confirmation email is on its way.", cancel: "Payment not completed", cancelTxt: "You can use the same link again at any time.", nf: "This payment link is not valid.", done: "This payment has already been made.", back: "Home", pay: "Proceed to payment", amount: "Amount (tax included)" },
  zh: { paid: "付款已完成", paidTxt: "谢谢。我们将向您发送确认邮件。", cancel: "付款未完成", cancelTxt: "可随时使用同一链接重新支付。", nf: "此付款链接无效。", done: "此款项已支付。", back: "首页", pay: "前往付款", amount: "付款金额（含税）" },
};
const yen = (n) => "¥" + Number(n).toLocaleString("ja-JP");
function page(env, lang, title, body) {
  const t = T[lang] || T.en;
  return new Response(`<!doctype html><html lang="${lang === "zh" ? "zh-Hans" : lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} | ${esc(env.BRAND_NAME)}</title><link rel="stylesheet" href="/assets/site.css"><link rel="icon" href="/assets/favicon.svg"></head><body><div class="top"><div class="wrap bar"><a class="logo" href="/${lang}/"><img class="mark" src="/assets/hdj-mark.svg" width="38" height="38" alt=""><span class="lt"><span class="wm"><b>HIRE</b> driver japan</span></span></a></div></div><main id="main" class="wrap"><section class="vres"><h1 style="font-size:26px">${esc(title)}</h1>${body}<p><a href="/${lang}/">${esc(t.back)}</a></p></section></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-no-cache": "1" } });
}

// /p/CODE : pagina con importo e pulsante; /p/CODE/go : crea il Checkout e reindirizza; /p/CODE/ok e /cancel : ritorno
export async function payPublic(req, env, url) {
  const m = url.pathname.match(/^\/p\/([A-Z0-9]{6})(?:\/(go|ok|cancel))?\/?$/); if (!m) return null;
  const r = await env.DB.prepare(`SELECT * FROM payments WHERE code=?`).bind(m[1]).first();
  const lang = r && ["ja", "en", "zh"].includes(r.lang) ? r.lang : "en"; const t = T[lang];
  if (!r || r.status === "void") return page(env, lang, t.nf, "");
  if (m[2] === "ok") return page(env, lang, t.paid, `<p>${esc(t.paidTxt)}</p>`);
  if (m[2] === "cancel") return page(env, lang, t.cancel, `<p>${esc(t.cancelTxt)}</p><p><a class="btn" href="/p/${r.code}">${esc(t.pay)}</a></p>`);
  if (r.status === "paid") return page(env, lang, t.done, "");
  if (m[2] === "go") {
    if (!env.STRIPE_SECRET_KEY) return page(env, lang, t.nf, "<p>Stripe non configurato.</p>");
    const p = new URLSearchParams();
    p.set("mode", "payment"); p.set("success_url", `${env.SITE_URL}/p/${r.code}/ok`); p.set("cancel_url", `${env.SITE_URL}/p/${r.code}/cancel`);
    if (r.email) p.set("customer_email", r.email);
    p.set("client_reference_id", r.code); p.set("metadata[code]", r.code); p.set("metadata[ref]", r.ref || "");
    p.set("line_items[0][quantity]", "1"); p.set("line_items[0][price_data][currency]", "jpy"); p.set("line_items[0][price_data][unit_amount]", String(r.amount_jpy));
    p.set("line_items[0][price_data][product_data][name]", `${env.BRAND_NAME} · ${r.title}`.slice(0, 200));
    if (r.description) p.set("line_items[0][price_data][product_data][description]", r.description.slice(0, 500));
    p.set("payment_method_types[0]", "card"); p.set("locale", lang === "zh" ? "zh" : lang);
    const s = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" }, body: p.toString() });
    const j = await s.json();
    if (!s.ok || !j.url) { console.error("stripe", j); return page(env, lang, t.nf, `<p>${esc(j.error?.message || "Stripe error")}</p>`); }
    await env.DB.prepare(`UPDATE payments SET last_session=?, opened=opened+1, updated_at=? WHERE code=?`).bind(j.id, now(), r.code).run();
    return Response.redirect(j.url, 303);
  }
  return page(env, lang, r.title, `${r.description ? `<p>${esc(r.description)}</p>` : ""}<p class="note">${esc(t.amount)}</p><p style="font-size:30px;font-family:'Cormorant Garamond',serif;color:#C7A36A;margin:0 0 18px">${yen(r.amount_jpy)}</p><p><a class="btn" href="/p/${r.code}/go">${esc(t.pay)}</a></p>`);
}

export async function stripeWebhook(req, env) {
  const raw = await req.text();
  if (!(await verifyStripeSig(raw, req.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET))) return json({ ok: false, error: "bad_signature" }, 400);
  const ev = JSON.parse(raw);
  if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
    const o = ev.data.object; const c = o.metadata?.code || o.client_reference_id;
    if (c && (o.payment_status === "paid" || ev.type.endsWith("succeeded"))) {
      await env.DB.prepare(`UPDATE payments SET status='paid', paid_at=?, stripe_payment_intent=?, paid_amount_jpy=?, payer_email=?, updated_at=? WHERE code=? AND status!='paid'`).bind(now(), str(o.payment_intent, 100), int(o.amount_total, 0), str(o.customer_details?.email || o.customer_email, 200), now(), c).run();
      // se il link era legato a una richiesta del sito, la richiesta passa a "confermata"
      const r = await env.DB.prepare(`SELECT ref FROM payments WHERE code=?`).bind(c).first();
      if (r?.ref) await env.DB.prepare(`UPDATE leads_service SET stage='confirmed', updated_at=? WHERE id=? AND stage IN ('new','contacted','quoted')`).bind(now(), r.ref).run().catch(() => {});
    }
  }
  return json({ ok: true, received: true });
}

// pannello: crea / elenca / annulla link
export async function payAdmin(req, env, url, u, p, M, body) {
  if (!u || u.role !== "admin") return null;
  const DB = env.DB; let m;
  if (p === "/payments" && M === "GET") return json({ ok: true, stripe: !!env.STRIPE_SECRET_KEY, webhook: !!env.STRIPE_WEBHOOK_SECRET, rows: (await DB.prepare(`SELECT * FROM payments ORDER BY created_at DESC LIMIT 300`).all()).results.map((x) => ({ ...x, url: `${env.SITE_URL}/p/${x.code}` })) });
  if (p === "/payments" && M === "POST") {
    const base = int(body.base_jpy, 1, 1e8); if (!base || !str(body.title)) return json({ ok: false, error: "missing_fields", hint: "Servono titolo e importo base (IVA inclusa, senza fee carta)." }, 400);
    const amount = body.no_fee ? base : Math.ceil(base * CARD_FEE); // fee carta sul cliente, salvo eccezione esplicita
    const c = code(), t = now();
    await DB.prepare(`INSERT INTO payments (code,created_at,updated_at,lang,title,description,base_jpy,amount_jpy,fee_applied,email,ref,note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(c, t, t, ["ja", "en", "zh"].includes(body.lang) ? body.lang : "en", str(body.title), str(body.description, 500), base, amount, body.no_fee ? 0 : 1, str(body.email), str(body.ref, 20), str(body.note, 1000)).run();
    return json({ ok: true, code: c, url: `${env.SITE_URL}/p/${c}`, amount_jpy: amount });
  }
  if ((m = p.match(/^\/payments\/([A-Z0-9]{6})$/)) && M === "POST") {
    if (body.status === "void") { await DB.prepare(`UPDATE payments SET status='void', updated_at=? WHERE code=? AND status!='paid'`).bind(now(), m[1]).run(); return json({ ok: true }); }
    if (body.status === "paid_manual") { await DB.prepare(`UPDATE payments SET status='paid', paid_at=?, note=COALESCE(note,'')||' [segnato pagato a mano]', updated_at=? WHERE code=?`).bind(now(), now(), m[1]).run(); return json({ ok: true }); }
    return json({ ok: false, error: "bad_status" }, 400);
  }
  return null;
}
