/* SATURN — announcement bar (foundation page). Needs gsap loaded first.
   Splits the line into letters, brings them in one after another, then
   runs a slow wave across them every few seconds so the bar keeps
   catching the eye without shouting. */
(function () {
  "use strict";
  var el = document.querySelector(".announce-text[data-split]");
  if (!el || !window.gsap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* wrap every character in a span, keeping the SATURN lockup span intact */
  function split(node) {
    [].slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split("").forEach(function (c) {
          var s = document.createElement("span");
          s.className = "ch" + (c === " " ? " sp" : "");
          s.textContent = c === " " ? " " : c;
          frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        split(n);
      }
    });
  }
  split(el);
  var chars = el.querySelectorAll(".ch");

  var tl = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
  /* entrance: rise and fade in, letter by letter */
  tl.from(chars, {
    yPercent: 110, opacity: 0,
    duration: 0.55, ease: "power3.out",
    stagger: { each: 0.018, from: "start" }
  });
  /* idle: a soft lift that travels left to right */
  tl.to(chars, {
    yPercent: -22, duration: 0.32, ease: "sine.inOut",
    stagger: { each: 0.014, from: "start" }
  }, "+=2.2");
  tl.to(chars, {
    yPercent: 0, duration: 0.42, ease: "sine.inOut",
    stagger: { each: 0.014, from: "start" }
  }, "<0.22");
  /* exit before the loop restarts so the entrance reads again */
  tl.to(chars, {
    opacity: 0, yPercent: -110, duration: 0.4, ease: "power2.in",
    stagger: { each: 0.01, from: "start" }
  }, "+=3.5");
  tl.set(chars, { yPercent: 110 });
})();
