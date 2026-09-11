/* SATURN — shared behaviour: nav, reveal, diagram, contact form */
(function () {
  "use strict";

  /* active nav pill: white pill sits on the selected item */
  var navLinks = document.querySelectorAll(".nav-menu a.nav-link");
  function setActive(link) {
    navLinks.forEach(function (l) { l.classList.remove("active"); });
    if (link) link.classList.add("active");
  }
  navLinks.forEach(function (l) {
    l.addEventListener("click", function () { setActive(l); });
  });
  /* on vertical pages, Our Services starts active */
  if (/ventures|ecosystem|foundation/.test(location.pathname)) {
    setActive(document.querySelector(".nav-drop > a.nav-link"));
  }

  /* mobile burger */
  var burger = document.querySelector(".nav-burger");
  if (burger) {
    burger.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".nav-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* story timeline (homepage): rail draws in on scroll, hover a year to read it */
  var tl = document.querySelector(".saturn-tl");
  if (tl) {
    var tlTrack = tl.querySelector(".stl-track");
    var tlRail  = tl.querySelector(".stl-rail");
    var tlNodes = [].slice.call(tl.querySelectorAll(".stl-node"));
    var tlDescs = [].slice.call(tl.querySelectorAll(".stl-desc"));
    var tlGhost = tl.querySelector(".stl-ghost");
    var tlYears = tlNodes.map(function (n) { return n.querySelector(".stl-yr").textContent; });
    var tlActive = -1;

    function tlMeasure() {
      var t0 = tlTrack.getBoundingClientRect().left;
      var centers = tlNodes.map(function (n) {
        var d = n.querySelector(".stl-dot").getBoundingClientRect();
        return (d.left + d.width / 2) - t0;
      });
      tlRail.style.left  = centers[0] + "px";
      tlRail.style.width = (centers[centers.length - 1] - centers[0]) + "px";
    }
    function tlSet(i) {
      if (i === tlActive) return;
      tlActive = i;
      tl.classList.add("touched");
      tlNodes.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
      tlDescs.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
      if (tlGhost) tlGhost.textContent = tlYears[i];
    }
    tlNodes.forEach(function (n, i) {
      var btn = n.querySelector(".stl-btn");
      btn.addEventListener("mouseenter", function () { tlSet(i); });
      btn.addEventListener("focus",      function () { tlSet(i); });
      btn.addEventListener("click",      function () { tlSet(i); });
    });
    tlMeasure();
    window.addEventListener("resize", tlMeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tlMeasure);

    var tlIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { tl.classList.add("in"); tlIo.disconnect(); }
      });
    }, { threshold: 0.35 });
    tlIo.observe(tl);
  }

  /* scroll reveal */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .vp-diagram").forEach(function (el) {
    io.observe(el);
  });



  /* links waiting on a real destination: swallow the click so they don't
     jump to top. Replace the href and delete data-pending to activate. */
  document.querySelectorAll("a[data-pending]").forEach(function (a) {
    a.setAttribute("aria-disabled", "true");
    a.addEventListener("click", function (ev) { ev.preventDefault(); });
  });

  /* count up figures when they scroll into view */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var decimals = (el.dataset.count.split(".")[1] || "").length;
        var prefix = el.dataset.prefix || "";
        var suffix = el.dataset.suffix || "";
        var start = null, dur = 1100;
        function step(ts) {
          if (start === null) start = ts;
          var t = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          var val = (target * eased).toFixed(decimals);
          el.innerHTML = prefix + val + (suffix ? "<em>" + suffix + "</em>" : "");
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* contact form: posts to Formspree, keeps the inline confirmation */
  var form = document.getElementById("contact-form");
  if (form) {
    /* optional PDF: show the chosen name, refuse anything that is not a PDF under 10MB */
    var fileInput = form.querySelector("input[type=file]");
    var fileName = form.querySelector(".file-name");
    var FILE_MAX = 10 * 1024 * 1024;
    function fileOk() {
      if (!fileInput || !fileInput.files.length) return true;
      var f = fileInput.files[0];
      var isPdf = /\.pdf$/i.test(f.name) || f.type === "application/pdf";
      return isPdf && f.size <= FILE_MAX;
    }
    if (fileInput && fileName) {
      fileInput.addEventListener("change", function () {
        var f = fileInput.files[0];
        fileName.classList.remove("is-error", "has-file");
        if (!f) { fileName.textContent = fileName.dataset.empty; return; }
        if (!fileOk()) {
          fileName.textContent = f.size > FILE_MAX ? "That file is over 10MB" : "PDF files only";
          fileName.classList.add("is-error");
          fileInput.value = "";
          return;
        }
        fileName.textContent = f.name + " (" + (f.size / 1048576).toFixed(1) + "MB)";
        fileName.classList.add("has-file");
      });
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!fileOk()) { if (fileInput) fileInput.focus(); return; }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var note = document.getElementById("form-note");
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; }
      if (note) {
        note.textContent = "// sending\u2026";
        note.classList.add("show");
      }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status " + res.status);
          form.querySelectorAll("input, textarea, select, button, .file-btn").forEach(function (el) {
            el.disabled = true;
          });
          if (note) note.textContent = "// message received. we will be in touch shortly.";
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          if (note) note.textContent = "// that didn\u2019t send. email us at hello@saturn.africa";
        });
    });
  }

})();
