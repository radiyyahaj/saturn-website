/* SATURN — ASCII planet hero. Adapted from the approved saturn-hero prototype.
   Self contained: no external libraries. Dissolves on scroll, reforms at rest. */
(function () {
  var cv = document.getElementById("sat-c");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var BG = "#f4f3f0";
  var INK_COLOR = "#161616";
  var CFG = { cell: 6, glitch: 0, spin: 0.10, ramp: "@1*/a", textRings: true, particles: false };
  var MARKS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
  var RINGS = { r0: "SATURN VENTURES ", r1: "SATURN ECOSYSTEM ", r2: "SATURN FOUNDATION " };
  var LT = 0.54;
  var FONT_FAM = '"FG Futurist","Futura","Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif';

  var W, H, CX, CY, R, COLS, ROWS, CELL, trail, dissolve = 0, glow = 0, spin = 0;
  var INK = {};

  var letterCell = null, fullRect = null, wordReady = false;
  var WFX = 45 / 1440, WFY = 320 / 810, WFW = 1300 / 1440, WFH = 216 / 810;
  var SATSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" zoomAndPan="magnify" viewBox="0 0 1440 809.999993" height="1080" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g/><clipPath id="78bd0332f4"><rect x="0" width="1308" y="0" height="332"/></clipPath></defs><g transform="matrix(1, 0, 0, 1, 45, 271)"><g clip-path="url(#78bd0332f4)"><g fill="#000000" fill-opacity="1"><g transform="translate(0.920407, 261.43488)"><g><path d="M 126.3125 -149.8125 C 125.78125 -164.414062 121.328125 -175.675781 112.953125 -183.59375 C 104.585938 -191.519531 93.816406 -195.484375 80.640625 -195.484375 C 67.648438 -195.484375 57.367188 -192.097656 49.796875 -185.328125 C 42.234375 -178.566406 38.453125 -169.039062 38.453125 -156.75 C 38.453125 -147.5 41.566406 -139.578125 47.796875 -132.984375 C 54.023438 -126.398438 62.835938 -122.128906 74.234375 -120.171875 L 100.140625 -115.625 C 117.234375 -112.78125 130.941406 -106.550781 141.265625 -96.9375 C 151.585938 -87.320312 156.75 -73.96875 156.75 -56.875 C 156.75 -44.769531 153.722656 -34.085938 147.671875 -24.828125 C 141.617188 -15.578125 133.335938 -8.414062 122.828125 -3.34375 C 112.328125 1.726562 100.40625 4.265625 87.0625 4.265625 C 72.632812 4.265625 59.898438 1.507812 48.859375 -4 C 37.828125 -9.519531 29.101562 -17.707031 22.6875 -28.5625 C 16.28125 -39.425781 12.722656 -52.867188 12.015625 -68.890625 L 33.921875 -68.890625 C 34.984375 -51.804688 39.921875 -38.367188 48.734375 -28.578125 C 57.546875 -18.785156 70.320312 -13.890625 87.0625 -13.890625 C 96.675781 -13.890625 105.039062 -15.800781 112.15625 -19.625 C 119.28125 -23.457031 124.84375 -28.617188 128.84375 -35.109375 C 132.851562 -41.609375 134.859375 -48.863281 134.859375 -56.875 C 134.859375 -68.445312 131.5625 -77.394531 124.96875 -83.71875 C 118.382812 -90.039062 106.640625 -94.625 89.734375 -97.46875 L 69.96875 -100.9375 C 61.0625 -102.539062 52.515625 -105.429688 44.328125 -109.609375 C 36.140625 -113.796875 29.460938 -119.71875 24.296875 -127.375 C 19.140625 -135.03125 16.5625 -144.644531 16.5625 -156.21875 C 16.5625 -166.363281 18.425781 -175.039062 22.15625 -182.25 C 25.894531 -189.46875 30.878906 -195.300781 37.109375 -199.75 C 43.347656 -204.195312 50.296875 -207.441406 57.953125 -209.484375 C 65.609375 -211.535156 73.265625 -212.5625 80.921875 -212.5625 C 92.484375 -212.5625 103.25 -210.335938 113.21875 -205.890625 C 123.195312 -201.441406 131.34375 -194.585938 137.65625 -185.328125 C 143.976562 -176.066406 147.5 -164.226562 148.21875 -149.8125 Z M 126.3125 -149.8125 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(155.798016, 261.43488)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(222.020751, 261.43488)"><g><path d="M 5.34375 0 L 84.125 -208.296875 L 108.15625 -208.296875 L 186.9375 0 L 165.84375 0 L 145.8125 -53.9375 C 143.132812 -61.0625 137.96875 -64.625 130.3125 -64.625 L 62.75 -64.625 C 55.09375 -64.625 49.929688 -61.0625 47.265625 -53.9375 L 26.96875 0 Z M 123.375 -82.25 C 127.113281 -82.25 129.601562 -83.316406 130.84375 -85.453125 C 132.09375 -87.585938 132.1875 -90.171875 131.125 -93.203125 L 108.15625 -161.5625 C 105.476562 -169.75 101.5625 -173.84375 96.40625 -173.84375 C 91.414062 -173.84375 87.585938 -169.75 84.921875 -161.5625 L 61.953125 -93.203125 C 60.890625 -90.171875 61.023438 -87.585938 62.359375 -85.453125 C 63.691406 -83.316406 66.226562 -82.25 69.96875 -82.25 Z M 123.375 -82.25 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(400.397249, 261.43488)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(466.619984, 261.43488)"><g><path d="M 139.40625 -208.296875 L 139.40625 -190.671875 L 93.203125 -190.671875 C 89.992188 -190.671875 87.410156 -189.515625 85.453125 -187.203125 C 83.492188 -184.890625 82.515625 -182.21875 82.515625 -179.1875 L 82.515625 0 L 62.21875 0 L 62.21875 -179.1875 C 62.21875 -182.394531 61.191406 -185.109375 59.140625 -187.328125 C 57.097656 -189.554688 54.566406 -190.671875 51.546875 -190.671875 L 5.34375 -190.671875 L 5.34375 -208.296875 Z M 139.40625 -208.296875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(597.464666, 261.43488)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(663.6874, 261.43488)"><g><path d="M 93.46875 4.265625 C 70.320312 4.265625 52.515625 -1.960938 40.046875 -14.421875 C 27.585938 -26.878906 21.359375 -44.859375 21.359375 -68.359375 L 21.359375 -208.296875 L 41.65625 -208.296875 L 41.65625 -71.828125 C 41.65625 -52.960938 46.0625 -38.585938 54.875 -28.703125 C 63.6875 -18.828125 76.550781 -13.890625 93.46875 -13.890625 C 110.375 -13.890625 123.234375 -18.828125 132.046875 -28.703125 C 140.867188 -38.585938 145.28125 -52.960938 145.28125 -71.828125 L 145.28125 -208.296875 L 165.5625 -208.296875 L 165.5625 -68.359375 C 165.5625 -44.859375 159.332031 -26.878906 146.875 -14.421875 C 134.414062 -1.960938 116.613281 4.265625 93.46875 4.265625 Z M 93.46875 4.265625 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(836.723226, 261.43488)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(902.945998, 261.43488)"><g><path d="M 21.359375 0 L 21.359375 -208.296875 L 79.578125 -208.296875 C 92.753906 -208.296875 104.503906 -206.335938 114.828125 -202.421875 C 125.148438 -198.503906 133.296875 -192.316406 139.265625 -183.859375 C 145.234375 -175.398438 148.21875 -164.316406 148.21875 -150.609375 C 148.21875 -139.753906 145.898438 -130.363281 141.265625 -122.4375 C 136.640625 -114.519531 130.675781 -108.113281 123.375 -103.21875 C 116.070312 -98.320312 108.414062 -95.070312 100.40625 -93.46875 C 97.207031 -92.9375 95.335938 -91.957031 94.796875 -90.53125 C 94.085938 -89.101562 94.535156 -87.144531 96.140625 -84.65625 L 155.15625 0 L 131.125 0 L 76.90625 -80.109375 C 70.851562 -89.015625 63.554688 -92.578125 55.015625 -90.796875 C 50.921875 -89.898438 47.671875 -87.847656 45.265625 -84.640625 C 42.859375 -81.441406 41.65625 -77.082031 41.65625 -71.5625 L 41.65625 0 Z M 41.65625 -120.703125 C 41.65625 -117.492188 42.8125 -114.773438 45.125 -112.546875 C 47.445312 -110.328125 50.117188 -109.21875 53.140625 -109.21875 L 77.4375 -109.21875 C 92.75 -109.21875 104.722656 -112.910156 113.359375 -120.296875 C 121.992188 -127.691406 126.3125 -137.796875 126.3125 -150.609375 C 126.3125 -164.679688 121.992188 -174.875 113.359375 -181.1875 C 104.722656 -187.507812 92.75 -190.671875 77.4375 -190.671875 L 53.140625 -190.671875 C 49.929688 -190.671875 47.210938 -189.515625 44.984375 -187.203125 C 42.765625 -184.890625 41.65625 -182.21875 41.65625 -179.1875 Z M 41.65625 -120.703125 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(1052.215936, 261.43488)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(1118.438631, 261.43488)"><g><path d="M 21.359375 -208.296875 L 51.265625 -208.296875 L 148.75 -40.59375 C 149.8125 -38.8125 150.832031 -37.34375 151.8125 -36.1875 C 152.789062 -35.03125 154.171875 -34.453125 155.953125 -34.453125 C 159.160156 -34.453125 160.765625 -36.765625 160.765625 -41.390625 L 160.765625 -208.296875 L 181.0625 -208.296875 L 181.0625 0 L 151.15625 0 L 52.875 -168.5 C 51.625 -170.457031 50.550781 -172.015625 49.65625 -173.171875 C 48.769531 -174.335938 47.53125 -174.921875 45.9375 -174.921875 C 43.082031 -174.921875 41.65625 -172.691406 41.65625 -168.234375 L 41.65625 0 L 21.359375 0 Z M 21.359375 -208.296875 "/></g></g></g></g></g></svg>';
  var wordImg = new Image();
  wordImg.onload = function () { wordReady = true; buildWordMask(); };
  wordImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SATSVG);

  function buildWordMask() {
    if (!wordReady || !W || !COLS) return;
    var tw = Math.min(W * 0.74, 1180);
    var fw = tw / WFW, fh = fw * (810 / 1440);
    var fx = W / 2 - (WFX + WFW / 2) * fw, fy = H / 2 - (WFY + WFH / 2) * fh;
    fullRect = { x: fx, y: fy, w: fw, h: fh };
    var mc = document.createElement("canvas"); mc.width = W; mc.height = H;
    var m2 = mc.getContext("2d");
    m2.drawImage(wordImg, fx, fy, fw, fh);
    var data = m2.getImageData(0, 0, W, H).data;
    var raw = new Uint8Array(COLS * ROWS);
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      var px = Math.min(W - 1, (c * CELL + CELL / 2) | 0), py = Math.min(H - 1, (r * CELL + CELL / 2) | 0);
      if (data[(py * W + px) * 4 + 3] > 40) raw[r * COLS + c] = 1;
    }
    var lc = new Uint8Array(COLS * ROWS);
    for (var r2 = 0; r2 < ROWS; r2++) for (var c2 = 0; c2 < COLS; c2++) {
      var i = r2 * COLS + c2;
      if (raw[i]) { lc[i] = 2; continue; }
      var gap = 0;
      for (var dr = -1; dr <= 1 && !gap; dr++) for (var dc = -1; dc <= 1; dc++) {
        var rr = r2 + dr, cc = c2 + dc; if (rr < 0 || cc < 0 || rr >= ROWS || cc >= COLS) continue;
        if (raw[rr * COLS + cc]) { gap = 1; break; }
      }
      lc[i] = gap ? 1 : 0;
    }
    letterCell = lc;
  }

  function neededChars() {
    var s = {};
    CFG.ramp.split("").forEach(function (c) { s[c] = 1; });
    MARKS.forEach(function (c) { s[c] = 1; });
    for (var k in RINGS) RINGS[k].split("").forEach(function (c) { s[c] = 1; });
    return s;
  }
  function makeSet(color) {
    var set = {}, chars = neededChars();
    for (var c in chars) {
      if (c === " ") continue;
      var m = document.createElement("canvas");
      var px = Math.ceil(CELL * 1.6 * DPR);
      m.width = px; m.height = px;
      var x = m.getContext("2d");
      x.scale(DPR, DPR);
      x.font = "300 " + (CELL * 1.02) + "px " + FONT_FAM;
      x.fillStyle = color; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(c, CELL * 0.8, CELL * 0.8 + 0.5);
      set[c] = m;
    }
    return set;
  }
  function rebuildSets() { INK = makeSet(INK_COLOR); }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; CX = W / 2; CY = H / 2;
    var mob = W < 600;
    CELL = mob ? Math.max(4, CFG.cell - 1) : CFG.cell;
    R = Math.min(W, H) * (mob ? 0.30 : 0.34);
    COLS = Math.ceil(W / CELL); ROWS = Math.ceil(H / CELL);
    trail = new Float32Array(COLS * ROWS);
    rebuildSets();
    buildWordMask();
  }
  resize(); window.addEventListener("resize", resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuildSets);

  var mx = -1e4, my = -1e4;
  window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
  window.addEventListener("mouseout", function () { mx = -1e4; my = -1e4; });

  window.addEventListener("wheel", function (e) {
    var v = Math.min(1, Math.abs(e.deltaY) * 0.004);
    dissolve = Math.min(1, dissolve + v * 0.55); glow = Math.min(1, glow + v * 0.5);
  }, { passive: true });
  window.addEventListener("touchmove", function () {
    dissolve = Math.min(1, dissolve + 0.07); glow = Math.min(1, glow + 0.08);
  }, { passive: true });

  var ESQ = 0.36, ROT = -Math.PI / 6;
  var cA = Math.cos(ROT), sA = Math.sin(ROT);
  var BANDS = [[1.32, 1.54, "r0", 0.55], [1.62, 1.94, "r1", 0.38], [2.02, 2.26, "r2", 0.26]];
  function hash(n) { var s = Math.sin(n) * 43758.5453; return s - Math.floor(s); }

  var hint = document.getElementById("hero-hint");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function frame(tms) {
    /* skip work when the hero is scrolled out of view */
    if (window.scrollY > H * 1.25) { if (!still) requestAnimationFrame(frame); return; }
    var t = tms * 0.001;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    var fade = Math.min(1, t / 2);
    dissolve *= 0.94; if (dissolve < 0.004) dissolve = 0;
    glow *= 0.95; if (glow < 0.004) glow = 0;
    spin += CFG.spin * 0.012 * (1 + glow * 4);

    if (hint) hint.style.opacity = String(Math.max(0, 1 - glow * 2 - window.scrollY / (H * 0.4)));

    if (mx > -1e3) {
      var mc = Math.floor(mx / CELL), mr = Math.floor(my / CELL);
      for (var dr = -5; dr <= 5; dr++) for (var dc = -5; dc <= 5; dc++) {
        var rr2 = mr + dr, cc2 = mc + dc;
        if (rr2 < 0 || cc2 < 0 || rr2 >= ROWS || cc2 >= COLS) continue;
        var dd = Math.sqrt(dr * dr + dc * dc);
        if (dd < 5.2) { var g = trail[rr2 * COLS + cc2] + 0.2 * (1 - dd / 5.2); trail[rr2 * COLS + cc2] = Math.min(1.2, g); }
      }
    }

    var lx = -0.38, ly = -0.46, lz = 0.8;
    var ll = Math.sqrt(lx * lx + ly * ly + lz * lz); lx /= ll; ly /= ll; lz /= ll;

    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var ti = row * COLS + col;
        var tv = trail[ti];
        if (tv > 0.003) trail[ti] = tv * 0.94; else trail[ti] = 0;
        var Xs = col * CELL + CELL / 2 - CX, Ys = row * CELL + CELL / 2 - CY;
        var X = Xs * cA - Ys * sA, Y = Xs * sA + Ys * cA;
        var breathe = 1 + 0.018 * Math.sin(t * 0.6);
        var Rb = R * breathe;
        var lum = 0, which = null, seq = 0;
        var u = X, v = Y / ESQ;
        var rr = Math.sqrt(u * u + v * v) / Rb;
        var th = Math.atan2(v, u);
        var front = Y > 0;
        var d2 = X * X + Y * Y;
        var inP = d2 < Rb * Rb;
        var ringHit = null;
        for (var b = 0; b < 3; b++) { if (rr >= BANDS[b][0] && rr <= BANDS[b][1]) { ringHit = BANDS[b]; break; } }

        if (ringHit && (front || !inP)) {
          var rn = (rr - ringHit[0]) / (ringHit[1] - ringHit[0]);
          var prof = Math.sin(rn * 3.14159);
          var thR = th + t * ringHit[3] + spin * 0.04;
          var shim = 0.72 + 0.28 * Math.sin(thR * 3 + rn * 9 + t * 0.3);
          var grain = 0.82 + 0.18 * Math.sin(rn * 22 + thR * 1.5);
          var part = CFG.particles ? (0.85 + 0.15 * Math.sin(rn * 60 + thR * 8 - t * 1.4)) : 1;
          lum = prof * shim * grain * part * (front ? 0.94 : 0.4);
          which = ringHit[2];
          var word = RINGS[which];
          var circ = rr * Rb * 6.28318;
          var slots = Math.max(word.length, Math.round(circ / CELL));
          var a01 = ((thR / 6.28318) % 1 + 1) % 1;
          seq = Math.floor(a01 * slots);
        } else if (inP) {
          var zr = Math.sqrt(Rb * Rb - d2);
          var nx = X / Rb, ny = -Y / Rb, nz = zr / Rb;
          var diff = Math.max(0, nx * lx + ny * ly + nz * lz);
          var lat = Math.asin(Math.max(-1, Math.min(1, ny)));
          var lon = Math.atan2(nx, nz) + spin * 0.05;
          var bandS = 0.72 + 0.28 * Math.sin(lat * 7 + 0.9 * Math.sin(lon * 2.3 + t * 0.22) + 0.5 * Math.sin(lon * 4.1 - t * 0.16));
          lum = (0.08 + 0.95 * diff) * bandS;
          var edge = Math.min(1, (1 - Math.sqrt(d2) / Rb) * 7);
          lum *= 0.3 + 0.7 * edge;
          which = "planet";
        }
        if (!which) continue;
        if (lum < 0.02) continue;

        var ch;
        if (which === "planet") {
          var ramp = CFG.ramp;
          var lm = Math.pow(Math.min(1, lum), 0.72);
          ch = ramp[Math.floor((1 - lm) * (ramp.length - 1) + 0.0001)];
        } else if (CFG.textRings) {
          if (lum <= LT * 0.45) continue;
          var word2 = RINGS[which];
          ch = word2[((seq % word2.length) + word2.length) % word2.length];
        } else {
          ch = MARKS[Math.floor(Math.min(1, lum) * (MARKS.length - 0.001))];
        }
        if (!ch || ch === " ") continue;
        if (letterCell && letterCell[ti]) continue;

        var sp = INK[ch]; if (!sp) continue;
        var sz = CELL * 1.6;
        var ox = col * CELL + (CELL - sz) / 2, oy = row * CELL + (CELL - sz) / 2;
        var alpha = (0.2 + 0.62 * Math.min(1, lum)) * fade;
        var dz = Math.max(dissolve * (0.5 + 0.95 * hash(ti * 3)), tv * 0.9);
        if (dz > 0.002) {
          var hn = hash(ti * 1.7), ang = hn * 6.28318;
          ox += Math.cos(ang) * dz * CELL * 2.4;
          oy -= (0.4 + 1.1 * hn) * dz * CELL * 4.5;
          alpha *= Math.max(0, 1 - dz * 1.15);
        }
        if (alpha < 0.004) continue;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sp, ox, oy, sz, sz);
      }
    }
    if (wordReady && fullRect) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.shadowColor = "rgba(0,0,0,0.16)";
      ctx.shadowBlur = CELL * 1.6;
      ctx.shadowOffsetY = CELL * 0.6;
      ctx.drawImage(wordImg, fullRect.x, fullRect.y, fullRect.w, fullRect.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (!still) requestAnimationFrame(frame);
  }
  if (still) frame(2500); else requestAnimationFrame(frame);
})();
