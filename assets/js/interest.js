/* SATURN — short interest forms (register.html, mentor.html).
   One screen, a handful of fields, posted to Formspree as JSON. The page
   supplies the subject line and the thank you copy through data attributes
   on the form. */
(function () {
  "use strict";

  var form = document.getElementById("interest-form");
  if (!form) return;
  var ENDPOINT = form.getAttribute("data-endpoint");
  var btn = form.querySelector(".ap-next");
  var formErr = form.querySelector(".ap-err-form");
  var fields = [].slice.call(form.querySelectorAll("[data-field]"));

  function fail(wrap, msg) {
    wrap.classList.add("is-bad");
    var e = wrap.querySelector(".ap-err");
    if (e) e.textContent = msg;
    return false;
  }
  function clearErr(wrap) {
    wrap.classList.remove("is-bad");
    var e = wrap.querySelector(".ap-err");
    if (e) e.textContent = "";
  }

  fields.forEach(function (wrap) {
    var input = wrap.querySelector("input, textarea, select");
    if (!input) return;
    input.addEventListener("input", function () { clearErr(wrap); formErr.textContent = ""; });
    input.addEventListener("change", function () { clearErr(wrap); formErr.textContent = ""; });
    if (input.tagName === "TEXTAREA" && input.maxLength > 0) {
      var count = wrap.querySelector(".ap-count");
      if (count) {
        var upd = function () {
          count.textContent = input.value.length + " / " + input.maxLength;
          count.classList.toggle("is-near", input.value.length > input.maxLength * 0.9);
        };
        input.addEventListener("input", upd); upd();
      }
    }
  });

  function read() {
    var out = {}, ok = true, first = null;
    fields.forEach(function (wrap) {
      var input = wrap.querySelector("input, textarea, select");
      if (!input) return;
      var key = wrap.getAttribute("data-field");
      var v = (input.value || "").trim();
      var required = input.hasAttribute("required");
      if (!v) {
        if (required) { ok = fail(wrap, input.tagName === "SELECT" ? "Choose one." : "This one is required."); if (!first) first = wrap; }
        out[key] = "";
        return;
      }
      if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        ok = fail(wrap, "Enter a valid email address."); if (!first) first = wrap; out[key] = v; return;
      }
      out[key] = v;
    });
    if (!ok && first) {
      first.scrollIntoView({ block: "center", behavior: "smooth" });
      var f = first.querySelector("input, textarea, select");
      if (f) f.focus({ preventScroll: true });
      formErr.textContent = "Check the answers marked above.";
      return null;
    }
    return out;
  }

  function done() {
    var view = form.closest(".ap-view");
    view.innerHTML = "";
    var h = document.createElement("h1"); h.className = "ap-h"; h.textContent = form.getAttribute("data-done-h");
    view.appendChild(h);
    form.getAttribute("data-done-body").split("|").forEach(function (p) {
      var el = document.createElement("p"); el.className = "ap-body"; el.textContent = p; view.appendChild(el);
    });
    var acts = document.createElement("div"); acts.className = "ap-actions";
    var a = document.createElement("a"); a.className = "ap-next"; a.href = "https://www.linkedin.com/company/saturnfoundation";
    a.target = "_blank"; a.rel = "noopener"; a.textContent = "Follow Saturn Foundation on LinkedIn";
    var back = document.createElement("a"); back.className = "ap-back"; back.href = "foundation.html"; back.textContent = "Back to saturn.africa";
    acts.appendChild(a); acts.appendChild(back); view.appendChild(acts);
    window.scrollTo(0, 0);
  }

  btn.addEventListener("click", function () {
    var data = read();
    if (!data) return;
    data.source = form.getAttribute("data-source");
    data.submitted_at = new Date().toISOString();
    data._subject = form.getAttribute("data-subject").replace("{name}", data.full_name || "");
    if (data.email) data._replyto = data.email;
    data.summary = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_" && k !== "summary"; })
      .map(function (k) { return k + ": " + data[k]; }).join("\n");

    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = "Sending…";
    formErr.textContent = "";
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error("status " + r.status); done(); })
      .catch(function () { btn.disabled = false; btn.textContent = label; formErr.textContent = "Something went wrong. Try again."; });
  });

  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); btn.click(); }
  });
})();
