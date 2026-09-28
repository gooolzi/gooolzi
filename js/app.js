(function () {
  "use strict";

  /* ================= Helpers ================= */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const app = $("#app");

  function esc(s) {
    return String(s)
      .replace(/ ([!?:;])/g, "\u00a0$1")
      .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function dateKey(d) {
    const x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }
  function daysAgo(n) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
  }
  const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  /* ================= Course index ================= */
  const COURSE = window.COURSE;
  const ALL_LESSONS = [];
  const ITEM_BY_FR = {};
  COURSE.forEach(topic => {
    topic.lessons.forEach((lesson, idx) => {
      lesson.topic = topic;
      lesson.index = idx;
      ALL_LESSONS.push(lesson);
      lesson.items.forEach(item => {
        item.topicId = topic.id;
        item.lessonId = lesson.id;
        ITEM_BY_FR[item.fr] = item;
      });
    });
  });
  const ALL_ITEMS = Object.values(ITEM_BY_FR);
  const topicById = id => COURSE.find(t => t.id === id);
  const lessonById = id => ALL_LESSONS.find(l => l.id === id);

  /* ================= State (localStorage) ================= */
  const STORE_KEY = "riviera-francais-v1";
  const DAILY_GOAL_SEC = 5 * 60;
  const defaultState = () => ({
    name: "", onboarded: false, xp: 0,
    streak: 0, bestStreak: 0, lastActive: null,
    days: {}, lessons: {}, words: {}, badges: [], reviews: 0
  });
  let state = defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* Speicher nicht verfügbar – wir lernen trotzdem */ }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
  }

  const isDone = lesson => !!(state.lessons[lesson.id] && state.lessons[lesson.id].done);
  const isUnlocked = lesson => lesson.index === 0 || isDone(lesson.topic.lessons[lesson.index - 1]);
  const nextLesson = () => ALL_LESSONS.find(l => !isDone(l) && isUnlocked(l)) || null;
  const learnedItems = () => ALL_ITEMS.filter(i => state.words[i.fr] && state.words[i.fr].learned);
  const topicDone = t => t.lessons.filter(isDone).length;
  function currentStreak() {
    if (!state.lastActive) return 0;
    const ok = state.lastActive === dateKey() || state.lastActive === dateKey(daysAgo(1));
    return ok ? state.streak : 0;
  }
  function levelInfo() {
    const L = window.LEVELS;
    let idx = 0;
    L.forEach((lv, i) => { if (state.xp >= lv.xp) idx = i; });
    const cur = L[idx], next = L[idx + 1];
    const pct = next ? (state.xp - cur.xp) / (next.xp - cur.xp) : 1;
    return { n: idx + 1, cur, next, pct: Math.max(0, Math.min(1, pct)) };
  }
  function todaySec() { return (state.days[dateKey()] || {}).sec || 0; }
  function wordStrength(fr) {
    const w = state.words[fr];
    if (!w) return 0;
    return Math.max(0, Math.min(4, Math.round(((w.correct || 0) - (w.wrong || 0) * 1.5) / 2) + 1));
  }
  function recordWord(fr, ok) {
    const w = state.words[fr] || (state.words[fr] = { correct: 0, wrong: 0 });
    if (ok) w.correct++; else w.wrong++;
    w.last = Date.now();
  }

  /* ================= Speech ================= */
  let frVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    frVoice = voices.find(v => v.lang === "fr-FR" && /amélie|audrey|marie|google/i.test(v.name))
      || voices.find(v => v.lang === "fr-FR")
      || voices.find(v => /^fr/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  let speechWarned = false;
  function speak(text, slow, btn) {
    if (!("speechSynthesis" in window)) {
      if (!speechWarned) { toast("Dein Browser unterstützt leider keine Sprachausgabe."); speechWarned = true; }
      return;
    }
    const clean = String(text).replace(/…/g, "").replace(/\s*\(.*?\)/g, "").trim();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "fr-FR";
    if (frVoice) u.voice = frVoice;
    u.rate = slow ? 0.6 : 0.9;
    if (btn) {
      btn.classList.add("playing");
      u.onend = u.onerror = () => btn.classList.remove("playing");
    }
    speechSynthesis.speak(u);
  }

  /* ================= UI helpers ================= */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function openModal(html) {
    const m = $("#modal");
    m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true">' + html + "</div>";
    m.hidden = false;
    const f = $("input, button", m);
    if (f) f.focus();
    return m;
  }
  function closeModal() { const m = $("#modal"); m.hidden = true; m.innerHTML = ""; }

  function renderTopStats() {
    const s = currentStreak();
    $("#topStats").innerHTML =
      '<span class="chip flame" title="Tage in Folge">🔥 ' + s + "</span>" +
      '<span class="chip xp" title="Erfahrungspunkte">✦ ' + state.xp + " XP</span>";
  }
  function setNav(name) {
    $$(".nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === name));
  }
  function progressBar(pct, warm) {
    return '<div class="progress' + (warm ? " warm" : "") + '"><span style="width:' + Math.round(pct * 100) + '%"></span></div>';
  }
  function ring(pct, label, sub) {
    const r = 46, c = 2 * Math.PI * r;
    return '<div class="ring"><svg width="108" height="108" viewBox="0 0 108 108">' +
      '<circle class="track" cx="54" cy="54" r="' + r + '" fill="none" stroke-width="10"/>' +
      '<circle class="bar" cx="54" cy="54" r="' + r + '" fill="none" stroke-width="10" stroke-dasharray="' + c.toFixed(1) +
      '" stroke-dashoffset="' + (c * (1 - Math.min(1, pct))).toFixed(1) + '"/></svg>' +
      '<div class="ring-label"><span><b>' + label + "</b><small>" + sub + "</small></span></div></div>";
  }
  function phraseOfDay() {
    const P = window.PHRASES_OF_THE_DAY;
    const start = new Date(2026, 0, 1);
    const n = Math.floor((daysAgo(0) - start) / 86400000);
    return P[((n % P.length) + P.length) % P.length];
  }

  /* ================= Views ================= */
  function viewHome() {
    setNav("home");
    const next = nextLesson();
    const name = state.name ? ", " + esc(state.name) : "";
    const hour = new Date().getHours();
    const hello = hour >= 18 ? "Bonsoir" : "Bonjour";
    const started = Object.keys(state.lessons).length > 0;
    const learned = learnedItems().length;
    const sec = todaySec();
    const mins = Math.floor(sec / 60);
    const streak = currentStreak();
    const phrase = phraseOfDay();

    const headline = started
      ? hello + name + " !<br><em>Prête</em> für deine 5 Minuten?"
      : "Französisch lernen,<br><em>mit Leichtigkeit.</em>";
    const sub = started
      ? (sec >= DAILY_GOAL_SEC ? "Tagesziel erreicht – magnifique! Eine Extra-Runde schadet nie." : "Eine kleine Lektion am Tag – und du verstehst dich bald mühelos im Café, am Bahnhof und in der Boutique.")
      : "Kurze 5-Minuten-Lektionen für echte Alltagssituationen: Café, Reisen, Shopping. Mit Aussprache, spielerischen Übungen und sichtbarem Fortschritt.";

    let streakDays = "";
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const on = !!state.days[dateKey(d)];
      streakDays += '<div class="streak-day' + (on ? " on" : "") + (i === 0 ? " today" : "") + '"><i>' + (on ? "✓" : "") + "</i>" + WEEKDAYS[d.getDay()] + "</div>";
    }

    const cont = next
      ? '<div class="continue"><img src="' + next.topic.image + '" alt=""><div class="grow">' +
        '<span class="eyebrow">' + (started ? "Weiter geht's" : "Deine erste Lektion") + " · " + esc(next.topic.title) + "</span>" +
        "<h3>" + esc(next.title) + '</h3><p class="muted">' + next.items.map(i => esc(i.fr)).slice(0, 4).join(" · ") + " …</p></div>" +
        '<a class="btn btn-accent" href="#/lesson/' + next.id + '">Starten · 5 Min</a></div>'
      : '<div class="continue"><div class="grow"><span class="eyebrow">Félicitations</span><h3>Du hast alle Lektionen abgeschlossen!</h3><p class="muted">Halte dein Französisch mit Wiederholungen frisch.</p></div><a class="btn btn-accent" href="#/review">Wiederholen</a></div>';

    const topics = COURSE.map(t => {
      const done = topicDone(t);
      return '<a class="topic-card" href="#/topic/' + t.id + '"><img src="' + t.image + '" alt="" loading="lazy">' +
        '<div class="topic-body"><span class="fr">' + esc(t.fr) + "</span><h3>" + esc(t.title) + '</h3><p class="muted">' + esc(t.intro) + "</p>" +
        '<div class="topic-meta"><span>' + done + " / " + t.lessons.length + " Lektionen</span><span>" + (done === t.lessons.length ? "✓ Fertig" : t.lessons.length * 6 + " Wörter") + "</span></div>" +
        progressBar(done / t.lessons.length) + "</div></a>";
    }).join("");

    app.innerHTML =
      '<div class="page">' +
      '<section class="hero"><div><span class="eyebrow">Französisch für den Alltag</span><h1>' + headline + "</h1>" +
      '<p class="hero-sub">' + sub + '</p><div class="hero-actions">' +
      (next ? '<a class="btn btn-primary" href="#/lesson/' + next.id + '">' + (started ? "Lektion fortsetzen" : "Jetzt starten") + " →</a>" : "") +
      '<a class="btn btn-ghost" href="' + (learned >= 4 ? "#/review" : "#/topic/basics") + '">' + (learned >= 4 ? "🔁 Wiederholen" : "Kurs ansehen") + "</a></div></div>" +
      '<div class="hero-art"><img src="images/hero.svg" alt="Illustration einer Küstenstadt an der Riviera">' +
      '<div class="hero-badge"><span style="font-size:1.8rem">🌊</span><div><div class="big">' + learned + '</div><small>Wörter gelernt</small></div></div></div></section>' +

      '<section class="section">' + cont + "</section>" +

      '<section class="section today-grid">' +
      '<div class="card goal">' + ring(sec / DAILY_GOAL_SEC, mins + "/5", "Minuten") +
      '<div><span class="eyebrow">Tagesziel</span><h3>' + (sec >= DAILY_GOAL_SEC ? "Geschafft! 🎉" : "5 Minuten Französisch") + '</h3><p class="muted">' +
      (sec >= DAILY_GOAL_SEC ? "Du hast dein Ziel für heute erreicht." : "Eine Lektion reicht, um dein Tagesziel zu erreichen.") + "</p></div></div>" +
      '<div class="card"><span class="eyebrow">Serie</span><h3>🔥 ' + streak + (streak === 1 ? " Tag" : " Tage") + ' in Folge</h3><p class="muted">' +
      (streak ? "Bleib dran – jeder Tag zählt!" : "Starte heute deine Serie.") + '</p><div class="streak-days">' + streakDays + "</div></div>" +
      '<div class="card phrase"><span class="eyebrow">Phrase du jour</span><p class="fr-big">' + esc(phrase.fr) + '</p><p class="de">' + esc(phrase.de) + "</p>" +
      '<button class="icon-btn" data-speak="' + esc(phrase.fr) + '" aria-label="Anhören">🔊</button></div>' +
      "</section>" +

      '<section class="section"><div class="section-head"><div><span class="eyebrow">Themen</span><h2>Was möchtest du heute lernen?</h2></div>' +
      '<p class="muted">Jedes Thema hat drei kurze Lektionen mit Wörtern und Sätzen, die du wirklich brauchst.</p></div>' +
      '<div class="grid topics">' + topics + "</div></section>" +
      '</div><footer class="footer">Fait avec amour · <span class="fr">Riviera français</span> · Dein Fortschritt wird nur auf diesem Gerät gespeichert.</footer>';

    if (!state.onboarded) showOnboarding();
  }

  function showOnboarding() {
    openModal(
      '<img src="images/hero.svg" alt="">' +
      '<span class="eyebrow">Bienvenue</span><h2>Schön, dass du da bist!</h2>' +
      '<p class="muted" style="margin-top:8px">Wie dürfen wir dich nennen?</p>' +
      '<input class="search" id="nameInput" maxlength="30" placeholder="Dein Vorname" autocomplete="given-name">' +
      '<button class="btn btn-primary btn-block" id="nameSave">C\'est parti !</button>'
    );
    const done = () => {
      state.name = $("#nameInput").value.trim();
      state.onboarded = true;
      save();
      closeModal();
      viewHome();
    };
    $("#nameSave").onclick = done;
    $("#nameInput").onkeydown = e => { if (e.key === "Enter") done(); };
  }

  function viewTopic(id) {
    setNav("home");
    const t = topicById(id);
    if (!t) return viewHome();
    const done = topicDone(t);
    const rows = t.lessons.map((l, i) => {
      const d = isDone(l), u = isUnlocked(l);
      const cur = !d && u;
      const best = d ? state.lessons[l.id].best : null;
      const cls = d ? "done" : cur ? "current" : "locked";
      const btn = d
        ? '<a class="btn btn-ghost" href="#/lesson/' + l.id + '">Nochmal</a>'
        : cur ? '<a class="btn btn-accent" href="#/lesson/' + l.id + '">Starten</a>'
          : '<button class="btn btn-ghost" disabled>🔒</button>';
      return '<div class="lesson-row ' + cls + '"><div class="lesson-num">' + (d ? "✓" : i + 1) + '</div><div class="grow"><h3>' + esc(l.title) + "</h3>" +
        '<p class="words">' + l.items.map(x => x.emoji + " " + esc(x.fr)).join(" · ") + "</p>" +
        (best != null ? '<small class="muted">Bestes Ergebnis: ' + best + "%</small>" : "") + "</div>" + btn + "</div>";
    }).join("");
    const tipLesson = t.lessons.find(l => !isDone(l)) || t.lessons[0];

    app.innerHTML =
      '<div class="page"><a class="back" href="#/">← Zurück</a>' +
      '<section class="topic-hero"><div><span class="eyebrow">' + esc(t.fr) + "</span><h1>" + esc(t.title) + "</h1>" +
      '<p class="hero-sub">' + esc(t.intro) + "</p>" + progressBar(done / t.lessons.length) +
      '<p class="muted" style="margin-top:8px">' + done + " von " + t.lessons.length + " Lektionen abgeschlossen</p></div>" +
      '<img src="' + t.image + '" alt=""></section>' +
      '<div class="lesson-list">' + rows + "</div>" +
      '<div class="section tip"><span style="font-size:1.6rem">💡</span><div><b>Wusstest du?</b>' + esc(tipLesson.tip) + "</div></div>" +
      "</div>";
  }

  function viewWords() {
    setNav("words");
    const learned = learnedItems();
    if (!learned.length) {
      app.innerHTML = '<div class="page"><div class="card empty"><div class="big">📖</div><h2>Dein Wortschatz wartet</h2>' +
        '<p class="muted" style="margin:10px 0 22px">Hier sammeln sich alle Wörter, die du gelernt hast – zum Nachschlagen und Anhören.</p>' +
        '<a class="btn btn-primary" href="#/">Erste Lektion starten</a></div></div>';
      return;
    }
    app.innerHTML =
      '<div class="page"><div class="section-head"><div><span class="eyebrow">Mon vocabulaire</span><h1>Wortschatz</h1>' +
      '<p class="muted" style="margin-top:8px">' + learned.length + " Wörter & Ausdrücke · tippe auf 🔊 zum Anhören</p></div>" +
      '<input class="search" id="wordSearch" type="search" placeholder="Suchen … (Deutsch oder Französisch)"></div>' +
      '<div id="wordGroups"></div></div>';
    const draw = q => {
      q = (q || "").toLowerCase().trim();
      const html = COURSE.map(t => {
        const list = learned.filter(i => i.topicId === t.id && (!q || i.fr.toLowerCase().includes(q) || i.de.toLowerCase().includes(q)));
        if (!list.length) return "";
        return '<div class="word-group"><h3>' + esc(t.title) + '</h3><div class="word-list">' + list.map(i => {
          const s = wordStrength(i.fr);
          let bars = "";
          for (let k = 0; k < 4; k++) bars += "<i" + (k < s ? ' class="on"' : "") + "></i>";
          return '<div class="word-row"><span class="emoji">' + i.emoji + '</span><div class="grow"><span class="fr">' + esc(i.fr) + "</span><small>" + esc(i.de) + " · " + esc(i.pron) + "</small></div>" +
            '<span class="strength" title="Wie sicher du das Wort kannst">' + bars + "</span>" +
            '<button class="icon-btn" data-speak="' + esc(i.fr) + '" aria-label="' + esc(i.fr) + ' anhören">🔊</button></div>';
        }).join("") + "</div></div>";
      }).join("");
      $("#wordGroups").innerHTML = html || '<p class="muted" style="margin-top:24px">Nichts gefunden.</p>';
    };
    draw("");
    $("#wordSearch").oninput = e => draw(e.target.value);
  }

  function viewProgress() {
    setNav("progress");
    const lv = levelInfo();
    const learned = learnedItems().length;
    const lessonsDone = ALL_LESSONS.filter(isDone).length;
    const totalMin = Math.round(Object.values(state.days).reduce((a, d) => a + (d.sec || 0), 0) / 60);

    let maxSec = DAILY_GOAL_SEC;
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const sec = (state.days[dateKey(d)] || {}).sec || 0;
      maxSec = Math.max(maxSec, sec);
      week.push({ d, sec, today: i === 0 });
    }
    const chart = week.map(w =>
      '<div class="col' + (w.today ? " today" : w.sec >= DAILY_GOAL_SEC ? " hit" : "") + '"><span class="val">' + (w.sec ? Math.max(1, Math.round(w.sec / 60)) + "′" : "") + "</span>" +
      '<div class="bar" style="height:' + Math.round((w.sec / maxSec) * 100) + '%"></div><small>' + WEEKDAYS[w.d.getDay()] + "</small></div>").join("");

    const badges = window.BADGES.map(b => {
      const has = state.badges.includes(b.id);
      return '<div class="badge' + (has ? "" : " locked") + '"><span class="b-ico">' + b.icon + "</span><b>" + esc(b.title) + "</b><small>" + esc(b.desc) + "</small></div>";
    }).join("");

    const topics = COURSE.map(t => {
      const d = topicDone(t);
      return '<div style="margin-top:16px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><b>' + esc(t.title) + '</b><span class="muted">' + d + "/" + t.lessons.length + "</span></div>" + progressBar(d / t.lessons.length, true) + "</div>";
    }).join("");

    app.innerHTML =
      '<div class="page"><span class="eyebrow">Mes progrès</span><h1>Dein Fortschritt</h1>' +
      '<div class="card level-card section" style="margin-top:24px"><div class="level-medal">' + lv.n + "</div><div>" +
      '<span class="eyebrow">Level ' + lv.n + '</span><h2 class="fr">' + esc(lv.cur.name) + '</h2><p class="muted" style="margin:4px 0 12px">' + esc(lv.cur.de) +
      (lv.next ? " · noch " + (lv.next.xp - state.xp) + " XP bis <b>" + esc(lv.next.name) + "</b>" : " · Höchstes Level erreicht!") + "</p>" + progressBar(lv.pct, true) + "</div></div>" +

      '<div class="card section stats-row">' +
      '<div class="stat"><b>' + learned + "</b><small>Wörter gelernt</small></div>" +
      '<div class="stat"><b>' + lessonsDone + "/" + ALL_LESSONS.length + "</b><small>Lektionen</small></div>" +
      '<div class="stat"><b>🔥 ' + currentStreak() + "</b><small>Serie (Rekord: " + state.bestStreak + ")</small></div>" +
      '<div class="stat"><b>' + totalMin + "′</b><small>Minuten insgesamt</small></div></div>" +

      '<div class="grid section" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">' +
      '<div class="card"><span class="eyebrow">Diese Woche</span><h3>Minuten pro Tag</h3><div class="chart">' + chart + "</div></div>" +
      '<div class="card"><span class="eyebrow">Themen</span><h3>Kursfortschritt</h3>' + topics + "</div></div>" +

      '<section class="section"><div class="section-head"><div><span class="eyebrow">Récompenses</span><h2>Abzeichen</h2></div>' +
      '<p class="muted">' + state.badges.length + " von " + window.BADGES.length + " gesammelt</p></div>" +
      '<div class="grid badges">' + badges + "</div></section>" +
      '<p style="margin-top:40px;text-align:center"><button class="btn btn-ghost" id="resetBtn">Fortschritt zurücksetzen</button></p></div>';

    $("#resetBtn").onclick = () => {
      openModal('<h2>Wirklich neu starten?</h2><p class="muted" style="margin:10px 0 22px">Alle Lektionen, XP und Abzeichen werden gelöscht.</p>' +
        '<div class="result-actions"><button class="btn btn-accent" id="resetYes">Ja, zurücksetzen</button><button class="btn btn-ghost" id="resetNo">Abbrechen</button></div>');
      $("#resetNo").onclick = closeModal;
      $("#resetYes").onclick = () => {
        state = defaultState(); save(); closeModal(); location.hash = "#/";
      };
    };
  }

  /* ================= Lesson / Review player ================= */
  let P = null;

  function optionPool(item, field) {
    const same = shuffle(ALL_ITEMS.filter(i => i.topicId === item.topicId && i[field] !== item[field]));
    const rest = shuffle(ALL_ITEMS.filter(i => i.topicId !== item.topicId && i[field] !== item[field]));
    const seen = new Set([item[field]]);
    const out = [];
    for (const i of same.concat(rest)) {
      if (!seen.has(i[field])) { seen.add(i[field]); out.push(i[field]); }
      if (out.length === 3) break;
    }
    return shuffle(out.concat(item[field]));
  }
  const tokenize = s => s.replace(/[.,!?…]/g, " ").split(/\s+/).filter(Boolean);

  function buildLessonSteps(lesson) {
    const types = ["mc-fr", "listen", "mc-de"];
    const steps = [];
    const halves = [lesson.items.slice(0, 3), lesson.items.slice(3)];
    let t = 0;
    halves.forEach(half => {
      half.forEach(item => steps.push({ type: "learn", item }));
      shuffle(half).forEach(item => steps.push({ type: types[t++ % 3], item }));
    });
    steps.push({ type: "match", items: shuffle(lesson.items).slice(0, 4) });
    lesson.sentences.forEach(s => steps.push({ type: "build", sentence: s, pool: lesson.items }));
    return steps;
  }

  function buildReviewSteps() {
    const learned = learnedItems();
    const scored = learned.map(i => {
      const w = state.words[i.fr] || {};
      const age = (Date.now() - (w.last || 0)) / 86400000;
      return { i, score: (w.wrong || 0) * 3 - (w.correct || 0) + Math.min(age, 10) + Math.random() * 2 };
    }).sort((a, b) => b.score - a.score);
    const pick = scored.slice(0, 8).map(x => x.i);
    const types = ["mc-fr", "listen", "mc-de"];
    const steps = shuffle(pick).map((item, k) => ({ type: types[k % 3], item }));
    steps.splice(4, 0, { type: "match", items: shuffle(pick).slice(0, 4) });
    const doneLessons = ALL_LESSONS.filter(isDone);
    if (doneLessons.length) {
      const l = doneLessons[Math.floor(Math.random() * doneLessons.length)];
      steps.push({ type: "build", sentence: l.sentences[Math.floor(Math.random() * l.sentences.length)], pool: l.items });
    }
    return steps;
  }

  function startPlayer(mode, lesson) {
    document.body.classList.add("in-lesson");
    P = {
      mode, lesson,
      steps: mode === "review" ? buildReviewSteps() : buildLessonSteps(lesson),
      i: 0, graded: 0, firstOk: 0, start: Date.now(), answered: false
    };
    renderStep();
  }

  function playerShell(inner, foot) {
    const pct = P.i / P.steps.length;
    app.innerHTML =
      '<div class="lesson"><div class="lesson-top"><button class="close-btn" id="quitBtn" aria-label="Lektion beenden">✕</button>' +
      progressBar(pct) + "</div>" +
      '<div class="stage">' + inner + '</div><div class="lesson-foot" id="foot">' + (foot || "") + "</div></div>";
    $("#quitBtn").onclick = confirmQuit;
  }

  function confirmQuit() {
    openModal('<div style="font-size:3rem">🌊</div><h2>Schon aufhören?</h2><p class="muted" style="margin:10px 0 22px">Nur noch ein paar Schritte – du machst das toll! Wenn du jetzt gehst, wird diese Lektion nicht gespeichert.</p>' +
      '<div class="result-actions"><button class="btn btn-primary" id="stay">Weiterlernen</button><button class="btn btn-ghost" id="leave">Beenden</button></div>');
    $("#stay").onclick = closeModal;
    $("#leave").onclick = () => { closeModal(); P = null; location.hash = "#/"; };
  }

  const continueBtn = (label, cls) => '<button class="btn ' + (cls || "btn-primary") + ' btn-block" id="nextBtn">' + (label || "Weiter") + "</button>";
  function bindNext() { const b = $("#nextBtn"); if (b) b.onclick = advance; }

  function renderStep() {
    if (P.i >= P.steps.length) return finishPlayer();
    P.answered = false;
    const step = P.steps[P.i];
    ({ learn: stepLearn, "mc-fr": stepChoice, "mc-de": stepChoice, listen: stepChoice, match: stepMatch, build: stepBuild })[step.type](step);
  }

  function advance() {
    P.i++;
    renderStep();
  }

  function stepLearn(step) {
    const it = step.item;
    playerShell(
      '<p class="stage-kicker eyebrow">Neues Wort</p>' +
      '<div class="flashcard"><div class="flash-emoji">' + it.emoji + '</div><div class="flash-fr">' + esc(it.fr) + "</div>" +
      '<div class="flash-pron">' + esc(it.pron) + '</div><div class="flash-de">' + esc(it.de) + "</div>" +
      '<div class="flash-audio"><button class="icon-btn lg" id="say" aria-label="Anhören">🔊</button><button class="icon-btn lg" id="saySlow" aria-label="Langsam anhören">🐢</button></div></div>',
      continueBtn("Verstanden")
    );
    $("#say").onclick = e => speak(it.fr, false, e.currentTarget);
    $("#saySlow").onclick = e => speak(it.fr, true, e.currentTarget);
    bindNext();
    setTimeout(() => P && speak(it.fr, false, $("#say")), 350);
  }

  function stepChoice(step) {
    const it = step.item;
    let prompt, field, title;
    if (step.type === "mc-fr") {
      title = "Was bedeutet das?";
      field = "de";
      prompt = '<div class="prompt"><button class="icon-btn" id="say" aria-label="Anhören">🔊</button><span class="fr-big">' + esc(it.fr) + "</span></div>";
    } else if (step.type === "mc-de") {
      title = "Wie sagt man das auf Französisch?";
      field = "fr";
      prompt = '<div class="prompt"><span class="emoji">' + it.emoji + '</span><span class="de-big">' + esc(it.de) + "</span></div>";
    } else {
      title = "Was hörst du?";
      field = "fr";
      prompt = '<div class="prompt"><button class="icon-btn lg" id="say" aria-label="Anhören">🔊</button><button class="icon-btn" id="saySlow" aria-label="Langsam anhören">🐢</button></div>';
    }
    const opts = optionPool(it, field);
    playerShell(
      '<h2 class="stage-title">' + title + "</h2>" + prompt +
      '<div class="options">' + opts.map((o, k) => '<button class="option' + (field === "fr" ? " is-fr" : "") + '" data-k="' + k + '">' + esc(o) + "</button>").join("") + "</div>"
    );
    const say = $("#say"), slow = $("#saySlow");
    if (say) { say.onclick = e => speak(it.fr, false, e.currentTarget); setTimeout(() => P && speak(it.fr, false, say), 300); }
    if (slow) slow.onclick = e => speak(it.fr, true, e.currentTarget);
    $$(".option").forEach(btn => {
      btn.onclick = () => {
        if (P.answered) return;
        const ok = opts[+btn.dataset.k] === it[field];
        $$(".option").forEach(b => {
          b.disabled = true;
          if (opts[+b.dataset.k] === it[field]) b.classList.add("correct");
        });
        if (!ok) btn.classList.add("wrong");
        recordWord(it.fr, ok);
        if (step.type !== "mc-fr") speak(it.fr);
        grade(step, ok, it.fr + " = " + it.de);
      };
    });
  }

  function stepMatch(step) {
    const items = step.items;
    const left = shuffle(items), right = shuffle(items);
    let selL = null, selR = null, found = 0, mistakes = 0;
    playerShell(
      '<h2 class="stage-title">Finde die Paare</h2><div class="match">' +
      '<div class="match-col">' + left.map((it, k) => '<button class="option is-fr" data-side="l" data-k="' + k + '">' + esc(it.fr) + "</button>").join("") + "</div>" +
      '<div class="match-col">' + right.map((it, k) => '<button class="option" data-side="r" data-k="' + k + '">' + esc(it.de) + "</button>").join("") + "</div></div>"
    );
    const check = () => {
      if (!selL || !selR) return;
      const a = left[+selL.dataset.k], b = right[+selR.dataset.k];
      const bl = selL, br = selR;
      selL = selR = null;
      if (a === b) {
        [bl, br].forEach(x => { x.classList.remove("selected"); x.classList.add("done"); x.disabled = true; });
        recordWord(a.fr, true);
        speak(a.fr);
        if (++found === items.length) grade(step, mistakes === 0, null, true);
      } else {
        mistakes++;
        recordWord(a.fr, false);
        [bl, br].forEach(x => { x.classList.remove("selected"); x.classList.add("wrong"); });
        setTimeout(() => [bl, br].forEach(x => x.classList.remove("wrong")), 450);
      }
    };
    $$(".match .option").forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.side === "l") {
          if (selL) selL.classList.remove("selected");
          selL = btn;
          speak(left[+btn.dataset.k].fr);
        } else {
          if (selR) selR.classList.remove("selected");
          selR = btn;
        }
        btn.classList.add("selected");
        check();
      };
    });
  }

  function stepBuild(step) {
    const s = step.sentence;
    const target = tokenize(s.fr);
    const lower = new Set(target.map(w => w.toLowerCase()));
    const extra = shuffle(Array.from(new Set(step.pool.flatMap(i => tokenize(i.fr)))))
      .filter(w => !lower.has(w.toLowerCase())).slice(0, 3);
    const bank = shuffle(target.concat(extra)).map((w, id) => ({ w, id }));
    const answer = [];
    playerShell(
      '<h2 class="stage-title">Bilde den Satz</h2>' +
      '<div class="prompt"><span class="emoji">💬</span><span class="de-big">' + esc(s.de) + "</span></div>" +
      '<div class="build-answer" id="answer" aria-label="Deine Antwort"></div><div class="build-bank" id="bank">' +
      bank.map(b => '<button class="word-chip" data-id="' + b.id + '">' + esc(b.w) + "</button>").join("") + "</div>",
      '<button class="btn btn-primary btn-block" id="checkBtn" disabled>Prüfen</button>'
    );
    const drawAnswer = () => {
      $("#answer").innerHTML = answer.map((id, pos) => '<button class="word-chip" data-pos="' + pos + '">' + esc(bank[id].w) + "</button>").join("");
      $$("#answer .word-chip").forEach(c => c.onclick = () => {
        if (P.answered) return;
        const id = answer.splice(+c.dataset.pos, 1)[0];
        $('#bank [data-id="' + id + '"]').classList.remove("used");
        drawAnswer();
      });
      $("#checkBtn").disabled = !answer.length;
    };
    $$("#bank .word-chip").forEach(c => c.onclick = () => {
      if (P.answered) return;
      answer.push(+c.dataset.id);
      c.classList.add("used");
      speak(bank[+c.dataset.id].w);
      drawAnswer();
    });
    $("#checkBtn").onclick = () => {
      const built = answer.map(id => bank[id].w).join(" ").toLowerCase();
      const ok = built === target.join(" ").toLowerCase();
      speak(s.fr);
      grade(step, ok, s.fr);
    };
  }

  const PRAISE = ["Très bien !", "Parfait !", "Magnifique !", "Bravo !", "Super !", "Excellent !", "C'est ça !"];
  const COMFORT = ["Presque !", "Pas grave !", "Beinahe!"];

  function grade(step, ok, answerText, isMatch) {
    P.answered = true;
    if (!step.retry) {
      P.graded++;
      if (ok) P.firstOk++;
    }
    if (!ok && !isMatch && (step.retry || 0) < 2) {
      P.steps.push(Object.assign({}, step, { retry: (step.retry || 0) + 1 }));
    }
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    let fb;
    if (ok) {
      fb = '<div class="feedback ok"><span class="fb-ico">✨</span><div><b>' + pick(PRAISE) + "</b>" +
        (isMatch ? "Alle Paare gefunden." : "") + "</div></div>";
    } else if (isMatch) {
      fb = '<div class="feedback ok"><span class="fb-ico">🌿</span><div><b>Geschafft!</b>Alle Paare gefunden – mit ein paar Umwegen.</div></div>';
    } else {
      fb = '<div class="feedback bad"><span class="fb-ico">💫</span><div><b>' + pick(COMFORT) + "</b>Richtig ist: <span class=\"answer\">" + esc(answerText) + "</span><br><small>Wir üben das gleich nochmal.</small></div></div>";
    }
    $("#foot").innerHTML = fb + continueBtn("Weiter", ok || isMatch ? "btn-primary" : "btn-accent");
    bindNext();
    $("#nextBtn").focus({ preventScroll: true });
  }

  function awardBadge(id, list) {
    if (!state.badges.includes(id)) { state.badges.push(id); list.push(id); }
  }

  function finishPlayer() {
    const sec = Math.min(Math.round((Date.now() - P.start) / 1000), 15 * 60);
    const acc = P.graded ? Math.round((P.firstOk / P.graded) * 100) : 100;
    const perfect = acc === 100;
    const isReview = P.mode === "review";
    const xp = (isReview ? 5 : 10) + P.firstOk * 2 + (perfect ? 5 : 0);
    const prevLevel = levelInfo().n;
    const hadGoal = todaySec() >= DAILY_GOAL_SEC;

    const today = dateKey();
    const day = state.days[today] || (state.days[today] = { xp: 0, sec: 0 });
    day.xp += xp;
    day.sec += sec;
    state.xp += xp;
    if (state.lastActive !== today) {
      state.streak = state.lastActive === dateKey(daysAgo(1)) ? state.streak + 1 : 1;
      state.lastActive = today;
    }
    state.bestStreak = Math.max(state.bestStreak, state.streak);

    const lesson = P.lesson;
    if (isReview) {
      state.reviews++;
    } else {
      const rec = state.lessons[lesson.id] || { done: false, best: 0, times: 0 };
      rec.done = true;
      rec.times++;
      rec.best = Math.max(rec.best, acc);
      state.lessons[lesson.id] = rec;
      lesson.items.forEach(i => {
        const w = state.words[i.fr] || (state.words[i.fr] = { correct: 0, wrong: 0 });
        w.learned = true;
      });
    }

    const newBadges = [];
    if (ALL_LESSONS.some(isDone)) awardBadge("first", newBadges);
    if (perfect && P.graded > 0) awardBadge("perfect", newBadges);
    if (state.streak >= 3) awardBadge("streak3", newBadges);
    if (state.streak >= 7) awardBadge("streak7", newBadges);
    const nWords = learnedItems().length;
    if (nWords >= 25) awardBadge("words25", newBadges);
    if (nWords >= 50) awardBadge("words50", newBadges);
    if (COURSE.some(t => topicDone(t) === t.lessons.length)) awardBadge("topic", newBadges);
    if (state.reviews >= 3) awardBadge("review", newBadges);
    if (ALL_LESSONS.every(isDone)) awardBadge("all", newBadges);
    save();
    renderTopStats();

    const levelUp = levelInfo().n > prevLevel;
    const goalNow = !hadGoal && todaySec() >= DAILY_GOAL_SEC;
    const next = nextLesson();
    const emoji = perfect ? "💎" : acc >= 70 ? "🌟" : "🌱";
    const head = perfect ? "Parfait !" : acc >= 70 ? "Très bien !" : "Bien joué !";
    const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, "0");

    const extras =
      (levelUp ? '<div class="new-badge"><span>🎖️</span><div><b>Level up!</b><br>Du bist jetzt <span class="fr">' + esc(levelInfo().cur.name) + "</span></div></div>" : "") +
      (goalNow ? '<div class="new-badge"><span>🎯</span><div><b>Tagesziel erreicht!</b><br>5 Minuten Französisch – bravo.</div></div>' : "") +
      newBadges.map(id => {
        const b = window.BADGES.find(x => x.id === id);
        return '<div class="new-badge"><span>' + b.icon + '</span><div><b>Neues Abzeichen: ' + esc(b.title) + "</b><br>" + esc(b.desc) + "</div></div>";
      }).join("");

    const tip = !isReview ? '<div class="tip" style="text-align:left;margin-bottom:24px"><span style="font-size:1.6rem">💡</span><div><b>Wusstest du?</b>' + esc(lesson.tip) + "</div></div>" : "";
    const actions = (next ? '<a class="btn btn-accent btn-block" href="#/lesson/' + next.id + '">Nächste Lektion: ' + esc(next.title) + "</a>" : "") +
      '<a class="btn btn-ghost btn-block" href="#/">Zur Übersicht</a>';

    P = null;
    document.body.classList.remove("in-lesson");
    app.innerHTML =
      '<div class="page result"><div class="result-emoji">' + emoji + "</div><h1>" + head + "</h1>" +
      '<p class="muted" style="margin-top:8px">' + (isReview ? "Wiederholung abgeschlossen." : "Lektion „" + esc(lesson.title) + "“ abgeschlossen.") + "</p>" +
      '<div class="result-stats"><div class="result-stat"><b>+' + xp + "</b><small>XP</small></div>" +
      '<div class="result-stat"><b>' + acc + "%</b><small>Treffer</small></div>" +
      '<div class="result-stat"><b>' + mm + ":" + ss + "</b><small>Minuten</small></div></div>" +
      extras + tip + '<div class="result-actions">' + actions + "</div></div>";
    confetti(perfect || levelUp || newBadges.length ? 180 : 110);
  }

  function viewLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) return viewHome();
    if (!isUnlocked(lesson)) {
      toast("Schließe zuerst die vorherige Lektion ab.");
      location.hash = "#/topic/" + lesson.topic.id;
      return;
    }
    startPlayer("lesson", lesson);
  }

  function viewReview() {
    setNav("review");
    const learned = learnedItems();
    if (learned.length < 4) {
      app.innerHTML = '<div class="page"><div class="card empty"><div class="big">🔁</div><h2>Bald geht\'s los</h2>' +
        '<p class="muted" style="margin:10px 0 22px">Schließe deine erste Lektion ab – dann kannst du hier gezielt die Wörter wiederholen, die dir noch schwerfallen.</p>' +
        '<a class="btn btn-primary" href="#/">Zur ersten Lektion</a></div></div>';
      return;
    }
    const weak = learned.filter(i => wordStrength(i.fr) <= 1).length;
    app.innerHTML =
      '<div class="page"><section class="topic-hero"><div><span class="eyebrow">Révision</span><h1>Wiederholen & festigen</h1>' +
      '<p class="hero-sub">Eine schnelle Runde mit ' + Math.min(8, learned.length) + " Wörtern. Wir wählen automatisch die, die du länger nicht geübt hast oder die dir noch schwerfallen.</p>" +
      '<div class="hero-actions"><button class="btn btn-accent" id="startReview">Wiederholung starten · 3 Min</button></div>' +
      '<p class="muted" style="margin-top:14px">' + learned.length + " Wörter gelernt · " + weak + " brauchen noch Übung</p></div>" +
      '<img src="images/hero.svg" alt=""></section></div>';
    $("#startReview").onclick = () => startPlayer("review", null);
  }

  /* ================= Confetti ================= */
  let confettiRun = 0;
  function confetti(n) {
    const run = ++confettiRun;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#1f4e79", "#3a7ca5", "#d9734e", "#d9a441", "#f2d4c8", "#8a9a5b"];
    const parts = Array.from({ length: n }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35,
      vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4,
      r: Math.random() * 6 + 4, a: Math.random() * Math.PI, va: (Math.random() - .5) * .3,
      c: colors[Math.floor(Math.random() * colors.length)], round: Math.random() < .3
    }));
    const t0 = performance.now();
    (function frame(t) {
      const el = t - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => {
        p.vy += .28; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - el / 2800);
        ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      });
      if (el < 2800 && run === confettiRun) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(t0);
  }

  /* ================= Global events ================= */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-speak]");
    if (b) speak(b.dataset.speak, false, b);
  });
  document.addEventListener("keydown", e => {
    if (!P || !$("#modal").hidden) return;
    if (e.key === "Enter") {
      const b = $("#nextBtn") || $("#checkBtn");
      if (b && !b.disabled && document.activeElement !== b) { e.preventDefault(); b.click(); }
    } else if (/^[1-4]$/.test(e.key) && !P.answered) {
      const opts = $$(".options .option");
      const o = opts[+e.key - 1];
      if (o) o.click();
    }
  });

  /* ================= Router ================= */
  function route() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    P = null;
    confettiRun++;
    document.body.classList.remove("in-lesson");
    closeModal();
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    const [name, arg] = parts;
    renderTopStats();
    if (name === "topic") viewTopic(arg);
    else if (name === "lesson") viewLesson(arg);
    else if (name === "review") viewReview();
    else if (name === "words") viewWords();
    else if (name === "progress") viewProgress();
    else viewHome();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  route();
})();
