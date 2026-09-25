/* SATURN — Startup School 001 application.
   A welcome page, then one section per screen: a short intro, then every
   question in that section on one page. Answers are kept in localStorage
   so a founder can stop and come back. Submitted as JSON.

   Add ?preview=1 to the URL to walk every screen without answering
   anything. Nothing is saved or sent in preview. */
(function () {
  "use strict";

  var KEY = "saturn-school-001";
  var ENDPOINT = "https://formspree.io/f/xwvrdawj";
  var NOTIFY = "radiyya@saturn.africa";
  var LINKEDIN = "https://www.linkedin.com/company/saturnfoundation";
  var REF_DATE = new Date(2027, 0, 1); /* the age criteria are measured on this day */
  var PREVIEW = /[?&]preview=1/.test(location.search);

  function hasCofounders(a) { return a.team_shape === "With one cofounder" || a.team_shape === "With two or more cofounders"; }

  /* ---------- the flow ----------
     Each section has an intro screen and one or more question pages. A page
     can carry a `show` test, which is how the cofounder screen appears only
     for founders building with other people. */
  var SECTIONS = [
    { id: "welcome", kind: "welcome" },

    { id: "gate", gate: true, num: 1,
      statement: { h: "Qualifying criteria", body: [
        "The next four questions tell us whether Saturn Startup School is a fit for you right now.",
        "If it is not, the application ends there, so you do not spend the time."] },
      pages: [{ qs: [
        { id: "age_ok", kind: "yesno", q: "Are you between 18 and 35 years old?", help: "You must be 18 or older, and 35 or younger, on 1 January 2027.", req: true },
        { id: "sa_ok", kind: "yesno", q: "Do you live in South Africa, and are you a South African citizen or permanent resident?", help: "The 2027 school is for founders based in South Africa.", req: true },
        { id: "exists_ok", kind: "yesno", q: "Do you already have a product, service or shop in the world?", help: "Not a plan. Not a pitch deck. Something a customer can already buy or use.", req: true },
        { id: "traction_ok", kind: "yesno", q: "Do you already have early users, or early revenue?", help: "Either is enough. Both is fine. An idea with neither is not a fit for this cohort.", req: true }
      ] }] },

    { id: "you", num: 2,
      statement: { h: "About you", body: ["How we reach you, and where you work from."] },
      pages: [{ qs: [
        { id: "full_name", kind: "text", q: "Full name", help: "The name you use. This is the name on the seat.", max: 80, req: true },
        { id: "email", kind: "email", q: "Email address", help: "We will write here if we want a conversation.", req: true },
        { id: "whatsapp", kind: "tel", q: "WhatsApp number", help: "This is how the school will reach you. Use the number you live on.", req: true },
        { id: "city", kind: "text", q: "City or town", max: 60, req: true },
        { id: "province", kind: "select", q: "Province", req: true,
          opts: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"] },
        { id: "date_of_birth", kind: "date", q: "Date of birth", help: "This confirms the age criteria.", req: true },
        { id: "gender", kind: "choice", q: "Gender", help: "Used for reporting. Not used to select the cohort.", req: true,
          opts: ["Woman", "Man", "Nonbinary", "Prefer not to say"] },
        { id: "work_from", kind: "choice", q: "Where do you mainly work from?", help: "Used for reporting. Not used to select the cohort.", optional: true,
          opts: ["City", "Township", "Peri urban", "Rural", "Prefer not to say"] },
        { id: "disability", kind: "choice", q: "Do you identify as a person with a disability?", help: "Used for reporting. Not used to select the cohort.", optional: true,
          opts: ["Yes", "No", "Prefer not to say"] },
        { id: "heard_from", kind: "select", q: "How did you hear about Saturn Startup School?", req: true,
          opts: ["Instagram", "TikTok", "LinkedIn", "A friend or another founder", "University", "Saturn website", "Other"] },
        { id: "may_feature", kind: "yesno", q: "If you join the cohort, may Saturn Foundation use your first name, city, business name and a photo in reports and on the site?", help: "You can change your mind later.", optional: true }
      ] }] },

    { id: "business", num: 3,
      statement: { h: "Getting to know your business", body: [
        "This section is where we learn what you have built, who it serves and where it is today.",
        "Answer in your own words. There are no trick questions here, and nothing needs to be polished. The more you tell us, the better we understand your business, so please give us as much detail as you can."] },
      pages: [{ qs: [
        { id: "business_name", kind: "text", q: "What is the name of your business?", help: "A trading name is fine if you are not registered yet.", max: 80, req: true },
        { id: "one_sentence", kind: "textarea", q: "In one sentence, what does your business do?", help: "Write it so that someone who has never heard of you understands.", max: 140, req: true },
        { id: "who_uses", kind: "textarea", q: "What kind of customer does your business serve?", help: "Describe the people who buy from you, or who use what you have built.", max: 280, req: true },
        { id: "how_they_use_and_pay", kind: "textarea", q: "How does a customer use your business, and what do they pay?", help: "Take us through it once, then tell us the price.", max: 280, req: true },
        { id: "first_use_or_pay", kind: "text", q: "When did you get your first customer?", help: "The month and the year.", max: 40, req: true },
        { id: "stage", kind: "choice", q: "Which is true today?", req: true,
          opts: ["I have paying customers", "I have users, not yet paying", "I have both users and paying customers"] },
        { id: "paying_customers_30d", kind: "number", q: "Roughly how many paying customers do you have?", help: "An estimate is fine. Zero is an honest answer.", req: true },
        { id: "active_users_30d", kind: "number", q: "Roughly how many people have used your business in the last 30 days?", help: "Include the people who paid and the people who did not.", req: true },
        { id: "revenue_band", kind: "choice", q: "Roughly what does your business earn in a month?", help: "Choose the closest band. An estimate is fine.", req: true,
          opts: ["R0", "R1 to R5,000", "R5,001 to R20,000", "R20,001 to R50,000", "R50,001 to R100,000", "More than R100,000"] },
        { id: "paid_people", kind: "number", q: "Besides you, how many people are paid to work in the business?", help: "Zero is fine.", req: true },
        { id: "hours_per_week", kind: "choice", q: "How many hours a week do you spend on this business?", req: true,
          opts: ["Fewer than 10", "10 to 20", "21 to 40", "More than 40"] },
        { id: "other_job", kind: "choice", q: "Do you have another job, or another business, besides this one?", req: true,
          opts: ["No. This is what I do.", "Yes. A job as well.", "Yes. Another business as well."] },
        { id: "keeps_books", kind: "yesno", q: "Do you keep a separate business bank account, or a monthly record of money in and money out?", help: "“Not yet” is an honest answer. This is part of what the school teaches.", yes: "Yes", no: "Not yet", req: true },
        { id: "cipc", kind: "choice", q: "Is the business registered with CIPC?", help: "Registration is not a requirement to apply.", req: true, opts: ["Yes", "In progress", "Not yet"] },
        { id: "sector", kind: "select", q: "Which sector is your business in?", help: "Every sector is welcome.", req: true,
          opts: ["Food and hospitality", "Retail and consumer", "Services", "Software and digital", "Creative and media", "Health and wellness", "Education", "Trade and manufacturing", "Agriculture", "Other"] },
        { id: "link", kind: "url", q: "A link to your business, if you have one", help: "A website, an Instagram page, a WhatsApp catalogue or an app store listing.", optional: true },
        { id: "photo_url", kind: "url", q: "A link to one photo or screenshot of your business", help: "A shop front, a product, an app screen, an invoice or a booking calendar. Put it in Google Drive, Dropbox or iCloud and paste the share link here.", optional: true }
      ] }] },

    { id: "team", num: 4,
      statement: { h: "Your team", body: [
        "Saturn Startup School is built for founding teams of any size, and solo founders are welcome.",
        "If you are building with other people, we would like to know who they are."] },
      pages: [
        { qs: [
          { id: "team_shape", kind: "choice", q: "Are you building this alone, or with other people?", req: true,
            opts: ["Alone", "With one cofounder", "With two or more cofounders", "I have people who work with me, but I own the business"] },
          { id: "decision_maker", kind: "choice", q: "Are you the person who makes the final decisions in the business?", req: true,
            opts: ["Yes", "Shared with a cofounder", "No"], endsOn: { "No": "C" } }
        ] },
        { show: hasCofounders, qs: [
          { id: "cofounder_list", kind: "repeater", q: "Your cofounders", help: "One block for each cofounder, not counting yourself. We may reach out to them during the review.", req: true,
            fields: [
              { k: "name", label: "Full name", type: "text", req: true },
              { k: "email", label: "Email address", type: "email", req: true },
              { k: "phone", label: "Contact number", type: "tel", req: true },
              { k: "linkedin", label: "LinkedIn profile", type: "text", optional: true }
            ] },
          { id: "who_attends", kind: "choice", q: "Who will attend the weekly sessions?", help: "The seat is held by one named founder. A cofounder may sit in if we invite them.", req: true,
            opts: ["I will", "We will share the seat", "All cofounders want to attend"] }
        ] }
      ] },

    { id: "owner", num: 5,
      statement: { h: "Getting to know you as a business owner", body: [
        "Building a business asks a great deal of the person building it. It takes resilience, clear judgement and the will to keep going when the work is hard.",
        "Saturn Startup School coaches the founder as much as the company, so this last section is about you."] },
      pages: [{ qs: [
        { id: "why_this", kind: "textarea", q: "Why did you start this business, and what makes you the right person to build it?", help: "A short answer. Eighty words is enough.", max: 500, req: true },
        { id: "hardest_part", kind: "textarea", q: "What is the hardest part of running your business right now?", max: 400, req: true },
        { id: "other_programme", kind: "yesno", q: "Will you be on another incubator, accelerator or grant program between January and June 2027?", help: "Two programs at once is how founders lose momentum. Tell us now.", req: true },
        { id: "can_protect_time", kind: "choice", q: "The school runs weekly for six months from January 2027, online, then twelve months of mentorship. Can you protect that time?", req: true,
          opts: ["Yes", "I need to talk about it"] },
        { id: "has_device", kind: "yesno", q: "Do you have a laptop or smartphone, and data, for a weekly online session?", help: "The school is online. “Not yet” does not close the door. We need to know.", yes: "Yes", no: "Not yet", req: true },
        { id: "july_2027", kind: "textarea", q: "What do you want to be true about your business by July 2027?", help: "That is the end of the six months. Be specific.", max: 400, req: true },
        { id: "grant_use", kind: "textarea", q: "If you were awarded the R100,000 grant, what would you use it for?", help: "A sketch is enough. This is not a budget.", max: 280, req: true },
        { id: "grant_understood", kind: "check", req: true,
          label: "I understand that a seat in the school does not include a grant.",
          help: "At demo day, a panel awards three to five grants of R100,000 per cohort." }
      ] }] },

    { id: "submit", last: true, noStatement: true,
      pages: [{ head: { h: "Submit your application", body: ["Thank you for taking the time to complete this application."] }, qs: [
        { id: "consent_personal_and_updates", kind: "check", req: true,
          label: "I confirm that my answers are true and complete. By submitting, I give Saturn Foundation my personal information to assess this application, and I agree to receive updates from Saturn Foundation about the school and later programs. I can unsubscribe at any time." }
      ] }] }
  ];

  var SECTION_COUNT = SECTIONS.filter(function (s) { return s.num; }).length;

  var ENDINGS = {
    A: { h: "Thank you.",
         body: ["Thank you for taking the time to apply to Saturn Startup School. Please give us time to review every application. We will reach out to you, so you do not need to follow up.",
                "Follow Saturn Foundation on LinkedIn so you see the cohort as it takes shape."],
         btn: "Follow Saturn Foundation on LinkedIn", href: LINKEDIN, blank: true },
    B: { h: "Not this cohort.",
         body: ["Saturn Startup School 001 is for founders aged 18 to 35, based in South Africa, who already have users or revenue. Right now that is not you, so we will not take you through the rest of the application.",
                "Follow Saturn Foundation on LinkedIn to keep in touch. We will post there when the next cohort opens, and you can apply then."],
         btn: "Follow Saturn Foundation on LinkedIn", href: LINKEDIN, blank: true,
         alt: { btn: "Back to saturn.africa", href: "foundation.html" } },
    C: { h: "The applicant has to be the owner.",
         body: ["Saturn teaches the person who can change the business. If that is a cofounder, they should apply in their own name.",
                "Follow Saturn Foundation on LinkedIn to keep in touch."],
         btn: "Follow Saturn Foundation on LinkedIn", href: LINKEDIN, blank: true,
         alt: { btn: "Back to saturn.africa", href: "foundation.html" } }
  };

  /* views: welcome, then an intro and one or more question pages per section */
  var VIEWS = [];
  SECTIONS.forEach(function (sec) {
    if (sec.kind === "welcome") { VIEWS.push({ type: "welcome", sec: sec }); return; }
    if (!sec.noStatement) VIEWS.push({ type: "statement", sec: sec });
    sec.pages.forEach(function (page) { VIEWS.push({ type: "questions", sec: sec, page: page, show: page.show }); });
  });
  function viewVisible(v) { return !v.show || v.show(state.a); }

  /* ---------- state ---------- */
  var state = load() || { i: 0, a: {} };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); return s && typeof s.i === "number" && s.i < VIEWS.length ? s : null; } catch (e) { return null; } }
  function save() { if (PREVIEW) return; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  var app = document.getElementById("app");
  var fillEl = document.getElementById("ap-fill");
  var dir = 1;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function visible(q) { return !q.show || q.show(state.a); }

  /* ---------- render ---------- */
  function render() {
    var view = VIEWS[state.i];
    if (!view) return;
    if (!viewVisible(view)) { return dir < 0 ? back() : next(); }
    window.scrollTo(0, 0);
    app.innerHTML = "";

    var shown = VIEWS.filter(viewVisible);
    var pos = shown.indexOf(view);
    fillEl.style.width = (pos / (shown.length - 1) * 100) + "%";

    var box = el("div", "ap-view is-" + view.type + (dir < 0 ? " is-back" : ""));
    if (view.type === "welcome") renderWelcome(box);
    else if (view.type === "statement") renderStatement(box, view.sec);
    else renderQuestions(box, view.sec, view.page);
    app.appendChild(box);
    if (PREVIEW) previewBar();
  }

  function renderWelcome(box) {
    box.appendChild(el("span", "ap-kicker", "Saturn Startup School · Cohort 001"));
    box.appendChild(el("h1", "ap-h", "Apply for Saturn Startup School"));
    box.appendChild(el("p", "ap-body", "Cohort 001 begins January 2027. This is an application to the school. It is not an application for a grant."));

    var facts = el("ul", "ap-facts");
    [["The school", "Six months, online, weekly, in a cohort of eight to fifteen founders."],
     ["The teaching", "Sessions with founders and owners who have built and sold real companies. On the business, and on the person running it."],
     ["The grant", "At demo day, a panel awards three to five grants of R100,000 per cohort. No equity. No repayment. You keep your company."],
     ["After the school", "Everyone who finishes receives twelve months of mentorship."]].forEach(function (f) {
      var li = el("li"); li.appendChild(el("span", "ap-fact-t", f[0])); li.appendChild(el("span", "ap-fact-d", f[1])); facts.appendChild(li);
    });
    box.appendChild(facts);

    box.appendChild(el("p", "ap-body", "The application takes about 15 minutes and you can finish it on a phone. Your answers save as you go, so you can stop and come back to this page later."));
    box.appendChild(el("p", "ap-body", "It starts with four qualifying questions, then five short sections."));

    var acts = el("div", "ap-actions");
    var go = el("button", "ap-next", "Start"); go.type = "button";
    go.addEventListener("click", function () { next(); });
    acts.appendChild(go);
    box.appendChild(acts);
  }

  function renderStatement(box, sec) {
    if (sec.num) box.appendChild(el("span", "ap-kicker", "Section " + sec.num + " of " + SECTION_COUNT));
    box.appendChild(el("h1", "ap-h", sec.statement.h));
    sec.statement.body.forEach(function (p) { box.appendChild(el("p", "ap-body", p)); });
    var acts = el("div", "ap-actions");
    var go = el("button", "ap-next", "Continue"); go.type = "button";
    go.addEventListener("click", function () { next(); });
    acts.appendChild(go);
    if (state.i > 0) acts.appendChild(backBtn());
    box.appendChild(acts);
  }

  function renderQuestions(box, sec, page) {
    if (page.head) {
      box.appendChild(el("h1", "ap-h", page.head.h));
      (page.head.body || []).forEach(function (p) { box.appendChild(el("p", "ap-body", p)); });
    } else {
      box.appendChild(el("span", "ap-kicker", sec.statement.h));
    }

    var form = el("form", "ap-form"); form.noValidate = true;
    var fields = [];
    page.qs.forEach(function (q) { var f = buildField(q); fields.push(f); form.appendChild(f.wrap); });
    function sync() { fields.forEach(function (f) { f.wrap.hidden = !visible(f.q); }); }
    fields.forEach(function (f) { f.onChange = sync; });
    sync();
    box.appendChild(form);

    var err = el("div", "ap-err ap-err-form");
    box.appendChild(err);

    var acts = el("div", "ap-actions");
    var go = el("button", "ap-next", sec.last ? "Submit application" : "Continue"); go.type = "button";
    go.addEventListener("click", function () {
      err.textContent = "";
      var bad = null;
      for (var k = 0; k < fields.length; k++) {
        var f = fields[k];
        if (!visible(f.q)) continue;
        var v = f.read();
        if (v === undefined) { if (!bad) bad = f; continue; }
        state.a[f.q.id] = v;
      }
      if (bad && !PREVIEW) {
        err.textContent = "Check the answers marked above.";
        bad.wrap.scrollIntoView({ block: "center", behavior: "smooth" });
        var focusable = bad.wrap.querySelector("input, textarea, select, .ap-opt");
        if (focusable) focusable.focus({ preventScroll: true });
        return;
      }
      save();
      if (!PREVIEW) {
        if (sec.gate && page.qs.some(function (q) { return state.a[q.id] === (q.no || "No"); })) { clear(); return ending("B"); }
        for (var j = 0; j < page.qs.length; j++) {
          var q2 = page.qs[j];
          if (q2.endsOn && q2.endsOn[state.a[q2.id]]) { clear(); return ending(q2.endsOn[state.a[q2.id]]); }
        }
        if (sec.last) return submit(go, err);
      }
      next();
    });
    acts.appendChild(go);
    acts.appendChild(backBtn());
    box.appendChild(acts);
  }

  /* ---------- one field ---------- */
  function buildField(q) {
    var wrap = el("div", "ap-q");
    var f = { q: q, wrap: wrap, onChange: null };
    var err = el("div", "ap-err");
    var current = state.a[q.id];

    if (q.kind !== "check") {
      var lab = el("p", "ap-q-label", q.q);
      if (q.optional) lab.appendChild(el("span", "ap-opt-tag", "optional"));
      wrap.appendChild(lab);
      if (q.help) wrap.appendChild(el("p", "ap-q-help", q.help));
    }

    if (q.kind === "yesno" || q.kind === "choice") {
      var opts = q.kind === "yesno" ? [q.yes || "Yes", q.no || "No"] : q.opts;
      var row = el("div", "ap-opts" + (q.kind === "yesno" ? " is-two" : ""));
      row.setAttribute("role", "radiogroup");
      var chosen = current;
      opts.forEach(function (o) {
        var b = el("button", "ap-opt" + (chosen === o ? " is-on" : ""), o); b.type = "button";
        b.setAttribute("role", "radio"); b.setAttribute("aria-checked", chosen === o ? "true" : "false");
        b.addEventListener("click", function () {
          chosen = o; state.a[q.id] = o; save();
          row.querySelectorAll(".ap-opt").forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", x === b ? "true" : "false"); });
          err.textContent = ""; wrap.classList.remove("is-bad");
          if (f.onChange) f.onChange();
        });
        row.appendChild(b);
      });
      wrap.appendChild(row); wrap.appendChild(err);
      f.read = function () { if (q.req && !chosen) return fail(wrap, err, "Choose one."); return chosen || ""; };
      return f;
    }

    if (q.kind === "select") {
      var sel = el("select", "ap-select");
      var ph = el("option", null, "Choose one"); ph.value = ""; sel.appendChild(ph);
      q.opts.forEach(function (o) { var op = el("option", null, o); op.value = o; if (current === o) op.selected = true; sel.appendChild(op); });
      sel.addEventListener("change", function () { err.textContent = ""; wrap.classList.remove("is-bad"); state.a[q.id] = sel.value; save(); });
      wrap.appendChild(sel); wrap.appendChild(err);
      f.read = function () { if (q.req && !sel.value) return fail(wrap, err, "Choose one."); return sel.value; };
      return f;
    }

    if (q.kind === "textarea") {
      var ta = el("textarea", "ap-textarea"); ta.maxLength = q.max; ta.value = current || "";
      var count = el("div", "ap-count");
      function upd() { count.textContent = ta.value.length + " / " + q.max; count.classList.toggle("is-near", ta.value.length > q.max * 0.9); }
      ta.addEventListener("input", function () { upd(); err.textContent = ""; wrap.classList.remove("is-bad"); state.a[q.id] = ta.value; save(); });
      upd();
      wrap.appendChild(ta); wrap.appendChild(count); wrap.appendChild(err);
      f.read = function () { var v = ta.value.trim(); if (q.req && !v) return fail(wrap, err, "This one is required."); return v; };
      return f;
    }

    if (q.kind === "check") {
      var lab2 = el("label", "ap-check"), cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = current === true;
      var boxEl = el("span", "box"), txt = el("span", "txt");
      txt.appendChild(el("b", null, q.label));
      if (q.help) { txt.appendChild(document.createElement("br")); txt.appendChild(document.createTextNode(q.help)); }
      lab2.appendChild(cb); lab2.appendChild(boxEl); lab2.appendChild(txt);
      cb.addEventListener("change", function () { err.textContent = ""; wrap.classList.remove("is-bad"); state.a[q.id] = cb.checked; save(); });
      wrap.appendChild(lab2); wrap.appendChild(err);
      f.read = function () { if (!cb.checked) return fail(wrap, err, "Tick the box to continue."); return true; };
      return f;
    }

    if (q.kind === "repeater") {
      var list = Array.isArray(current) && current.length ? current.slice() : [{}];
      var host = el("div", "ap-rep");
      var addBtn = el("button", "ap-add", "Add another cofounder"); addBtn.type = "button";

      function draw() {
        host.innerHTML = "";
        list.forEach(function (row, idx) {
          var card = el("div", "ap-rep-card");
          var head = el("div", "ap-rep-head");
          head.appendChild(el("span", "ap-rep-n", "Cofounder " + (idx + 1)));
          if (list.length > 1) {
            var rm = el("button", "ap-rep-x", "Remove"); rm.type = "button";
            rm.addEventListener("click", function () { list.splice(idx, 1); state.a[q.id] = list; save(); draw(); });
            head.appendChild(rm);
          }
          card.appendChild(head);
          q.fields.forEach(function (fd) {
            var l = el("label", "ap-rep-field");
            var t = el("span", "ap-rep-label", fd.label);
            if (fd.optional) t.appendChild(el("span", "ap-opt-tag", "optional"));
            var i = el("input", "ap-input"); i.type = fd.type === "email" ? "email" : (fd.type === "tel" ? "tel" : "text");
            if (fd.type === "tel") i.inputMode = "tel";
            i.value = row[fd.k] || "";
            i.addEventListener("input", function () { row[fd.k] = i.value; state.a[q.id] = list; save(); err.textContent = ""; wrap.classList.remove("is-bad"); });
            l.appendChild(t); l.appendChild(i);
            card.appendChild(l);
          });
          host.appendChild(card);
        });
        addBtn.hidden = list.length >= 4;
      }
      addBtn.addEventListener("click", function () { list.push({}); state.a[q.id] = list; save(); draw(); });
      draw();
      wrap.appendChild(host); wrap.appendChild(addBtn); wrap.appendChild(err);
      f.read = function () {
        var clean = list.filter(function (r) { return q.fields.some(function (fd) { return (r[fd.k] || "").trim(); }); });
        if (!clean.length) return fail(wrap, err, "Add at least one cofounder.");
        var missing = clean.some(function (r) { return q.fields.some(function (fd) { return !fd.optional && !(r[fd.k] || "").trim(); }); });
        if (missing) return fail(wrap, err, "Every cofounder needs a name, an email address and a contact number.");
        var badMail = clean.some(function (r) { return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((r.email || "").trim()); });
        if (badMail) return fail(wrap, err, "Check the cofounder email addresses.");
        return clean;
      };
      return f;
    }

    var inp = el("input", "ap-input");
    inp.type = { text: "text", email: "email", tel: "tel", number: "number", date: "date" }[q.kind] || "text";
    if (q.kind === "number") { inp.min = "0"; inp.step = "1"; inp.inputMode = "numeric"; }
    if (q.kind === "tel") inp.inputMode = "tel";
    if (q.kind === "email") { inp.autocomplete = "email"; inp.inputMode = "email"; }
    if (q.id === "full_name") inp.autocomplete = "name";
    if (q.id === "city") inp.autocomplete = "address-level2";
    if (q.id === "date_of_birth") inp.autocomplete = "bday";
    if (q.max) inp.maxLength = q.max;
    inp.value = current != null ? current : "";
    inp.addEventListener("input", function () { err.textContent = ""; wrap.classList.remove("is-bad"); state.a[q.id] = inp.value; save(); });
    wrap.appendChild(inp); wrap.appendChild(err);

    f.read = function () {
      var v = inp.value.trim();
      if (!v) { if (q.req) return fail(wrap, err, "This one is required."); return ""; }
      if (q.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return fail(wrap, err, "Enter a valid email address.");
      if (q.kind === "tel" && v.replace(/\D/g, "").length < 9) return fail(wrap, err, "Enter a valid phone number.");
      if (q.kind === "number") { var n = Number(v); if (!isFinite(n) || n < 0 || n !== Math.floor(n)) return fail(wrap, err, "Enter a whole number, 0 or more."); return n; }
      if (q.kind === "date") {
        var d = new Date(v + "T00:00:00"); if (isNaN(d)) return fail(wrap, err, "Enter your date of birth.");
        var age = REF_DATE.getFullYear() - d.getFullYear() - ((REF_DATE.getMonth() < d.getMonth() || (REF_DATE.getMonth() === d.getMonth() && REF_DATE.getDate() < d.getDate())) ? 1 : 0);
        if (age < 18 || age > 35) return fail(wrap, err, "On 1 January 2027 you must be 18 to 35.");
      }
      return v;
    };
    return f;
  }

  function fail(wrap, err, msg) { err.textContent = msg; wrap.classList.add("is-bad"); return undefined; }

  function backBtn() {
    var b = el("button", "ap-back", "Back"); b.type = "button";
    b.addEventListener("click", function () { back(); });
    return b;
  }
  function next() {
    dir = 1;
    var i = state.i + 1;
    while (i < VIEWS.length && !viewVisible(VIEWS[i])) i++;
    state.i = Math.min(i, VIEWS.length - 1); save(); render();
  }
  function back() {
    dir = -1;
    var i = state.i - 1;
    while (i > 0 && !viewVisible(VIEWS[i])) i--;
    state.i = Math.max(0, i); save(); render();
  }

  /* ---------- endings ---------- */
  function ending(key) {
    var e = ENDINGS[key];
    fillEl.style.width = key === "A" ? "100%" : "0";
    window.scrollTo(0, 0);
    app.innerHTML = "";
    var box = el("div", "ap-view is-ending");
    box.appendChild(el("h1", "ap-h", e.h));
    e.body.forEach(function (p) {
      var pe = el("p", "ap-body");
      var parts = p.split(NOTIFY);
      parts.forEach(function (t, k) { pe.appendChild(document.createTextNode(t)); if (k < parts.length - 1) { var a = el("a", "ap-link", NOTIFY); a.href = "mailto:" + NOTIFY; pe.appendChild(a); } });
      box.appendChild(pe);
    });
    var acts = el("div", "ap-actions"), a = el("a", "ap-next", e.btn); a.href = e.href;
    if (e.blank) { a.target = "_blank"; a.rel = "noopener"; }
    acts.appendChild(a);
    if (e.alt) { var alt = el("a", "ap-back", e.alt.btn); alt.href = e.alt.href; acts.appendChild(alt); }
    box.appendChild(acts); app.appendChild(box);
    if (PREVIEW) previewBar(key);
  }

  /* ---------- submit ---------- */
  function payload() {
    var a = state.a;
    function s(k) { return a[k] == null ? "" : a[k]; }
    function n(k) { var v = Number(a[k]); return isFinite(v) ? v : 0; }
    var team = hasCofounders(a) && Array.isArray(a.cofounder_list) ? a.cofounder_list : [];
    var p = {
      source: "apply.html", cohort: "001", submitted_at: new Date().toISOString(),
      full_name: s("full_name"), email: s("email"), whatsapp: s("whatsapp"), city: s("city"), province: s("province"),
      date_of_birth: s("date_of_birth"), gender: s("gender"), heard_from: s("heard_from"),
      business_name: s("business_name"), one_sentence: s("one_sentence"), who_uses: s("who_uses"),
      how_they_use_and_pay: s("how_they_use_and_pay"), first_use_or_pay: s("first_use_or_pay"), stage: s("stage"),
      paying_customers_30d: n("paying_customers_30d"), active_users_30d: n("active_users_30d"), revenue_band: s("revenue_band"),
      paid_people: n("paid_people"), hours_per_week: s("hours_per_week"), other_job: s("other_job"), keeps_books: s("keeps_books"),
      cipc: s("cipc"), sector: s("sector"), link: s("link"), photo_url: s("photo_url"),
      team_shape: s("team_shape"),
      cofounders: team.map(function (c, i) { return "Cofounder " + (i + 1) + ": " + [c.name, c.email, c.phone, c.linkedin].filter(Boolean).join(" | "); }).join("\n"),
      who_attends: hasCofounders(a) ? s("who_attends") : "",
      decision_maker: s("decision_maker"), why_this: s("why_this"), hardest_part: s("hardest_part"),
      other_programme: s("other_programme"), can_protect_time: s("can_protect_time"), has_device: s("has_device"), july_2027: s("july_2027"),
      grant_understood: a.grant_understood === true, grant_use: s("grant_use"),
      work_from: s("work_from") || "not answered", disability: s("disability") || "not answered", may_feature: s("may_feature") || "not answered",
      consent_personal_and_updates: a.consent_personal_and_updates === true
    };
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

  /* ---------- preview bar: only with ?preview=1 ---------- */
  function previewBar(endingKey) {
    var old = document.getElementById("ap-preview"); if (old) old.remove();
    var bar = el("div", "ap-preview"); bar.id = "ap-preview";
    var v = VIEWS[state.i];
    var label = endingKey ? "Ending " + endingKey
      : (v.type === "welcome" ? "Welcome" : (v.type === "statement" ? "Intro: " + v.sec.statement.h : "Questions: " + (v.sec.statement ? v.sec.statement.h : "Submit")));
    bar.appendChild(el("span", "ap-pv-tag", "preview"));
    bar.appendChild(el("span", "ap-pv-label", label));
    var nav = el("div", "ap-pv-nav");
    ["A", "B", "C"].forEach(function (k) {
      var e = el("button", "ap-pv-btn" + (endingKey === k ? " is-on" : ""), "end " + k); e.type = "button";
      e.addEventListener("click", function () { ending(k); });
      nav.appendChild(e);
    });
    var co = el("button", "ap-pv-btn" + (hasCofounders(state.a) ? " is-on" : ""), "cofounders"); co.type = "button";
    co.addEventListener("click", function () { state.a.team_shape = hasCofounders(state.a) ? "Alone" : "With one cofounder"; render(); });
    nav.appendChild(co);
    var prev = el("button", "ap-pv-btn", "‹ back"); prev.type = "button";
    prev.addEventListener("click", function () { if (endingKey) { render(); return; } back(); });
    var nxt = el("button", "ap-pv-btn", "next ›"); nxt.type = "button";
    nxt.addEventListener("click", function () { if (endingKey) { render(); return; } next(); });
    nav.appendChild(prev); nav.appendChild(nxt);
    bar.appendChild(nav);
    document.body.appendChild(bar);
  }

  if (PREVIEW) { state = { i: 0, a: {} }; document.body.classList.add("is-preview"); }
  render();
})();
