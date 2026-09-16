/* SATURN — Startup School 001 application.
   One question per view, answers kept in localStorage so a founder can
   leave and come back, submitted as JSON to Formspree. */
(function () {
  "use strict";

  var KEY = "saturn-school-001";
  var ENDPOINT = "https://formspree.io/f/xwvrdawj";
  var NOTIFY = "radiyya@saturn.africa";
  var REF_DATE = new Date(2027, 0, 1); /* the age gate is measured on this day */

  /* ---------- the flow ---------- */
  function hasCofounders(a) { return a.team_shape === "With one cofounder" || a.team_shape === "With two or more cofounders"; }

  var STEPS = [
    { kind: "welcome", h: "Apply for Saturn Startup School",
      body: ["Cohort 001 begins January 2027.",
             "This is an application to the school. It is not an application for a grant.",
             "The school is six months, online, weekly. Sessions cover the business and the person running it. At demo day, three to five founders per cohort receive a R100,000 grant. Everyone who finishes receives twelve months of mentorship.",
             "About 15 minutes. You can finish on a phone."],
      btn: "Start" },

    { kind: "statement", h: "First, four questions.", body: ["If the school is not a fit, we will stop here so you do not spend the time."] },

    { id: "age_ok", gate: true, kind: "yesno", h: "Are you between 18 and 35 years old?", help: "You must be 18 or older, and 35 or younger, on 1 January 2027.", req: true, noEnds: "B" },
    { id: "sa_ok", gate: true, kind: "yesno", h: "Do you live in South Africa, and are you a South African citizen or permanent resident?", help: "The 2027 school is for founders based in South Africa.", req: true, noEnds: "B" },
    { id: "exists_ok", gate: true, kind: "yesno", h: "Do you already have a product, service or shop in the world?", help: "Not a plan. Not a pitch deck. Something a customer can already buy or use.", req: true, noEnds: "B" },
    { id: "traction_ok", gate: true, kind: "yesno", h: "Do you already have early users, or early revenue?", help: "Either is enough. Both is fine. An idea with neither is not a fit for this cohort.", req: true, noEnds: "B" },

    { kind: "statement", h: "You.", body: ["How we reach you, and where you work from."] },

    { id: "full_name", kind: "text", h: "Full name", help: "The name you use. This is the name on the seat.", ph: "First name and surname", max: 80, req: true },
    { id: "email", kind: "email", h: "Email", help: "We will write here if we want a conversation.", ph: "you@example.com", req: true },
    { id: "whatsapp", kind: "tel", h: "WhatsApp number", help: "This is how the school will reach you. Use the number you live on.", ph: "082 000 0000", req: true },
    { id: "city", kind: "text", h: "City or town", ph: "e.g. Gqeberha", max: 60, req: true },
    { id: "province", kind: "select", h: "Province", req: true,
      opts: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"] },
    { id: "date_of_birth", kind: "date", h: "Date of birth", help: "Confirms the age gate.", req: true },
    { id: "gender", kind: "choice", h: "Gender", help: "Used for reporting. Not used to select the cohort.", req: true,
      opts: ["Woman", "Man", "Nonbinary", "Prefer not to say"] },
    { id: "heard_from", kind: "select", h: "How did you hear about Saturn Startup School?", req: true,
      opts: ["Instagram", "TikTok", "LinkedIn", "A friend or another founder", "University", "Saturn website", "Other"] },

    { kind: "statement", h: "The business.", body: ["Short answers. Specific is better than polished. One example runs through the next screens: Slip, an invoicing app for sole traders."] },

    { id: "business_name", kind: "text", h: "What is the business called?", help: "Trading name is fine if you are not registered yet. Example: Slip.", ph: "Slip", max: 80, req: true },
    { id: "one_sentence", kind: "textarea", h: "In one sentence, what does the business do?", help: "Write it so a stranger understands. Example: I built an app that turns a WhatsApp quote into an invoice a client can pay.", ph: "I built an app that turns a WhatsApp quote into an invoice a client can pay.", max: 140, req: true },
    { id: "who_uses", kind: "textarea", h: "Who pays you, or who uses it?", help: "A person or a kind of customer. Not “the market”. Example: Plumbers, tutors and makeup artists in Gauteng who still chase payment over WhatsApp.", ph: "Plumbers, tutors and makeup artists in Gauteng who still chase payment over WhatsApp.", max: 280, req: true },
    { id: "how_they_use_and_pay", kind: "textarea", h: "How does a customer use it, and what do they pay?", help: "One pass through the product, then the price. Example: They turn a WhatsApp quote into a payment link. Three invoices are free. Then R249 a month.", ph: "They turn a WhatsApp quote into a payment link. Three invoices are free. Then R249 a month.", max: 280, req: true },
    { id: "first_use_or_pay", kind: "text", h: "When did someone first use it, or first pay?", help: "Month and year. Not when you had the idea. Example: August 2025.", ph: "August 2025", max: 40, req: true },
    { id: "stage", kind: "choice", h: "Which is true today?", help: "Slip would choose “I have both users and paying customers”.", req: true,
      opts: ["I have paying customers", "I have users, not yet paying", "I have both users and paying customers"] },
    { id: "paying_customers_30d", kind: "number", h: "Roughly how many paying customers in the last 30 days?", help: "Zero is an honest answer. Example: 19.", req: true },
    { id: "active_users_30d", kind: "number", h: "Roughly how many people used it in the last 30 days?", help: "Include paying and not paying. Zero is an honest answer. Example: 140. Nineteen paid. The rest are on the free tier.", req: true },
    { id: "revenue_band", kind: "choice", h: "Rough monthly revenue right now", help: "A band is enough. Do not invent a precise number. Example: R5,001 to R20,000. Nineteen people on R249 a month land in this band.", req: true,
      opts: ["R0", "R1 to R5,000", "R5,001 to R20,000", "R20,001 to R50,000", "R50,001 to R100,000", "More than R100,000"] },
    { id: "paid_people", kind: "number", h: "Besides you, how many people are paid to work in the business?", help: "Zero is fine.", req: true },
    { id: "hours_per_week", kind: "choice", h: "How many hours a week do you spend on this business?", req: true,
      opts: ["Fewer than 10", "10 to 20", "21 to 40", "More than 40"] },
    { id: "other_job", kind: "choice", h: "Do you have another job, or another business, besides this one?", req: true,
      opts: ["No. This is what I do.", "Yes. A job as well.", "Yes. Another business as well."] },
    { id: "keeps_books", kind: "yesno", h: "Do you keep a separate business bank account, or a simple monthly record of money in and money out?", help: "“Not yet” is allowed. That is part of what the school teaches.", yes: "Yes", no: "Not yet", req: true },
    { id: "cipc", kind: "choice", h: "Is the business registered with CIPC?", help: "Not a requirement to apply.", req: true, opts: ["Yes", "In progress", "Not yet"] },
    { id: "sector", kind: "select", h: "Sector", help: "Any sector is welcome. Slip would choose Software and digital.", req: true,
      opts: ["Food and hospitality", "Retail and consumer", "Services", "Software and digital", "Creative and media", "Health and wellness", "Education", "Trade and manufacturing", "Agriculture", "Other"] },
    { id: "link", kind: "url", h: "A link, if you have one", help: "Website, Instagram, WhatsApp catalogue, or app store. Skip if you do not have one. Example: getslip.app", ph: "https://getslip.app" },
    { id: "photo_url", kind: "url", h: "One photo or screenshot that proves it exists", help: "Shop front, product, app screen, invoice, or booking calendar. Not a pitch deck. Paste a link to the photo: a Google Drive, Dropbox, iCloud or WhatsApp share link is fine. Example: a phone screenshot of the invoice link a client receives.", ph: "https://" },

    { kind: "statement", h: "Who is building it.", body: ["Solo founders are welcome. If there is a team, we need to know who will sit in the school."] },

    { id: "team_shape", kind: "choice", h: "Are you building this alone, or with other people?", req: true,
      opts: ["Alone", "With one cofounder", "With two or more cofounders", "I have people who work with me, but I own the business"] },
    { id: "cofounders", kind: "textarea", h: "Cofounders", help: "How many, including you. First names, and what each person does, in one line each.", max: 400, req: true, show: hasCofounders },
    { id: "who_attends", kind: "choice", h: "Who will attend the weekly sessions?", help: "The seat is held by one named founder. A cofounder may sit in if we invite them.", req: true, show: hasCofounders,
      opts: ["I will", "We will share the seat", "All cofounders want to attend"] },
    { id: "decision_maker", kind: "choice", h: "Are you the person who makes the final decisions in the business?", req: true,
      opts: ["Yes", "Shared with a cofounder", "No"], endsOn: { "No": "C" } },

    { kind: "statement", h: "You in the work.", body: ["The school coaches the business and the person running it."] },

    { id: "why_this", kind: "textarea", h: "Why this business, and why you?", help: "A short answer. Eighty words is enough.", max: 500, req: true },
    { id: "hardest_part", kind: "textarea", h: "What is the hardest part of running it right now?", max: 400, req: true },
    { id: "other_programme", kind: "yesno", h: "Will you be on another incubator, accelerator or grant program between January and June 2027?", help: "Two programs at once is how people disappear. Tell us now.", req: true },
    { id: "can_protect_time", kind: "choice", h: "The school is weekly for six months from January 2027, online, then twelve months of mentorship. Can you protect that time?", req: true,
      opts: ["Yes", "I need to talk about it"] },
    { id: "has_device", kind: "yesno", h: "Do you have a laptop or smartphone, and data, for a weekly online session?", help: "The school is online. “Not yet” does not close the door. We need to know.", yes: "Yes", no: "Not yet", req: true },
    { id: "july_2027", kind: "textarea", h: "What do you want to be true about the business by July 2027?", help: "The end of the six months. Be specific. Example: Eighty paying subscribers. A monthly P&L. One person on support.", max: 400, req: true },

    { kind: "statement", h: "The grant.", body: ["Read this before you submit.", "A seat in the school does not include a grant. At demo day, a panel awards three to five grants of R100,000 per cohort. No equity. No repayment. The founder keeps the company. Everyone who finishes still receives twelve months of mentorship."] },

    { id: "grant_understood", kind: "check", label: "I understand that a seat in the school does not include a grant.", help: "Grants of R100,000 are awarded at demo day to three to five founders per cohort.", req: true },
    { id: "grant_use", kind: "textarea", h: "If you were awarded the grant, what would the R100,000 be used for?", help: "A sketch is enough. This is not a budget submission. Example: Six months of a developer two days a week, and the App Store and Play Store listing fees.", max: 280, req: true },

    { kind: "statement", h: "Two last things." },

    { id: "work_from", kind: "choice", h: "Where do you mainly work from?", help: "Optional. Used for reporting. Not used to select the cohort.",
      opts: ["City", "Township", "Peri urban", "Rural", "Prefer not to say"] },
    { id: "disability", kind: "choice", h: "Do you identify as a person with a disability?", help: "Optional. Used for reporting. Not used to select the cohort.",
      opts: ["Yes", "No", "Prefer not to say"] },
    { id: "may_feature", kind: "yesno", h: "If you join the cohort, may Saturn Foundation use your first name, city, business name and a photo in reports and on the site?", help: "You can change this later." },

    { id: "consent_personal_and_updates", kind: "consent", h: "Thank you for taking the time to complete this application.",
      label: "I confirm that my answers are true and complete. By submitting, I give Saturn Foundation my personal information to assess this application, and I agree to receive updates from Saturn Foundation about the school and later programs. I can ask to be removed from updates at any time by writing to radiyya@saturn.africa.",
      btn: "Submit application", req: true }
  ];

  var ENDINGS = {
    A: { h: "You're done.",
         body: ["Thank you for applying to Saturn Startup School. Please give us time to review every application. We will reach out to you. You do not need to follow up.",
                "Follow Saturn Foundation on LinkedIn so you see the cohort as it takes shape."],
         btn: "Follow Saturn Foundation on LinkedIn", href: "https://www.linkedin.com/company/saturnfoundation", blank: true },
    B: { h: "This cohort is not a fit.",
         body: ["Saturn Startup School is for founders aged 18 to 35, based in South Africa, who already have users or revenue. If that is not you yet, write to radiyya@saturn.africa and apply to a later cohort when it is."],
         btn: "Back to saturn.africa", href: "https://saturn.africa/foundation.html" },
    C: { h: "The applicant has to be the owner.",
         body: ["Saturn teaches the person who can change the business. If that is a cofounder, they should apply in their own name."],
         btn: "Back to saturn.africa", href: "https://saturn.africa/foundation.html" }
  };

  /* ---------- state ---------- */
  var state = load() || { i: 0, hist: [], a: {} };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); return s && typeof s.i === "number" ? s : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function visible(step) { return !step.show || step.show(state.a); }
  function isQuestion(step) { return !!step.id && !step.gate; }
  function nextIndex(from) { var i = from + 1; while (i < STEPS.length && !visible(STEPS[i])) i++; return i; }

  /* ---------- progress ---------- */
  var progEl = document.getElementById("ap-progress"), fillEl = document.getElementById("ap-fill");
  function progress(step) {
    var qs = STEPS.filter(function (s) { return isQuestion(s) && visible(s); });
    var n = qs.indexOf(step) + 1, total = qs.length;
    var passedGate = STEPS.indexOf(step) > STEPS.map(function (s) { return !!s.gate; }).lastIndexOf(true);
    if (!passedGate || step.kind === "welcome") { progEl.textContent = ""; fillEl.style.width = "0"; return; }
    if (n > 0) { progEl.textContent = n + " of " + total; fillEl.style.width = (n / total * 100) + "%"; }
    else {
      /* statements sit between questions: keep the last number on the bar */
      var before = STEPS.slice(0, STEPS.indexOf(step)).filter(function (s) { return isQuestion(s) && visible(s); }).length;
      progEl.textContent = before ? before + " of " + total : ""; fillEl.style.width = (before / total * 100) + "%";
    }
  }

  /* ---------- render ---------- */
  var app = document.getElementById("app");
  var dir = 1;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function render() {
    var step = STEPS[state.i];
    if (!step) return;
    if (!visible(step)) { state.i = nextIndex(state.i); save(); return render(); }
    window.scrollTo(0, 0);
    app.innerHTML = "";
    var view = el("div", "ap-view is-" + step.kind + (dir < 0 ? " is-back" : ""));
    progress(step);

    if (step.kind === "welcome" || step.kind === "statement") {
      view.appendChild(el("h1", "ap-h", step.h));
      (step.body || []).forEach(function (p) { view.appendChild(el("p", "ap-body", p)); });
      var acts = el("div", "ap-actions");
      var goBtn = el("button", "ap-next", step.btn || "Continue"); goBtn.type = "button";
      goBtn.addEventListener("click", function () { go_(nextIndex(state.i)); });
      acts.appendChild(goBtn);
      if (step.kind === "statement" && state.hist.length) acts.appendChild(backBtn());
      view.appendChild(acts);
      app.appendChild(view);
      goBtn.focus({ preventScroll: true });
      return;
    }

    var field = el("div", "ap-field"), err = el("div", "ap-err"), acts2 = el("div", "ap-actions");
    var next = el("button", "ap-next", step.btn || "Continue"); next.type = "button";
    var current = state.a[step.id];
    var control = null; /* function returning the value to store, or undefined if invalid */
    var autoAdvance = false;

    if (step.kind !== "check") view.appendChild(el("h1", "ap-h", step.h));
    if (step.help && step.kind !== "check") view.appendChild(el("p", "ap-help", step.help));

    if (step.kind === "yesno" || step.kind === "choice") {
      var opts = step.kind === "yesno" ? [step.yes || "Yes", step.no || "No"] : step.opts;
      var wrap = el("div", "ap-opts" + (step.kind === "yesno" ? " is-two" : ""));
      var chosen = current;
      opts.forEach(function (o) {
        var b = el("button", "ap-opt" + (chosen === o ? " is-on" : ""), o); b.type = "button";
        b.setAttribute("role", "radio"); b.setAttribute("aria-checked", chosen === o ? "true" : "false");
        b.addEventListener("click", function () {
          chosen = o;
          wrap.querySelectorAll(".ap-opt").forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", x === b ? "true" : "false"); });
          err.textContent = "";
          if (step.req) setTimeout(proceed, 190); /* required choices move on by themselves; optional ones wait for Continue */
        });
        wrap.appendChild(b);
      });
      wrap.setAttribute("role", "radiogroup");
      field.appendChild(wrap);
      control = function () { if (step.req && !chosen) { err.textContent = "Choose one to continue."; return; } return chosen || ""; };
      autoAdvance = !!step.req;
    }

    else if (step.kind === "select") {
      var sel = el("select", "ap-select");
      var ph = el("option", null, "Choose one"); ph.value = ""; sel.appendChild(ph);
      step.opts.forEach(function (o) { var op = el("option", null, o); op.value = o; if (current === o) op.selected = true; sel.appendChild(op); });
      sel.addEventListener("change", function () { err.textContent = ""; });
      field.appendChild(sel);
      control = function () { if (step.req && !sel.value) { err.textContent = "Choose one to continue."; return; } return sel.value; };
    }

    else if (step.kind === "textarea") {
      var ta = el("textarea", "ap-textarea"); ta.maxLength = step.max; ta.placeholder = step.ph || ""; ta.value = current || "";
      var count = el("div", "ap-count");
      function upd() { count.textContent = ta.value.length + " / " + step.max; count.classList.toggle("is-near", ta.value.length > step.max * 0.9); }
      ta.addEventListener("input", function () { upd(); err.textContent = ""; }); upd();
      field.appendChild(ta); field.appendChild(count);
      control = function () { var v = ta.value.trim(); if (step.req && !v) { err.textContent = "This one is required."; return; } return v; };
    }

    else if (step.kind === "check" || step.kind === "consent") {
      var lab = el("label", "ap-check"), cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = current === true;
      var box = el("span", "box"), txt = el("span", "txt");
      if (step.kind === "check") { var b1 = el("b", null, step.label); txt.appendChild(b1); if (step.help) { txt.appendChild(document.createElement("br")); txt.appendChild(document.createTextNode(step.help)); } }
      else txt.textContent = step.label;
      lab.appendChild(cb); lab.appendChild(box); lab.appendChild(txt);
      field.appendChild(lab);
      next.disabled = !cb.checked;
      cb.addEventListener("change", function () { next.disabled = !cb.checked; err.textContent = ""; });
      control = function () { if (!cb.checked) { err.textContent = "Tick the box to continue."; return; } return true; };
    }

    else {
      var inp = el("input", "ap-input");
      inp.type = { text: "text", email: "email", tel: "tel", number: "number", date: "date", url: "url" }[step.kind] || "text";
      if (step.kind === "url") inp.type = "text"; /* the url type rejects bare domains like getslip.app */
      if (step.kind === "number") { inp.min = "0"; inp.step = "1"; inp.inputMode = "numeric"; }
      if (step.kind === "tel") inp.inputMode = "tel";
      if (step.kind === "email") { inp.autocomplete = "email"; inp.inputMode = "email"; }
      if (step.id === "full_name") inp.autocomplete = "name";
      if (step.id === "city") inp.autocomplete = "address-level2";
      if (step.id === "date_of_birth") inp.autocomplete = "bday";
      if (step.max) inp.maxLength = step.max;
      inp.placeholder = step.ph || ""; inp.value = current != null ? current : "";
      inp.addEventListener("input", function () { err.textContent = ""; });
      field.appendChild(inp);
      control = function () {
        var v = inp.value.trim();
        if (!v) { if (step.req) { err.textContent = "This one is required."; return; } return ""; }
        if (step.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { err.textContent = "Enter a valid email address."; return; }
        if (step.kind === "tel" && v.replace(/\D/g, "").length < 9) { err.textContent = "Enter a valid phone number."; return; }
        if (step.kind === "number") { var n = Number(v); if (!isFinite(n) || n < 0 || n !== Math.floor(n)) { err.textContent = "Enter a whole number, 0 or more."; return; } return n; }
        if (step.kind === "date") {
          var d = new Date(v + "T00:00:00"); if (isNaN(d)) { err.textContent = "Enter your date of birth."; return; }
          var age = REF_DATE.getFullYear() - d.getFullYear() - ((REF_DATE.getMonth() < d.getMonth() || (REF_DATE.getMonth() === d.getMonth() && REF_DATE.getDate() < d.getDate())) ? 1 : 0);
          if (age < 18 || age > 35) { err.textContent = "On 1 January 2027 you must be 18 to 35."; return; }
        }
        return v;
      };
      var hint = el("span", "ap-enter", "press Enter ↵");
      acts2.dataset.enter = "1";
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); proceed(); } });
      acts2.appendChild(hint);
    }

    view.appendChild(field); view.appendChild(err);
    next.addEventListener("click", function () { proceed(); });
    acts2.insertBefore(next, acts2.firstChild);
    if (state.hist.length) acts2.insertBefore(backBtn(), acts2.children[1] || null);
    view.appendChild(acts2);
    app.appendChild(view);

    var focusable = field.querySelector("input:not([type=checkbox]), textarea, select");
    if (focusable && !autoAdvance) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 60);

    function proceed() {
      var v = control();
      if (v === undefined) { var bad = field.querySelector("input, textarea, select, .ap-opt"); if (bad) bad.focus(); return; }
      state.a[step.id] = v;
      if (step.kind === "consent") { save(); return submit(next, err); }
      /* gate and owner exits */
      var noLabel = step.no || "No";
      if (step.gate && v === noLabel) { clear(); return ending(step.noEnds); }
      if (step.endsOn && step.endsOn[v]) { clear(); return ending(step.endsOn[v]); }
      go_(nextIndex(state.i));
    }
  }

  function backBtn() {
    var b = el("button", "ap-back", "Back"); b.type = "button";
    b.addEventListener("click", function () { if (!state.hist.length) return; dir = -1; state.i = state.hist.pop(); save(); render(); });
    return b;
  }
  function go_(i) { dir = 1; state.hist.push(state.i); state.i = i; save(); render(); }

  /* ---------- endings ---------- */
  function ending(key) {
    var e = ENDINGS[key];
    progEl.textContent = ""; fillEl.style.width = key === "A" ? "100%" : "0";
    window.scrollTo(0, 0);
    app.innerHTML = "";
    var view = el("div", "ap-view is-ending");
    view.appendChild(el("h1", "ap-h", e.h));
    e.body.forEach(function (p) {
      var pe = el("p", "ap-body");
      /* make the email address in ending B a live link */
      var parts = p.split(NOTIFY);
      parts.forEach(function (t, k) { pe.appendChild(document.createTextNode(t)); if (k < parts.length - 1) { var a = el("a", "ap-link", NOTIFY); a.href = "mailto:" + NOTIFY; pe.appendChild(a); } });
      view.appendChild(pe);
    });
    var acts = el("div", "ap-actions"), a = el("a", "ap-next", e.btn); a.href = e.href;
    if (e.blank) { a.target = "_blank"; a.rel = "noopener"; }
    acts.appendChild(a); view.appendChild(acts); app.appendChild(view);
  }

  /* ---------- submit ---------- */
  function payload() {
    var a = state.a;
    function s(k) { return a[k] == null ? "" : a[k]; }
    function n(k) { return typeof a[k] === "number" ? a[k] : 0; }
    var p = {
      source: "apply.html", cohort: "001", submitted_at: new Date().toISOString(),
      full_name: s("full_name"), email: s("email"), whatsapp: s("whatsapp"), city: s("city"), province: s("province"),
      date_of_birth: s("date_of_birth"), gender: s("gender"), heard_from: s("heard_from"),
      business_name: s("business_name"), one_sentence: s("one_sentence"), who_uses: s("who_uses"),
      how_they_use_and_pay: s("how_they_use_and_pay"), first_use_or_pay: s("first_use_or_pay"), stage: s("stage"),
      paying_customers_30d: n("paying_customers_30d"), active_users_30d: n("active_users_30d"), revenue_band: s("revenue_band"),
      paid_people: n("paid_people"), hours_per_week: s("hours_per_week"), other_job: s("other_job"), keeps_books: s("keeps_books"),
      cipc: s("cipc"), sector: s("sector"), link: s("link"), photo_url: s("photo_url"),
      team_shape: s("team_shape"), cofounders: hasCofounders(a) ? s("cofounders") : "", who_attends: hasCofounders(a) ? s("who_attends") : "",
      decision_maker: s("decision_maker"), why_this: s("why_this"), hardest_part: s("hardest_part"),
      other_programme: s("other_programme"), can_protect_time: s("can_protect_time"), has_device: s("has_device"), july_2027: s("july_2027"),
      grant_understood: a.grant_understood === true, grant_use: s("grant_use"),
      work_from: s("work_from"), disability: s("disability"), may_feature: s("may_feature") || "not answered",
      consent_personal_and_updates: a.consent_personal_and_updates === true
    };
    /* a readable copy of the same answers, so the email works on a phone */
    p.summary = Object.keys(p).filter(function (k) { return k !== "summary"; }).map(function (k) { return k + ": " + p[k]; }).join("\n");
    p._subject = "School 001 application | " + p.full_name + " | " + p.business_name;
    p._replyto = p.email;
    return p;
  }

  function submit(btn, err) {
    btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…"; err.textContent = "";
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload()) })
      .then(function (r) { if (!r.ok) throw new Error("status " + r.status); clear(); ending("A"); })
      .catch(function () { btn.disabled = false; btn.textContent = label; err.textContent = "Something went wrong. Try again."; });
  }

  render();
})();
