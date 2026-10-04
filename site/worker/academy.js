// HDJ Academy: videolezioni, progressi, esame scritto online.
// Autisti: link personale /academy/#k=CHIAVE (la chiave resta nel frammento, non arriva nei log), poi header x-academy-key.
// Video: in R2 (binding ACADEMY), serviti solo con link firmato a scadenza e richieste Range per lo scorrimento.

const now = () => new Date().toISOString();
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const rid = (p, n = 6) => { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const b = crypto.getRandomValues(new Uint8Array(n)); return p + "-" + [...b].map((x) => a[x % a.length]).join(""); };
const tok = (n = 24) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, "0")).join("");
const str = (v, max = 200) => (v == null ? null : String(v).trim().slice(0, max) || null);
const int = (v, lo = 0, hi = 1e9) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
async function sha256(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg));
  return [...new Uint8Array(s)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const EXAM = { questions: 20, minutes: 30, pass: 70, included_attempts: 2, complete_pct: 90 };

async function videoUrl(env, lessonId, who) {
  const exp = Math.floor(Date.now() / 1000) + 4 * 3600;
  const sig = await hmac(env.ACADEMY_SECRET, `${lessonId}.${who}.${exp}`);
  return `/api/academy/video/${lessonId}?w=${encodeURIComponent(who)}&e=${exp}&s=${sig}`;
}

async function fileUrl(env, key, who) {
  const exp = Math.floor(Date.now() / 1000) + 4 * 3600;
  const sig = await hmac(env.ACADEMY_SECRET, `${key}.${who}.${exp}`);
  return `/api/academy/file?k=${encodeURIComponent(key)}&w=${encodeURIComponent(who)}&e=${exp}&s=${sig}`;
}
const HANDBOOKS = [[1, "materials/hdj-academy-day1.pdf"], [2, "materials/hdj-academy-day2.pdf"]];

async function learner(req, env) {
  const k = req.headers.get("x-academy-key"); if (!k || k.length < 20) return null;
  const r = await env.DB.prepare(`SELECT d.id, d.full_name, d.name_latin, d.operator_id, d.academy_exam_extra, k.id AS key_id FROM academy_keys k JOIN drivers d ON d.id=k.driver_id WHERE k.key_hash=? AND k.status='active' AND d.academy_access=1`).bind(await sha256(k)).first();
  if (r) await env.DB.prepare(`UPDATE academy_keys SET last_used_at=? WHERE id=?`).bind(now(), r.key_id).run();
  return r || null;
}

async function examState(env, d) {
  const pub = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM lessons WHERE status='published'`).first()).n;
  const done = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM lesson_progress p JOIN lessons l ON l.id=p.lesson_id WHERE p.driver_id=? AND l.status='published' AND p.completed_at IS NOT NULL`).bind(d.id).first()).n;
  const atts = (await env.DB.prepare(`SELECT id, started_at, deadline_at, submitted_at, score, passed FROM exam_attempts WHERE driver_id=? ORDER BY started_at`).bind(d.id).all()).results;
  const used = atts.filter((a) => a.submitted_at || a.deadline_at < now()).length;
  const allowed = EXAM.included_attempts + (d.academy_exam_extra || 0);
  const passed = atts.some((a) => a.passed === 1);
  const open = atts.find((a) => !a.submitted_at && a.deadline_at >= now());
  return { lessons_published: pub, lessons_done: done, unlocked: pub === 0 || done >= pub, attempts: atts.map(({ id, ...a }) => a), attempts_used: used, attempts_allowed: allowed, passed, open_attempt: open ? open.id : null, rules: EXAM };
}

// ---------------------------------------------------------------- rotte pubbliche dell'Academy
export async function academyPublic(req, env, url) {
  const p = url.pathname.replace(/^\/api\/academy/, ""); const M = req.method; let m;
  if (!env.ACADEMY_SECRET) return json({ ok: false, error: "academy_not_configured" }, 503);

  // video: link firmato, valido 4 ore, con Range per lo scorrimento
  if ((m = p.match(/^\/video\/(LS-\d{3}|LS-[A-Z0-9]{6})$/)) && (M === "GET" || M === "HEAD")) {
    const w = url.searchParams.get("w") || "", e = int(url.searchParams.get("e"), 0, 4e9), s = url.searchParams.get("s") || "";
    if (!e || e < Date.now() / 1000 || s !== await hmac(env.ACADEMY_SECRET, `${m[1]}.${w}.${e}`)) return new Response("Link scaduto", { status: 403 });
    const l = await env.DB.prepare(`SELECT video_key, video_type FROM lessons WHERE id=?`).bind(m[1]).first();
    if (!l || !l.video_key) return new Response("Not found", { status: 404 });
    const head = await env.ACADEMY.head(l.video_key); if (!head) return new Response("Not found", { status: 404 });
    const size = head.size, type = l.video_type || "video/mp4";
    const base = { "content-type": type, "accept-ranges": "bytes", "cache-control": "private, no-store", "content-disposition": "inline", "x-robots-tag": "noindex" };
    const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") || "");
    if (rg && (rg[1] || rg[2])) {
      let start, end;
      if (rg[1] === "") { start = Math.max(0, size - parseInt(rg[2], 10)); end = size - 1; } else { start = parseInt(rg[1], 10); end = rg[2] ? Math.min(parseInt(rg[2], 10), size - 1) : size - 1; }
      if (start >= size || start > end) return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
      if (M === "HEAD") return new Response(null, { status: 206, headers: { ...base, "content-range": `bytes ${start}-${end}/${size}`, "content-length": String(end - start + 1) } });
      const o = await env.ACADEMY.get(l.video_key, { range: { offset: start, length: end - start + 1 } });
      return new Response(o.body, { status: 206, headers: { ...base, "content-range": `bytes ${start}-${end}/${size}`, "content-length": String(end - start + 1) } });
    }
    if (M === "HEAD") return new Response(null, { headers: { ...base, "content-length": String(size) } });
    const o = await env.ACADEMY.get(l.video_key);
    return new Response(o.body, { headers: { ...base, "content-length": String(size) } });
  }

  if (p === "/file" && M === "GET") {
    const k = url.searchParams.get("k") || "", w = url.searchParams.get("w") || "", e = int(url.searchParams.get("e"), 0, 4e9), sg = url.searchParams.get("s") || "";
    if (!k.startsWith("materials/") || k.includes("..") || !e || e < Date.now() / 1000 || sg !== await hmac(env.ACADEMY_SECRET, `${k}.${w}.${e}`)) return new Response("Link scaduto", { status: 403 });
    const o = await env.ACADEMY.get(k); if (!o) return new Response("Not found", { status: 404 });
    return new Response(o.body, { headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="${k.split("/").pop()}"`, "cache-control": "private, no-store", "x-robots-tag": "noindex" } });
  }

  const d = await learner(req, env);
  if (!d) return json({ ok: false, error: "unauthorized" }, 401);
  const body = M === "POST" ? await req.json().catch(() => ({})) : {};

  if (p === "/me" && M === "GET") {
    const lessons = (await env.DB.prepare(`SELECT l.id, l.day, l.position, l.title_ja, l.title_en, l.summary_ja, l.summary_en, l.duration_s, (l.video_key IS NOT NULL) AS has_video, COALESCE(p.watched_pct,0) AS pct, p.completed_at FROM lessons l LEFT JOIN lesson_progress p ON p.lesson_id=l.id AND p.driver_id=? WHERE l.status='published' ORDER BY l.day, l.position`).bind(d.id).all()).results;
    const handbooks = []; for (const [day, k] of HANDBOOKS) if (await env.ACADEMY.head(k)) handbooks.push({ day, url: await fileUrl(env, k, d.id) });
    return json({ ok: true, driver: { name: d.full_name, name_latin: d.name_latin }, lessons, handbooks, exam: await examState(env, d) });
  }
  if ((m = p.match(/^\/lessons\/(LS-[A-Z0-9]{3,6})$/)) && M === "GET") {
    const l = await env.DB.prepare(`SELECT id, day, position, title_ja, title_en, summary_ja, summary_en, notes_ja, notes_en, duration_s, video_key, pdf_key FROM lessons WHERE id=? AND status='published'`).bind(m[1]).first();
    if (!l) return json({ ok: false, error: "not_found" }, 404);
    await env.DB.prepare(`INSERT OR IGNORE INTO lesson_progress (driver_id,lesson_id,max_pos_s,watched_pct,updated_at) VALUES (?,?,0,0,?)`).bind(d.id, l.id, now()).run(); // da qui parte il tempo dell'anti-salto
    const pr = await env.DB.prepare(`SELECT max_pos_s, watched_pct, completed_at FROM lesson_progress WHERE driver_id=? AND lesson_id=?`).bind(d.id, l.id).first();
    const { video_key, pdf_key, ...x } = l;
    return json({ ok: true, lesson: { ...x, video_url: video_key ? await videoUrl(env, l.id, d.id) : null, pdf_url: pdf_key ? await fileUrl(env, pdf_key, d.id) : null }, progress: pr || { max_pos_s: 0, watched_pct: 0 } });
  }
  if (p === "/progress" && M === "POST") {
    const l = await env.DB.prepare(`SELECT id, duration_s FROM lessons WHERE id=? AND status='published'`).bind(str(body.lesson_id, 12)).first();
    if (!l) return json({ ok: false, error: "not_found" }, 404);
    const dur = Number(body.duration) > 0 ? Number(body.duration) : l.duration_s || 0, pos = Math.max(0, Number(body.pos) || 0);
    if (!dur) return json({ ok: false, error: "no_duration" }, 400);
    const old = await env.DB.prepare(`SELECT max_pos_s, updated_at, completed_at FROM lesson_progress WHERE driver_id=? AND lesson_id=?`).bind(d.id, l.id).first();
    // anti salto: il punto massimo raggiunto cresce al massimo come il tempo reale passato da quando si e' aperta la lezione (x2) + 10 secondi
    const elapsed = old ? (Date.now() - Date.parse(old.updated_at)) / 1000 : 0;
    const cap = old ? old.max_pos_s + elapsed * 2 + 10 : 10;
    const maxPos = Math.max(old ? old.max_pos_s : 0, Math.min(pos, cap, dur));
    const pct = Math.min(100, Math.round((maxPos / dur) * 100));
    const done = old && old.completed_at ? old.completed_at : pct >= EXAM.complete_pct ? now() : null;
    await env.DB.prepare(`INSERT INTO lesson_progress (driver_id,lesson_id,max_pos_s,watched_pct,completed_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(driver_id,lesson_id) DO UPDATE SET max_pos_s=excluded.max_pos_s, watched_pct=excluded.watched_pct, completed_at=excluded.completed_at, updated_at=excluded.updated_at`).bind(d.id, l.id, maxPos, pct, done, now()).run();
    if (!l.duration_s && Number(body.duration) > 0) await env.DB.prepare(`UPDATE lessons SET duration_s=? WHERE id=? AND duration_s IS NULL`).bind(Math.round(Number(body.duration)), l.id).run();
    return json({ ok: true, pct, completed: !!done });
  }
  if (p === "/exam" && M === "GET") return json({ ok: true, exam: await examState(env, d) });
  if (p === "/exam/start" && M === "POST") {
    const st = await examState(env, d);
    if (st.passed) return json({ ok: false, error: "already_passed" }, 409);
    if (!st.unlocked) return json({ ok: false, error: "locked" }, 403);
    let a = st.open_attempt ? await env.DB.prepare(`SELECT * FROM exam_attempts WHERE id=?`).bind(st.open_attempt).first() : null;
    if (!a) {
      if (st.attempts_used >= st.attempts_allowed) return json({ ok: false, error: "no_attempts" }, 403);
      const qs0 = (await env.DB.prepare(`SELECT id, options_ja FROM exam_questions WHERE status='active' ORDER BY random() LIMIT ?`).bind(EXAM.questions).all()).results;
      if (!qs0.length) return json({ ok: false, error: "no_questions" }, 503);
      const shuffle = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const ids = qs0.map((x) => [x.id, shuffle(JSON.parse(x.options_ja).length)]);
      const t = new Date(); const dl = new Date(t.getTime() + EXAM.minutes * 60000);
      a = { id: rid("EX"), started_at: t.toISOString(), deadline_at: dl.toISOString(), question_ids: JSON.stringify(ids) };
      await env.DB.prepare(`INSERT INTO exam_attempts (id,driver_id,started_at,deadline_at,question_ids) VALUES (?,?,?,?,?)`).bind(a.id, d.id, a.started_at, a.deadline_at, a.question_ids).run();
    }
    const plan = JSON.parse(a.question_ids), ids = plan.map((x) => x[0]), perm = Object.fromEntries(plan);
    const qs = (await env.DB.prepare(`SELECT id, q_ja, q_en, options_ja, options_en FROM exam_questions WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results;
    const byId = Object.fromEntries(qs.map((x) => [x.id, x]));
    return json({ ok: true, attempt: { id: a.id, deadline_at: a.deadline_at }, questions: ids.filter((i) => byId[i]).map((i) => ({ id: i, q_ja: byId[i].q_ja, q_en: byId[i].q_en, options_ja: perm[i].map((k) => JSON.parse(byId[i].options_ja)[k]), options_en: byId[i].options_en ? perm[i].map((k) => JSON.parse(byId[i].options_en)[k]) : null })) });
  }
  if (p === "/exam/submit" && M === "POST") {
    const a = await env.DB.prepare(`SELECT * FROM exam_attempts WHERE id=? AND driver_id=?`).bind(str(body.attempt_id, 12), d.id).first();
    if (!a) return json({ ok: false, error: "not_found" }, 404);
    if (a.submitted_at) return json({ ok: false, error: "already_submitted", score: a.score, passed: a.passed }, 409);
    const late = Date.now() > Date.parse(a.deadline_at) + 60000; // un minuto di tolleranza per la rete
    const plan = JSON.parse(a.question_ids), ids = plan.map((x) => x[0]), perm = Object.fromEntries(plan);
    const keys = Object.fromEntries((await env.DB.prepare(`SELECT id, correct FROM exam_questions WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results.map((x) => [x.id, x.correct]));
    const ans = body.answers && typeof body.answers === "object" ? body.answers : {};
    // la risposta arriva nella posizione mostrata: perm la riporta all'indice originale
    const right = late ? 0 : ids.filter((i) => ans[i] != null && perm[i][Number(ans[i])] === keys[i]).length;
    const score = Math.round((right / ids.length) * 100), passed = score >= EXAM.pass ? 1 : 0, t = now();
    await env.DB.prepare(`UPDATE exam_attempts SET submitted_at=?, answers=?, score=?, passed=? WHERE id=?`).bind(t, JSON.stringify(ans), score, passed, a.id).run();
    // il voto dello scritto entra nell'ultima iscrizione dell'autista ancora senza voto; l'esito lo ricalcola il pannello al salvataggio
    if (passed) await env.DB.prepare(`UPDATE enrollments SET score_written=?, pass_written=1, updated_at=? WHERE id=(SELECT id FROM enrollments WHERE driver_id=? AND score_written IS NULL ORDER BY created_at DESC LIMIT 1)`).bind(score, t, d.id).run();
    return json({ ok: true, score, passed: !!passed, right, total: ids.length, late, pass_mark: EXAM.pass });
  }
  return json({ ok: false, error: "not_found" }, 404);
}

// ---------------------------------------------------------------- rotte del pannello (admin, e in lettura l'azienda)
export async function academyAdmin(req, env, url, u, p, M, body) {
  const isAdmin = u.role === "admin", isOp = u.role === "operator" && u.operator_id;
  const deny = () => json({ ok: false, error: "forbidden" }, 403);
  const DB = env.DB; let m;

  if (p === "/academy/lessons" && M === "GET") {
    if (!isAdmin) return deny();
    const rows = (await DB.prepare(`SELECT l.*, (SELECT COUNT(*) FROM lesson_progress p WHERE p.lesson_id=l.id AND p.completed_at IS NOT NULL) AS completions FROM lessons l ORDER BY l.day, l.position`).all()).results;
    for (const r of rows) r.preview_url = r.video_key && env.ACADEMY_SECRET ? await videoUrl(env, r.id, "ADMIN") : null;
    for (const r of rows) r.pdf_url = r.pdf_key && env.ACADEMY_SECRET ? await fileUrl(env, r.pdf_key, "ADMIN") : null;
    return json({ ok: true, rows });
  }
  if ((p === "/academy/lessons" || (m = p.match(/^\/academy\/lessons\/(LS-[A-Z0-9]{3,6})$/))) && M === "POST") {
    if (!isAdmin) return deny();
    const f = {};
    for (const k of ["title_ja", "title_en", "summary_ja", "summary_en"]) if (k in body) f[k] = str(body[k], 300);
    for (const k of ["notes_ja", "notes_en"]) if (k in body) f[k] = str(body[k], 20000);
    if ("day" in body) f.day = int(body.day, 1, 3);
    if ("position" in body) f.position = int(body.position, 0, 999);
    if ("status" in body) { if (!["draft", "published"].includes(body.status)) return json({ ok: false, error: "bad_status" }, 400); f.status = body.status; }
    if (body.remove_video) Object.assign(f, { video_key: null, video_type: null, video_bytes: null, duration_s: null });
    const t = now();
    if (p === "/academy/lessons") {
      if (!f.title_ja || !f.day) return json({ ok: false, error: "missing_fields", hint: "Servono giorno e titolo giapponese." }, 400);
      const id = rid("LS"); const pos = f.position ?? ((await DB.prepare(`SELECT COALESCE(MAX(position),0)+1 AS n FROM lessons`).first()).n);
      await DB.prepare(`INSERT INTO lessons (id,created_at,updated_at,day,position,title_ja,title_en,summary_ja,summary_en,notes_ja,notes_en,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, t, t, f.day, pos, f.title_ja, f.title_en ?? null, f.summary_ja ?? null, f.summary_en ?? null, f.notes_ja ?? null, f.notes_en ?? null, f.status || "draft").run();
      return json({ ok: true, id });
    }
    if (f.status === "published") { const l = await DB.prepare(`SELECT video_key FROM lessons WHERE id=?`).bind(m[1]).first(); if (l && !l.video_key && !body.allow_no_video) return json({ ok: false, error: "no_video", hint: "Carica il video prima di pubblicare." }, 400); }
    if (!Object.keys(f).length) return json({ ok: false, error: "nothing_to_update" }, 400);
    await DB.prepare(`UPDATE lessons SET ${Object.keys(f).map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...Object.values(f), t, m[1]).run();
    return json({ ok: true });
  }
  // caricamento video a pezzi (R2 multipart): start -> part (PUT, 10 MB l'uno) -> complete
  if (p === "/academy/upload/start" && M === "POST") {
    if (!isAdmin) return deny();
    const l = await DB.prepare(`SELECT id FROM lessons WHERE id=?`).bind(str(body.lesson_id, 12)).first(); if (!l) return json({ ok: false, error: "not_found" }, 404);
    const type = /^video\/(mp4|webm|quicktime)$/.test(body.type || "") ? body.type : "video/mp4";
    const key = `lessons/${l.id}/${Date.now()}.${type === "video/webm" ? "webm" : type === "video/quicktime" ? "mov" : "mp4"}`;
    const up = await env.ACADEMY.createMultipartUpload(key, { httpMetadata: { contentType: type } });
    return json({ ok: true, key, upload_id: up.uploadId });
  }
  if (p === "/academy/upload/part" && M === "PUT") {
    if (!isAdmin) return deny();
    const key = url.searchParams.get("key"), uid = url.searchParams.get("upload_id"), n = int(url.searchParams.get("part"), 1, 10000);
    if (!key || !uid || !n || !key.startsWith("lessons/")) return json({ ok: false, error: "bad_request" }, 400);
    const up = env.ACADEMY.resumeMultipartUpload(key, uid);
    const part = await up.uploadPart(n, req.body);
    return json({ ok: true, part: { partNumber: part.partNumber, etag: part.etag } });
  }
  if (p === "/academy/upload/complete" && M === "POST") {
    if (!isAdmin) return deny();
    const key = str(body.key, 200), uid = str(body.upload_id, 500);
    if (!key || !uid || !key.startsWith("lessons/") || !Array.isArray(body.parts)) return json({ ok: false, error: "bad_request" }, 400);
    const up = env.ACADEMY.resumeMultipartUpload(key, uid);
    const obj = await up.complete(body.parts.map((x) => ({ partNumber: x.partNumber, etag: x.etag })));
    const lid = key.split("/")[1];
    await DB.prepare(`UPDATE lessons SET video_key=?, video_type=?, video_bytes=?, duration_s=?, updated_at=? WHERE id=?`).bind(key, obj.httpMetadata?.contentType || "video/mp4", obj.size, int(body.duration_s, 1, 36000), now(), lid).run();
    return json({ ok: true, bytes: obj.size });
  }
  if (p === "/academy/upload/abort" && M === "POST") {
    if (!isAdmin) return deny();
    try { await env.ACADEMY.resumeMultipartUpload(str(body.key, 200), str(body.upload_id, 500)).abort(); } catch (_) {}
    return json({ ok: true });
  }

  if (p === "/academy/questions" && M === "GET") { if (!isAdmin) return deny(); return json({ ok: true, rows: (await DB.prepare(`SELECT * FROM exam_questions ORDER BY position`).all()).results }); }
  if ((p === "/academy/questions" || (m = p.match(/^\/academy\/questions\/(Q-[A-Z0-9]{3,6})$/))) && M === "POST") {
    if (!isAdmin) return deny();
    const f = {};
    for (const k of ["q_ja", "q_en", "explain_ja", "explain_en"]) if (k in body) f[k] = str(body[k], 1000);
    for (const k of ["options_ja", "options_en"]) if (k in body) { const a = Array.isArray(body[k]) ? body[k].map((x) => String(x).trim()).filter(Boolean) : null; if (k === "options_ja" && (!a || a.length < 2)) return json({ ok: false, error: "bad_options" }, 400); f[k] = a ? JSON.stringify(a) : null; }
    if ("correct" in body) f.correct = int(body.correct, 0, 9);
    if ("status" in body) f.status = body.status === "inactive" ? "inactive" : "active";
    const t = now();
    if (p === "/academy/questions") {
      if (!f.q_ja || !f.options_ja || f.correct == null) return json({ ok: false, error: "missing_fields" }, 400);
      const id = rid("Q"); const pos = (await DB.prepare(`SELECT COALESCE(MAX(position),0)+1 AS n FROM exam_questions`).first()).n;
      await DB.prepare(`INSERT INTO exam_questions (id,created_at,updated_at,position,q_ja,q_en,options_ja,options_en,correct,explain_ja,explain_en) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(id, t, t, pos, f.q_ja, f.q_en ?? null, f.options_ja, f.options_en ?? null, f.correct, f.explain_ja ?? null, f.explain_en ?? null).run();
      return json({ ok: true, id });
    }
    if (!Object.keys(f).length) return json({ ok: false, error: "nothing_to_update" }, 400);
    await DB.prepare(`UPDATE exam_questions SET ${Object.keys(f).map((k) => k + "=?").join(",")}, updated_at=? WHERE id=?`).bind(...Object.values(f), t, m[1]).run();
    return json({ ok: true });
  }

  // allievi: accesso, link personale, progressi, tentativi
  if (p === "/academy/learners" && M === "GET") {
    if (!isAdmin && !isOp) return deny();
    const pub = (await DB.prepare(`SELECT COUNT(*) AS n FROM lessons WHERE status='published'`).first()).n;
    const q = `SELECT d.id, d.full_name, d.name_latin, d.operator_id, o.name AS operator_name, d.academy_access, d.academy_exam_extra,
      (SELECT COUNT(*) FROM lesson_progress p JOIN lessons l ON l.id=p.lesson_id WHERE p.driver_id=d.id AND l.status='published' AND p.completed_at IS NOT NULL) AS lessons_done,
      (SELECT MAX(updated_at) FROM lesson_progress p WHERE p.driver_id=d.id) AS last_activity,
      (SELECT COUNT(*) FROM exam_attempts a WHERE a.driver_id=d.id AND (a.submitted_at IS NOT NULL OR a.deadline_at<?)) AS attempts,
      (SELECT MAX(score) FROM exam_attempts a WHERE a.driver_id=d.id) AS best_score,
      (SELECT MAX(passed) FROM exam_attempts a WHERE a.driver_id=d.id) AS passed
      FROM drivers d LEFT JOIN operators o ON o.id=d.operator_id ${isAdmin ? "" : "WHERE d.operator_id=? AND d.academy_access=1"} ORDER BY d.academy_access DESC, d.full_name`;
    const rows = (await (isAdmin ? DB.prepare(q).bind(now()) : DB.prepare(q).bind(now(), u.operator_id)).all()).results;
    return json({ ok: true, lessons_published: pub, attempts_included: EXAM.included_attempts, rows });
  }
  if (p === "/academy/access" && M === "POST") {
    if (!isAdmin) return deny();
    const d = await DB.prepare(`SELECT id, full_name FROM drivers WHERE id=?`).bind(str(body.driver_id, 20)).first(); if (!d) return json({ ok: false, error: "not_found" }, 404);
    const t = now();
    if (body.revoke) { await DB.batch([DB.prepare(`UPDATE drivers SET academy_access=0, updated_at=? WHERE id=?`).bind(t, d.id), DB.prepare(`UPDATE academy_keys SET status='revoked' WHERE driver_id=? AND status='active'`).bind(d.id)]); return json({ ok: true }); }
    // un nuovo link annulla quelli vecchi: se un link gira dove non deve, basta rigenerarlo
    const key = tok(24);
    await DB.batch([
      DB.prepare(`UPDATE drivers SET academy_access=1, updated_at=? WHERE id=?`).bind(t, d.id),
      DB.prepare(`UPDATE academy_keys SET status='revoked' WHERE driver_id=? AND status='active'`).bind(d.id),
      DB.prepare(`INSERT INTO academy_keys (id,created_at,driver_id,key_hash) VALUES (?,?,?,?)`).bind(rid("AK"), t, d.id, await sha256(key)),
    ]);
    return json({ ok: true, link: `${env.SITE_URL}/academy/#k=${key}`, warning: "Il link si vede solo adesso: mandalo all'autista (LINE, WhatsApp, email). Generarne uno nuovo annulla il precedente." });
  }
  if (p === "/academy/extra-attempt" && M === "POST") {
    if (!isAdmin) return deny();
    await DB.prepare(`UPDATE drivers SET academy_exam_extra=academy_exam_extra+1, updated_at=? WHERE id=?`).bind(now(), str(body.driver_id, 20)).run();
    return json({ ok: true });
  }
  if ((m = p.match(/^\/academy\/learners\/(DRV-[A-Z0-9]{6})$/)) && M === "GET") {
    const d = await DB.prepare(`SELECT id, operator_id FROM drivers WHERE id=?`).bind(m[1]).first(); if (!d) return json({ ok: false, error: "not_found" }, 404);
    if (!isAdmin && !(isOp && d.operator_id === u.operator_id)) return deny();
    const lessons = (await DB.prepare(`SELECT l.id, l.day, l.title_ja, COALESCE(p.watched_pct,0) AS pct, p.completed_at FROM lessons l LEFT JOIN lesson_progress p ON p.lesson_id=l.id AND p.driver_id=? WHERE l.status='published' ORDER BY l.day, l.position`).bind(d.id).all()).results;
    const attempts = (await DB.prepare(`SELECT started_at, submitted_at, score, passed FROM exam_attempts WHERE driver_id=? ORDER BY started_at`).bind(d.id).all()).results;
    return json({ ok: true, lessons, attempts });
  }
  return null; // non e' una rotta dell'Academy
}
